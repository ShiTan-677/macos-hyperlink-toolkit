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
| Services invocation / 服务菜单 | User-reported success with the three locally installed workflows / 三个本地工作流的服务菜单流程收到成功反馈 |
| First-run Automation consent on a fresh account / 新账户首次授权 | Not tested / 未测试 |
| Keyboard shortcut settings / 快捷键设置位置 | User confirmed the installer opens shortcut settings and HLT services appear under General; keyboard invocation remains pending / 用户确认安装后打开快捷键设置，HLT 位于“通用”；按键触发仍待验证 |
| Safari → rich link → Excel / 富文本粘贴 | User-reported title paste and successful link navigation from the browser-downloaded package / 浏览器下载包的标题粘贴及链接跳转获用户确认 |
| Safari → rich link → TextEdit / 富文本粘贴 | Pending / 待验证 |
| Plain-text URL fallback / 纯文本 URL | Pending / 待验证 |
| Safari → formula → Excel writer / 公式写入 | Passed in the native API test and user-reported Services retest after the -1728 fix / 接口测试及修复后的服务菜单复测通过，后者依据用户反馈 |
| Native Excel formula write/readback / 真实 Excel 写入及读回 | Passed in a disposable workbook with simulated foreground condition / 空白临时工作簿通过，测试模拟前台条件 |
| Chrome / Edge / Word / Notes / WPS | Not tested / 未测试 |
| Browser-downloaded ZIP installation / 浏览器下载包安装 | User confirmed the rich-link workflow shows the native Install prompt / 用户确认富文本工作流显示系统安装提示 |
| Fresh account, Safari-only Mac / 首次安装环境 | Not tested / 未测试 |
| Removal and reinstall / 移除与重装 | User confirmed moving the rich-link workflow out removes its Services entry, then restoring it works / 用户确认富文本工作流移出后菜单消失，放回后恢复 |
| Upgrade across versions / 跨版本升级 | Not tested / 未测试 |
| Shortcuts conversion / 快捷指令转换 | Pending / 待验证；not a shipped format |

The original three prototypes were reported usable by the author; exact app versions and all combinations were not recorded. The rich-link shortcut was subsequently corrected to **⌥⌘K**. That report does not certify this new build.

The native clipboard test could not access pasteboard services inside the agent sandbox. It passed outside that sandbox using a private pasteboard; no general-clipboard contents were read or replaced by this test. Opening the generated rich-link workflow in Automator confirmed the embedded JavaScript and the “no input / any application” metadata. That API/editor check alone does not prove installation or Services behavior; subsequent user-reported acceptance is recorded separately below. GUI automation had input timeouts and long app-connection delays.

原生剪贴板检查在代理沙箱内不可用，在沙箱外使用私有剪贴板通过。Automator 已正确显示生成的代码和“没有输入／任何应用程序”配置；这项检查本身不能证明安装、服务执行或实际粘贴通过。后续用户反馈的交互验收另行记录。图形自动化曾存在输入超时和应用连接长时间等待。

### Excel -1728 regression

The first manual formula-write attempt failed with “The object you are trying to access does not exist”. Read-only native probes on Excel 16.112.4 reproduced -1728 for `excel.getAddress(excel.activeCell())`, while `excel.getAddress(excel.activeCell)` and AppleScript's `get address of active cell` succeeded. Resolving `activeCell()` produces a reference Excel cannot subsequently resolve in this operation. The implementation now retains the property specifier for both address validation and formula writing.

The regression model now distinguishes callable property specifiers from their returned values. An opt-in native test creates an unsaved scratch workbook, runs the real formula-writing path, verifies the exact formula and a calculated Unicode title containing quotes and `&`, and closes without saving. This passed. Native foreground activation was unreliable from the test process, so this test simulates only the foreground condition and leaves Services acceptance separate. The production guard is unchanged. This fixes a regression introduced while converting the original AppleScript writer to shared JXA; no reverse engineering or security-setting changes were needed.

### Service retest / 服务菜单复测

On 2026-09-19, the formula service retest initially reported that clipboard text did not start with `=`. The tester then confirmed the flow worked and attributed that attempt to switching away before copying had finished. The guide now asks readers to keep the browser in front until copying completes. The service result is user-reported; the native Excel integration test separately verifies formula and calculated title readback.

2026-09-19 的公式服务复测中，曾提示剪贴板不是以 `=` 开头的公式。随后测试者确认已正常使用，并说明此前在复制完成前切走了应用。指南已补充等待复制完成的步骤。服务菜单结果依据用户反馈；公式及计算后标题的读回另有原生 Excel 测试验证。

### Downloaded-package acceptance / 下载包验收

On 2026-09-19, the tester confirmed the requested browser-download flow: double-clicking the rich-link workflow showed the native Install prompt; the pasted Example Domain link opened its target; moving the installed rich-link workflow out of Services removed its menu entry, and restoring it worked. The installer also opened shortcut settings, where the service was under General. This result covers the rich-link workflow on the existing account, not a fresh account or all three workflows' separate install/remove cycles. The package contains no preset shortcut or code to open System Settings. The onboarding guide now highlights the Services → General group and includes a browser-readable HTML page.

2026-09-19 的下载包验收中，测试者确认：双击富文本工作流出现系统安装提示，粘贴后的 Example Domain 链接可打开目标网页，移出 Services 后菜单项消失，放回后恢复。安装器还打开了快捷键设置，服务位于“通用”分组。此结果覆盖现有账户下的富文本工作流，不代表新账户或其余工作流各自的安装移除验收。包内没有预设快捷键，也没有打开系统设置的代码。安装指南现已突出“服务 → 通用”的位置，并附有可在浏览器阅读的 HTML 页面。

## First manual acceptance / 首次手动验收

Use [Start here](START-HERE.md), the built ZIP, `https://example.com`, and a **new empty** Excel workbook.

1. Extract the ZIP and install **HLT - Copy Rich Link**. If an older action already uses ⌥⌘K, use Services for this test; do not bind two actions to the same shortcut.
2. Put Safari in front and use **Safari → Services → HLT - Copy Rich Link**. Accept the expected browser Automation prompt if needed; retry after authorization.
3. Paste into TextEdit in rich-text mode, an empty Excel cell, and a plain-text editor. Record the displayed title, whether a link exists, and its actual URL. Plain text should be the URL.
4. Install the two Excel services. Prepare an empty cell in the test workbook and leave edit mode. Copy a formula from Safari and keep Safari in front until copying finishes; return to the cell and run **HLT - Paste Excel Formula**. Check the formula bar, visible title and link target. Other cells should remain unchanged.
5. Run the writer from another app. It should refuse without switching to Excel or writing anything. Try Excel with no workbook and clipboard text that is not a formula.
6. Assign shortcuts and repeat the successful menu flow. Record shortcut behavior separately.
7. Move the installed HLT workflows to Trash and confirm they disappear from Services (reopen the target app if needed), then reinstall.

Record: toolkit version / macOS / browser / destination app / menu or shortcut / result / exact error. Avoid private URLs or workbook data.

中文反馈格式：`版本；浏览器 → 接收软件；运行的操作；菜单或快捷键；显示结果；报错原文`。
