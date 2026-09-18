# Release checklist

1. Update `VERSION`, the changelog, and both READMEs. Keep compatibility claims aligned with `VALIDATION.md`.
2. Run the README's build/test commands and Apple JXA compilation checks. Review CI results when available.
3. Extract the built ZIP into a new directory. Install only the desired workflows, authorize from their actual host, run from Services, and verify keyboard shortcuts separately.
4. Test Safari → rich hyperlink → Excel/TextEdit, and Safari → formula → Excel writer in an empty workbook. Include Unicode and quoted titles. Check plain-text URL fallback and failure with Excel not in front.
5. Test removal, then reinstall. Check updates against an existing installation and shortcut conflicts with older service names.
6. For a public release, also test a ZIP downloaded through a browser so quarantine/first-run behavior is included. Prefer a fresh macOS account or another Mac for first-run permissions and the Safari-only case.
7. Review the exact tracked files and the ZIP contents. Confirm there are no personal paths/data, broken download links, or unsupported compatibility claims.
8. Create a release tagged `v<VERSION>` at the reviewed commit. Upload the versioned ZIP and `SHA256SUMS.txt`, not the unpacked workflow bundles. Use draft/prerelease status while user acceptance remains incomplete.
9. Download the uploaded ZIP, verify `shasum -a 256 -c SHA256SUMS.txt`, and check that the source version and installed behavior match.

The automatic **Source code** assets are not the install package. CI artifacts are build outputs, not evidence that installation passed. A release does not need an automatic updater or a Homebrew formula.

## Shortcuts distribution

The supported candidate for 0.1.0 is Automator. Before offering `.shortcut` files, import each workflow through Shortcuts, verify that all actions convert, test frontmost-app detection and Automation consent from a shortcut, then export for **Anyone** or use Apple's `shortcuts sign --mode anyone` flow. Signing submits a copy of the shortcut to Apple. Do not publish an untested renamed plist as an installable shortcut.

Apple references:
- [Import workflows](https://support.apple.com/guide/shortcuts-mac/apd02bffbaac/mac)
- [Share shortcuts](https://support.apple.com/guide/shortcuts-mac/apdf01f8c054/mac)
- [Automator scripts](https://support.apple.com/guide/automator/aut4bb6b2b4f/mac)
