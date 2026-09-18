# Validation / 验证记录

Evidence levels are separate: isolated tests, native API tests, and interactive acceptance.
逻辑测试、原生接口测试、真实安装验收分别记录；不能相互替代。

## Current build

Environment inspected on 2026-09-19: macOS 26.6.2 (25G83), Safari 26.6.2, Microsoft Excel 16.112.4. Results below refer to the current JXA implementation, not the original prototypes.

| Check / 检查 | Status / 状态 |
|---|---|
| Isolated formatting and failure paths / 隔离逻辑测试 | Passed: 10 tests / 10 项通过 |
| Package consistency and reproducibility / 打包一致性 | Passed: identical embedded sources and reproducible ZIP / 通过 |
| Apple JXA compilation / 苹果原生编译 | Passed: all 3 standalone scripts / 三个脚本通过 |
| Native private-pasteboard round trip / 原生私有剪贴板 | Passed: 4 types, Unicode, decoded HTML title/URL, formula text / 通过 |
| Automator opens generated workflow / Automator 打开生成工作流 | Passed: rich-link workflow recognized as a no-input Quick Action in any app / 富文本工作流正确识别 |
| Local installation files / 本地安装文件 | Three HLT workflows copied to Services; original services preserved / 已安装三个 HLT 文件，保留旧操作 |
| Services invocation and first-run Automation consent / 服务菜单与首次授权 | Pending / 待验证 |
| Keyboard shortcuts / 快捷键 | Pending / 待验证 |
| Safari → rich link → Excel / 富文本粘贴 | User reported A1 pasted successfully; exact click-through still unconfirmed / 用户反馈 A1 粘贴顺利，点击跳转尚未明确确认 |
| Safari → rich link → TextEdit / 富文本粘贴 | Pending / 待验证 |
| Plain-text URL fallback / 纯文本 URL | Pending / 待验证 |
| Safari → formula → Excel writer / 公式写入 | Initial service failed with -1728; fixed API check passed, service retest pending / 首次报错已定位，接口修复通过，服务菜单待复测 |
| Native Excel formula write/readback / 真实 Excel 写入及读回 | Passed in a disposable workbook with simulated foreground condition / 空白临时工作簿通过，测试模拟前台条件 |
| Chrome / Edge / Word / Notes / WPS | Not tested / 未测试 |
| Fresh account, Safari-only Mac, browser-downloaded ZIP / 首次安装环境 | Not tested / 未测试 |
| Uninstall, reinstall, upgrade / 卸载、重装、升级 | Pending / 待验证 |
| Shortcuts conversion / 快捷指令转换 | Pending / 待验证；not a shipped format |

The original three prototypes were reported usable by the author; exact app versions and all combinations were not recorded. The rich-link shortcut was subsequently corrected to **⌥⌘K**. That report does not certify this new build.

The native clipboard test could not access pasteboard services inside the agent sandbox. It passed outside that sandbox using a private pasteboard; no general-clipboard contents were read or replaced by this test. Opening the generated rich-link workflow in Automator confirmed the embedded JavaScript and the “no input / any application” metadata. This is not yet a double-click installation or Services execution result. GUI automation had input timeouts and long app-connection delays, so interactive acceptance is recorded separately.

原生剪贴板检查在代理沙箱内不可用，在沙箱外使用私有剪贴板通过。Automator 已正确显示生成的代码和“没有输入／任何应用程序”配置；这还不等于双击安装、服务执行或实际粘贴验收。图形自动化存在输入超时和应用连接长时间等待，因此交互验收单独记录。

### Excel -1728 regression

The first manual formula-write attempt failed with “The object you are trying to access does not exist”. Read-only native probes on Excel 16.112.4 reproduced -1728 for `excel.getAddress(excel.activeCell())`, while `excel.getAddress(excel.activeCell)` and AppleScript's `get address of active cell` succeeded. Resolving `activeCell()` produces a reference Excel cannot subsequently resolve in this operation. The implementation now retains the property specifier for both address validation and formula writing.

The regression model now distinguishes callable property specifiers from their returned values. An opt-in native test creates an unsaved scratch workbook, runs the real formula-writing path, verifies the exact formula and a calculated Unicode title containing quotes and `&`, and closes without saving. This passed. Native foreground activation was unreliable from the test process, so this test simulates only the foreground condition and leaves Services acceptance separate. The production guard is unchanged. This fixes a regression introduced while converting the original AppleScript writer to shared JXA; no reverse engineering or security-setting changes were needed.

## First manual acceptance / 首次手动验收

Use [Start here](START-HERE.md), the built ZIP, `https://example.com`, and a **new empty** Excel workbook.

1. Extract the ZIP and install **HLT - Copy Rich Link**. If an older action already uses ⌥⌘K, use Services for this test; do not bind two actions to the same shortcut.
2. Put Safari in front and use **Safari → Services → HLT - Copy Rich Link**. Accept the expected browser Automation prompt if needed; retry after authorization.
3. Paste into TextEdit in rich-text mode, an empty Excel cell, and a plain-text editor. Record the displayed title, whether a link exists, and its actual URL. Plain text should be the URL.
4. Install the two Excel services. Copy a formula from Safari; select an empty cell in the test workbook and run **HLT - Paste Excel Formula**. Check the formula bar, visible title and link target. Other cells should remain unchanged.
5. Run the writer from another app. It should refuse without switching to Excel or writing anything. Try Excel with no workbook and clipboard text that is not a formula.
6. Assign shortcuts and repeat the successful menu flow. Record shortcut behavior separately.
7. Move the installed HLT workflows to Trash and confirm they disappear from Services (reopen the target app if needed), then reinstall.

Record: toolkit version / macOS / browser / destination app / menu or shortcut / result / exact error. Avoid private URLs or workbook data.

中文反馈格式：`版本；浏览器 → 接收软件；运行的操作；菜单或快捷键；显示结果；报错原文`。
