# Release checklist

1. Update `VERSION`, the changelog, and both READMEs. Keep compatibility claims aligned with `VALIDATION.md`.
2. Run the README's build/test commands and Apple JXA compilation checks. Review CI results when available.
3. Extract the built ZIP into a new directory. Install only the desired workflows, authorize from their actual host, run from Services, and verify keyboard shortcuts separately.
4. Test Safari → rich hyperlink → Excel/TextEdit, and Safari → formula → Excel writer in an empty workbook. Include Unicode and quoted titles. Check plain-text URL fallback and failure with Excel not in front.
5. Test removal, then reinstall. Check updates against an existing installation and shortcut conflicts with older service names.
6. Test a ZIP downloaded through a browser so quarantine/first-run behavior is included. Use the [first-use checklist](FIRST-USE-CHECK.md) for independent feedback. Record existing-account and fresh-account results separately.
7. Review the exact tracked files and the ZIP contents. Confirm there are no personal paths/data, broken download links, or unsupported compatibility claims.
8. Create a release tagged `v<VERSION>` at the reviewed commit. Upload the versioned ZIP and `SHA256SUMS.txt`, not the unpacked workflow bundles. Keep it a draft while preparing assets; publish as a **prerelease** when the tested core flow is ready and remaining compatibility checks are listed. A draft is not publicly downloadable.
9. Download the uploaded ZIP without GitHub authentication, verify `shasum -a 256 -c SHA256SUMS.txt`, and check that the ZIP matches the reviewed source. Check the direct download link in both READMEs. Once public, treat the tag and assets as immutable; ship corrections under a new version.

The automatic **Source code** assets are not the install package. CI artifacts are build outputs, not evidence that installation passed. A release does not need an automatic updater or a Homebrew formula.

For 0.1.0, Safari → Excel is the accepted core flow. Fresh-account permissions, keyboard invocation, other receivers/browsers, and cross-version upgrades remain open compatibility checks, not claims of support. An independent first-use test and demo recording can follow the public preview. Do not mark either complete until the actual feedback or recording exists.

## Shortcuts distribution

The supported candidate for 0.1.0 is Automator. Before offering `.shortcut` files, import each workflow through Shortcuts, verify that all actions convert, test frontmost-app detection and Automation consent from a shortcut, then export for **Anyone** or use Apple's `shortcuts sign --mode anyone` flow. Signing submits a copy of the shortcut to Apple. Do not publish an untested renamed plist as an installable shortcut.

Apple references:
- [Import workflows](https://support.apple.com/guide/shortcuts-mac/apd02bffbaac/mac)
- [Share shortcuts](https://support.apple.com/guide/shortcuts-mac/apdf01f8c054/mac)
- [Automator scripts](https://support.apple.com/guide/automator/aut4bb6b2b4f/mac)
