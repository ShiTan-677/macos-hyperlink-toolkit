// Opt-in integration check: creates and closes one unsaved scratch workbook.
// Temporarily uses the general clipboard, restoring every saved representation
// unless another application has changed it in the meantime. No user cell data
// or clipboard contents are printed. Requires Microsoft Excel and Automation.
ObjC.import('AppKit');

function run(argv) {
    if (argv.length !== 1) throw new Error('Pass the absolute path to src/common.js.');
    const source = ObjC.unwrap($.NSString.stringWithContentsOfFileEncodingError($(argv[0]), $.NSUTF8StringEncoding, null));
    if (!source) throw new Error('Cannot read source');
    eval(source);
    const excel = Application('com.microsoft.Excel');
    if (!excel.running()) throw new Error('Open Microsoft Excel before running this opt-in test.');
    // Isolate the real Excel scripting interface from GUI focus. The production
    // foreground guard is tested separately and still needs Services acceptance.
    frontAppID = function () { return 'com.microsoft.Excel'; };
    const clipboard = $.NSPasteboard.generalPasteboard;
    const savedItems = $.NSMutableArray.alloc.init;
    const currentItems = clipboard.pasteboardItems;
    for (let i = 0; i < Number(currentItems.count); i++) {
        const original = currentItems.objectAtIndex(i);
        const saved = $.NSPasteboardItem.alloc.init;
        for (let j = 0; j < Number(original.types.count); j++) {
            const type = original.types.objectAtIndex(j);
            if (!saved.setDataForType(original.dataForType(type), type)) {
                throw new Error('Cannot preserve the clipboard; test cancelled.');
            }
        }
        savedItems.addObject(saved);
    }
    let workbook;
    let ownedClipboardChange = null;
    try {
        workbook = excel.make({new: 'workbook'});
        const name = workbook.name();
        if (excel.activeWorkbook.name() !== name) throw new Error('Scratch workbook is not active; refusing to write.');
        const page = {url: 'https://example.com/?a=1&b=2', title: '论文 "A&B" <链接>'};
        const formula = excelHyperlink(page);
        writeClipboard({'public.utf8-plain-text': formula});
        ownedClipboardChange = Number(clipboard.changeCount);
        if (excel.activeWorkbook.name() !== name) throw new Error('Active workbook changed; refusing to write.');
        pasteExcelFormula();
        if (excel.activeCell.formula() !== formula) throw new Error('Formula readback mismatch.');
        if (excel.activeCell.value() !== page.title) throw new Error('Calculated title mismatch.');
        const address = excel.getAddress(excel.activeCell);
        if (address !== '$A$1') throw new Error('Unexpected scratch cell address: ' + address);
        return 'PASS: real Excel formula write/readback and calculated Unicode title (foreground guard simulated; Services acceptance separate).';
    } finally {
        try {
            if (workbook) workbook.close({saving: 'no'});
        } finally {
            if (ownedClipboardChange !== null && Number(clipboard.changeCount) === ownedClipboardChange) {
                clipboard.clearContents;
                if (Number(savedItems.count) > 0 && !clipboard.writeObjects(savedItems)) {
                    throw new Error('Could not restore the clipboard after testing.');
                }
            }
        }
    }
}
