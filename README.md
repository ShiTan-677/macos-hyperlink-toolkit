# macOS Hyperlink Toolkit

[简体中文](README.zh-CN.md)

Copy a webpage as a **clickable title**, or as an Excel `HYPERLINK()` formula, using macOS Quick Actions.

```text
Safari / Chrome / Edge       Excel / rich-text editor       Plain-text editor
        ⌥⌘K          →         Example Domain          or   https://example.com/
                              (clickable title)
```

**Start with Copy Rich Link.** The two Excel formula tools are optional.
No browser extension, Homebrew, Node.js, or Python is needed to run the downloaded workflows.

## Status

Version 0.1.0 is being prepared for its first release. See the [validation record](docs/VALIDATION.md) for what has actually been tested and the remaining installation checks. Compatibility is not assumed across apps or macOS versions.

## Install

1. On the repository’s **Releases** page, download `macos-hyperlink-toolkit-<version>.zip` from **Assets** when available. The GitHub **Source code** archives contain developer sources, not built workflows.
2. Extract it and open `workflows`.
3. Double-click **HLT - Copy Rich Link.workflow**, then choose **Install**.
4. Follow [Start here](docs/START-HERE.md) to authorize the browser, test the service, and assign **Option + Command + K (⌥⌘K)**.

If double-clicking opens an editor, [Start here](docs/START-HERE.md) includes a Finder-only manual installation method. Developers can [build the same package locally](#development).

## Three actions

| Action | Result | Shortcut example |
|---|---|---|
| **HLT - Copy Rich Link** | HTML hyperlink, with raw URL fallback in plain-text apps | **⌥⌘K** |
| HLT - Copy Excel Hyperlink | `=HYPERLINK("https://example.com/","Example Domain")` as clipboard text | ⌃⌥C |
| HLT - Paste Excel Formula | Writes clipboard formula into Excel’s active cell | ⌃⌥V |

Keep the browser in front until copying finishes, then switch apps. A success notification appears if notifications are enabled. The writer requires Microsoft Excel in front with a workbook and an active worksheet cell. It replaces that cell, even if nonempty, and does not save the workbook. Test in a blank workbook; do not rely on Undo for script writes.

The writer accepts other trusted Excel formulas starting with `=` too. It uses Excel’s scripting API instead of simulating Command + V. The formula producer uses English `HYPERLINK` and commas; locale-specific manual paste has not been validated. The writer does not support WPS.

## Compatibility and privacy

- Source browsers: Safari, Google Chrome, Microsoft Edge. Only the browser being used needs to be installed.
- Rich-link copying offers `public.html`, `public.utf8-plain-text`, `public.url`, and `public.url-name` in one clipboard item. The receiving app chooses a format; rich hyperlinks are not guaranteed in every app.
- Runtime scripts read the current tab’s title/URL, use the clipboard, and optionally write an Excel cell. They contain no network requests, analytics, or background service. macOS clipboard synchronization and third-party clipboard managers remain subject to your own settings.
- macOS Automation consent is required for the target browser or Excel. These scripts do not use System Events, simulated keys, browser page JavaScript, or Accessibility APIs.
- Notifications are optional. Copying remains successful when notifications cannot be displayed.

See [installation, permissions, troubleshooting, upgrades and uninstall](docs/START-HERE.md) and [tested combinations](docs/VALIDATION.md).

## Development

Requirements: **Python 3.9+** to build and test the package; **Node.js 18+** for isolated logic tests. Native checks additionally require macOS. These are developer requirements only.

```sh
python3 tools/build.py
node --test tests/core.test.cjs
python3 -m unittest discover -s tests -p 'test_*.py'
osascript -l JavaScript tests/native-clipboard.js "$PWD/src/common.js"
```

The build creates three standalone JXA scripts, three Automator Quick Actions, a bilingual guide, a license, a versioned ZIP, and a SHA-256 checksum under `dist/`. It does not install services or modify system settings. The native clipboard check uses a private pasteboard, leaving the general clipboard alone.

`src/common.js` holds shared behavior and `src/<action>.js` contains each entry point. The build embeds both into every workflow, so installed actions do not depend on the checkout. Generated files are not edited by hand. The original prototype included two AppleScripts; all three actions now use JXA to share browser handling and resolve applications only when needed.

For an opt-in check against an installed, running Microsoft Excel:

```sh
osascript -l JavaScript tests/excel-integration.js "$PWD/src/common.js"
```

This creates and closes one unsaved scratch workbook and temporarily replaces/restores clipboard representations (unless another app changes the clipboard). It verifies native formula write/readback and Unicode title calculation. It simulates the foreground condition to isolate Excel's scripting API; it does not replace Services/keyboard-shortcut acceptance. Office is not required by CI.

See [contributing](CONTRIBUTING.md) and the [release checklist](docs/RELEASING.md). CI verifies logic and packaging; it does not prove GUI installation or Office paste compatibility.

## Related projects

- [Copy Hyperlink as Edge Does](https://github.com/qxj/copy-hyperlink): an alternative for Chromium users who prefer a browser extension.
- [Raycast Script Commands](https://github.com/raycast/script-commands): a possible launcher for people who already use Raycast; no Raycast integration is shipped here yet.

## License

[MIT](LICENSE) © 2026 HAN Fang.
