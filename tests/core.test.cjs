const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {test} = require('node:test');
const source = fs.readFileSync(path.join(__dirname, '../src/common.js'), 'utf8');

function runtime(options = {}) {
    const state = {id: options.id || 'com.apple.Safari', calls: [], clears: 0, items: [], writes: [], notifications: []};
    const $ = value => value;
    $.NSLocale = {preferredLanguages: {firstObject: options.language || 'en'}};
    $.NSWorkspace = {sharedWorkspace: {get frontmostApplication() { return {bundleIdentifier: state.id}; }}};
    $.NSArray = {arrayWithObject: item => [item]};
    $.NSPasteboardItem = {alloc: {get init() { return {
        values: {}, setStringForType(value, type) {
            if (options.prepareFails) return false;
            this.values[type] = value; return true;
        }
    }; }}};
    $.NSPasteboard = {generalPasteboard: {
        get clearContents() { state.clears++; state.items = []; return 1; },
        writeObjects(items) { state.items = items; return !options.writeFails; },
        stringForType() { return options.clipboard === undefined ? '=1+1' : options.clipboard; }
    }};
    // JXA property specifiers are callable. Excel's resolved activeCell() value
    // is not interchangeable with the property specifier (native error -1728).
    function cell() { return {resolvedCell: true}; }
    Object.defineProperty(cell, 'formula', {set(value) { state.writes.push(value); }});
    const page = options.page || {url: 'https://example.com/', title: 'Example Domain'};
    const tab = {url: () => page.url, title: () => page.title, name: () => page.title};
    function Application(id) {
        state.calls.push(id);
        if (options.denied) throw Object.assign(new Error('denied'), {errorNumber: -1743});
        if (id === 'com.microsoft.Excel') return {
            workbooks: options.noWorkbook ? [] : [{}],
            activeCell: cell,
            getAddress(reference) {
                if (reference !== cell) throw Object.assign(new Error('The object you are trying to access does not exist'), {errorNumber: -1728});
                if (options.noCell) throw new Error('No active cell');
                if (options.switchAway) state.id = 'com.apple.finder';
                return '$A$1';
            }
        };
        return {windows: options.noWindow ? [] : [{currentTab: tab, activeTab: tab}]};
    }
    Application.currentApplication = () => ({displayNotification(text) {
        if (options.notificationFails) throw new Error('notifications unavailable');
        state.notifications.push(text);
    }});
    const context = vm.createContext({$, ObjC: {import() {}, unwrap: value => value}, Application});
    vm.runInContext(source, context);
    return {context, state};
}

test('HTML escapes both link text and href; Unicode survives', () => {
    const {context} = runtime();
    const html = context.richHTML({title: '论文 "A&B" <test> \'链接\'', url: 'https://example.com/?a="x"&b=2'});
    assert.ok(html.includes('href="https://example.com/?a=&quot;x&quot;&amp;b=2"'));
    assert.ok(html.includes('论文 &quot;A&amp;B&quot; &lt;test&gt; &#39;链接&#39;'));
});

test('formulas quote title and URL, collapse title whitespace, and fall back to URL', () => {
    const {context} = runtime();
    assert.equal(context.excelHyperlink({title: ' A\n"B"\t论文 ', url: 'https://example.com/?q="x"'}),
        '=HYPERLINK("https://example.com/?q=""x""","A ""B"" 论文")');
    assert.equal(context.excelHyperlink({url: 'https://example.com/', title: null}),
        '=HYPERLINK("https://example.com/","https://example.com/")');
    assert.throws(() => context.normalizePage({url: ''}), /no URL/);
    assert.throws(() => context.normalizePage({url: 'https://example.com/\nx'}), /control characters/);
});

test('each supported browser is resolved on demand and writes all four representations together', () => {
    for (const id of ['com.apple.Safari', 'com.google.Chrome', 'com.microsoft.edgemac']) {
        const {context, state} = runtime({id});
        context.copyRichLink();
        assert.deepEqual(state.calls, [id]);
        assert.equal(state.clears, 1);
        assert.equal(state.items.length, 1);
        const values = state.items[0].values;
        assert.equal(Object.keys(values).length, 4);
        assert.equal(values['public.utf8-plain-text'], 'https://example.com/');
        assert.equal(values['public.url-name'], 'Example Domain');
        assert.equal(values['public.url'], 'https://example.com/');
        assert.match(values['public.html'], /<a href="https:\/\/example.com\/">Example Domain<\/a>/);
    }
});

test('bad browser context, absent windows/URL, and prepare failure preserve clipboard', () => {
    for (const options of [{id: 'com.apple.finder'}, {noWindow: true}, {page: {url: ''}}, {prepareFails: true}]) {
        const {context, state} = runtime(options);
        assert.throws(() => context.copyRichLink());
        assert.equal(state.clears, 0);
        assert.equal(state.notifications.length, 0);
    }
});

test('pasteboard write failure is visible, while notification failure does not undo copying', () => {
    const failed = runtime({writeFails: true});
    assert.throws(() => failed.context.copyRichLink(), /Could not write/);
    assert.equal(failed.state.notifications.length, 0);
    const copied = runtime({notificationFails: true});
    copied.context.copyRichLink();
    assert.equal(copied.state.items.length, 1);
});

test('Excel copy creates one plain-text formula and explains the companion action', () => {
    const {context, state} = runtime();
    context.copyExcelHyperlink();
    assert.deepEqual(state.items[0].values, {'public.utf8-plain-text': '=HYPERLINK("https://example.com/","Example Domain")'});
    assert.match(state.notifications[0], /Paste Excel Formula/);
});

test('Excel writer refuses the wrong app before resolving Excel or touching data', () => {
    const {context, state} = runtime();
    assert.throws(() => context.pasteExcelFormula(), /Select a cell/);
    assert.deepEqual(state.calls, []);
    assert.deepEqual(state.writes, []);
});

test('Excel writer refuses no workbook, invalid text, missing cell, or focus changes', () => {
    for (const options of [{noWorkbook: true}, {clipboard: null}, {clipboard: 'https://example.com'},
        {clipboard: '='}, {noCell: true}, {switchAway: true}]) {
        const {context, state} = runtime({id: 'com.microsoft.Excel', ...options});
        assert.throws(() => context.pasteExcelFormula());
        assert.deepEqual(state.writes, []);
        assert.equal(state.clears, 0);
    }
});

test('Excel writer writes a trusted formula exactly once and leaves clipboard alone', () => {
    const {context, state} = runtime({id: 'com.microsoft.Excel', clipboard: '  =HYPERLINK("https://example.com/","论文")\n'});
    context.pasteExcelFormula();
    assert.deepEqual(state.writes, ['=HYPERLINK("https://example.com/","论文")']);
    assert.equal(state.clears, 0);
});

test('permission errors are actionable and localized', () => {
    for (const language of ['en', 'zh-Hans']) {
        const {context} = runtime({denied: true, language});
        assert.throws(() => context.performAction(context.copyRichLink, []), language === 'en' ? /Automation access/ : /自动化权限/);
    }
});
