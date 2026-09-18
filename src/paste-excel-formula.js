// Suggested shortcut: Control + Option + V (⌃⌥V).
// Replaces the active cell, even if it already contains data. Does not save.
function run(input, parameters) {
    return performAction(pasteExcelFormula, input);
}
