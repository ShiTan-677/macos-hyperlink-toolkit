// Exercises real AppKit with a PRIVATE pasteboard, never the user's clipboard.
ObjC.import('AppKit');
function run(argv) {
    if (argv.length !== 1) throw new Error('Pass the absolute path to src/common.js.');
    const source = ObjC.unwrap($.NSString.stringWithContentsOfFileEncodingError($(argv[0]), $.NSUTF8StringEncoding, null));
    if (!source) throw new Error('Cannot read source');
    eval(source);
    const board = $.NSPasteboard.pasteboardWithUniqueName;
    try {
        const page = {url: 'https://example.com/?a=1&b=2', title: '论文 "A&B" <链接>'};
        const expected = {
            'public.html': richHTML(page), 'public.utf8-plain-text': page.url,
            'public.url': page.url, 'public.url-name': page.title
        };
        writeClipboard(expected, board);
        if (Number(board.pasteboardItems.count) !== 1) throw new Error('Expected one clipboard item');
        Object.keys(expected).forEach(function (type) {
            const actual = ObjC.unwrap(board.stringForType($(type)));
            if (actual !== expected[type]) throw new Error('Clipboard mismatch for ' + type);
        });
        // Confirm AppKit can decode the HTML as a real attributed hyperlink.
        const data = board.dataForType($('public.html'));
        const attributed = $.NSAttributedString.alloc.initWithHTMLDocumentAttributes(data, null);
        if (ObjC.unwrap(attributed.string) !== page.title) throw new Error('HTML title was not decoded correctly');
        const link = attributed.attributeAtIndexEffectiveRange($.NSLinkAttributeName, 0, null);
        if (ObjC.unwrap(link.absoluteString) !== page.url) throw new Error('HTML link target mismatch');
        writeClipboard({'public.utf8-plain-text': excelHyperlink(page)}, board);
        if (ObjC.unwrap(board.stringForType($('public.utf8-plain-text'))) !== excelHyperlink(page)) {
            throw new Error('Formula clipboard mismatch');
        }
        return 'PASS: AppKit clipboard round trip, HTML link decoding, Unicode, and formula text (private pasteboard).';
    } finally {
        board.releaseGlobally;
    }
}
