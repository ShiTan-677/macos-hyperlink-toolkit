// macOS Hyperlink Toolkit — MIT License. Copyright (c) 2026 HAN Fang.
// Shared JXA source, embedded into each standalone script at build time.

ObjC.import('AppKit');

function message(english, chinese) {
    const language = ObjC.unwrap($.NSLocale.preferredLanguages.firstObject) || '';
    return language.indexOf('zh') === 0 ? chinese : english;
}

function htmlEscape(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function normalizePage(page) {
    if (!page || typeof page.url !== 'string' || !page.url.trim()) {
        throw new Error(message('The current tab has no URL.', '当前标签页没有可用的 URL。'));
    }
    const url = page.url.trim();
    // Control characters would split a plain-text paste into multiple cells/lines.
    if (/[\u0000-\u001f\u007f]/.test(url)) {
        throw new Error(message('The URL contains control characters.', 'URL 包含无效控制字符。'));
    }
    const title = typeof page.title === 'string' ? page.title.replace(/\s+/g, ' ').trim() : '';
    return {url: url, title: title || url};
}

function richHTML(page) {
    page = normalizePage(page);
    return '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>' +
        '<a href="' + htmlEscape(page.url) + '">' + htmlEscape(page.title) + '</a>' +
        '</body></html>';
}

function excelHyperlink(page) {
    page = normalizePage(page);
    function quote(value) { return '"' + value.replace(/"/g, '""') + '"'; }
    return '=HYPERLINK(' + quote(page.url) + ',' + quote(page.title) + ')';
}

function formulaFromText(text) {
    const formula = typeof text === 'string' ? text.trim() : '';
    if (formula.length < 2 || formula.charAt(0) !== '=') {
        throw new Error(message('Copy an Excel formula starting with = first.', '请先复制以 = 开头的 Excel 公式。'));
    }
    return formula;
}

function frontAppID() {
    const id = ObjC.unwrap($.NSWorkspace.sharedWorkspace.frontmostApplication.bundleIdentifier);
    if (!id) {
        throw new Error(message('Cannot identify the frontmost app. Run this from the app’s Services menu.',
            '无法识别前台应用。请从应用的“服务”菜单运行。'));
    }
    return id;
}

function currentBrowserPage() {
    const id = frontAppID();
    if (['com.apple.Safari', 'com.google.Chrome', 'com.microsoft.edgemac'].indexOf(id) === -1) {
        throw new Error(message('Bring Safari, Google Chrome, or Microsoft Edge to the front, then run this action.',
            '请先将 Safari、Google Chrome 或 Microsoft Edge 切到前台，再运行此操作。'));
    }
    // Resolve only the selected browser. Other browsers need not be installed.
    const browser = Application(id);
    if (browser.windows.length === 0) {
        throw new Error(message('The browser has no open window.', '浏览器没有打开的窗口。'));
    }
    const tab = id === 'com.apple.Safari' ? browser.windows[0].currentTab : browser.windows[0].activeTab;
    return normalizePage({url: tab.url(), title: id === 'com.apple.Safari' ? tab.name() : tab.title()});
}

function writeClipboard(representations, clipboard) {
    // Prepare a complete item before replacing the user's clipboard.
    const item = $.NSPasteboardItem.alloc.init;
    Object.keys(representations).forEach(function (type) {
        if (!item.setStringForType($(representations[type]), $(type))) {
            throw new Error(message('Could not prepare the clipboard item.', '无法准备剪贴板内容。'));
        }
    });
    clipboard = clipboard || $.NSPasteboard.generalPasteboard;
    clipboard.clearContents;
    if (!clipboard.writeObjects($.NSArray.arrayWithObject(item))) {
        throw new Error(message('Could not write to the clipboard. Please try again.', '无法写入剪贴板，请重试。'));
    }
}

function copyRichLink() {
    const page = currentBrowserPage();
    writeClipboard({
        'public.html': richHTML(page),
        'public.utf8-plain-text': page.url,
        'public.url': page.url,
        'public.url-name': page.title
    });
    notify(message('Link copied. Paste with Command + V.', '链接已复制，按 Command + V 粘贴。'));
}

function copyExcelHyperlink() {
    const page = currentBrowserPage();
    writeClipboard({'public.utf8-plain-text': excelHyperlink(page)});
    notify(message('Formula copied. Use “HLT - Paste Excel Formula” in Excel.',
        '公式已复制，请在 Excel 中运行“HLT - Paste Excel Formula”。'));
}

function pasteExcelFormula() {
    if (frontAppID() !== 'com.microsoft.Excel') {
        throw new Error(message('Select a cell in Microsoft Excel first. No cell was changed.',
            '请先在 Microsoft Excel 中选中目标单元格。未修改任何单元格。'));
    }
    const excel = Application('com.microsoft.Excel');
    if (excel.workbooks.length === 0) {
        throw new Error(message('Open an Excel workbook and select a cell first.', '请先打开 Excel 工作簿并选中单元格。'));
    }
    const formula = formulaFromText(ObjC.unwrap(
        $.NSPasteboard.generalPasteboard.stringForType($('public.utf8-plain-text'))));
    // Keep the property specifier. Excel can return an unusable reference from
    // activeCell(); sending that reference back causes Apple event error -1728.
    const cell = excel.activeCell;
    if (!excel.getAddress(cell)) {
        throw new Error(message('Select a worksheet cell first.', '请先选中工作表中的单元格。'));
    }
    // Recheck after any first-run Automation prompt before touching the workbook.
    if (frontAppID() !== 'com.microsoft.Excel') {
        throw new Error(message('Excel is no longer in front. Select the target cell and try again.',
            'Excel 已不在前台，请重新选中目标单元格后重试。'));
    }
    cell.formula = formula;
}

function notify(text) {
    // Notification permission is optional. A successful copy stays successful.
    try {
        const app = Application.currentApplication();
        app.includeStandardAdditions = true;
        app.displayNotification(text, {withTitle: 'macOS Hyperlink Toolkit'});
    } catch (_) {}
}

function performAction(action, input) {
    try {
        action();
    } catch (error) {
        const detail = String(error.message || error);
        if (Number(error.errorNumber) === -1743 || /-1743|not authorized|not permitted to send Apple events/i.test(detail)) {
            throw new Error(message('Automation access was denied. Open System Settings > Privacy & Security > Automation, allow the workflow host to control the target app, then try again.',
                '自动化权限被拒绝。请在“系统设置 → 隐私与安全性 → 自动化”中，允许运行工作流的应用控制目标应用，然后重试。'));
        }
        // Let Automator show the error and preserve a nonzero CLI exit status.
        throw error;
    }
    return input;
}
