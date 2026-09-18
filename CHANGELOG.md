# Changelog

## 0.1.0 — Unreleased

- Add an offline HTML setup guide and make the Services → General shortcut instructions visible immediately after installation.
- Clarify that copying must finish before switching apps, with troubleshooting for a clipboard that does not contain formula text. Record the successful local Services retest.
- Fix Excel error -1728 by retaining the `activeCell` property specifier instead of resolving `activeCell()` and sending the returned object back to Excel. Add an opt-in native Excel integration check.
- Copy the current Safari, Google Chrome, or Microsoft Edge page as a rich hyperlink or Excel `HYPERLINK()` formula.
- Write clipboard formulas into the active cell only while Microsoft Excel is in front.
- Build three self-contained Automator Quick Actions from shared JXA source.
- Provide English/Chinese setup, upgrade, uninstall and troubleshooting instructions.
- Use native frontmost-app detection, validate clipboard writes, and keep notifications optional.
- Document **Option + Command + K (⌥⌘K)** as the rich-link shortcut example.
