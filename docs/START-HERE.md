# macOS Hyperlink Toolkit — Start here / 从这里开始

## 中文

把 Safari、Google Chrome 或 Microsoft Edge 的当前网页复制成带标题的链接。
只需要富文本链接时，安装 **HLT - Copy Rich Link** 即可。

安装包内的 **START-HERE.html** 可以双击，用浏览器阅读简明安装指南。

> **安装后打开了系统设置？下一步展开“服务”列表里的【通用】。**
> 在其中找到 **HLT - Copy Rich Link**，勾选它，双击右侧的“无”或已有快捷键，再按 **Option + Command + K（⌥⌘K）**。
> 安装包不预设快捷键；暂不设置也能从应用的“服务”菜单使用。

### 安装

1. 解压下载的 ZIP，打开 `workflows` 文件夹。
2. 双击 `HLT - Copy Rich Link.workflow`，在系统提示中选择“安装”。
3. 安装后如果打开了系统设置，可按上方提示设置快捷键，也可以先关闭设置，用下方的服务菜单测试。这个设置入口由 macOS 的工作流安装流程提供；不同系统版本的表现可能不同。若双击工作流直接打开 Automator 编辑器，关闭编辑器，使用下方“手动安装”；若打开“快捷指令”，先取消导入，使用“手动安装”。
4. 打开 Safari，访问 `https://example.com`。在屏幕顶部菜单栏选择 **Safari → 服务 → HLT - Copy Rich Link**。
5. 保持浏览器在前台，等复制完成后再切换应用。启用了通知时，会显示“链接已复制”。首次出现自动化权限提示时，核对它请求控制的是当前浏览器，然后允许；授权后如果没有复制成功，再从服务菜单运行一次。
6. 到 Excel 的空白单元格或 TextEdit 富文本新文稿中按 **Command + V**。预期显示可点击的 **Example Domain**。纯文本编辑器应显示 `https://example.com/`。
7. 确认菜单运行正常后，再设置快捷键。

**手动安装（无需终端）：**Finder → 前往 → 前往文件夹，输入 `~/Library/Services`。
若 `Services` 不存在，先前往 `~/Library`，新建名为 `Services` 的文件夹。
将需要的 `.workflow` 文件复制进去，然后重新打开目标应用的“服务”菜单。

### 快捷键

完整路径：**系统设置 → 键盘 → 键盘快捷键 → 服务 → 通用**。

1. 在“键盘快捷键”窗口左侧选择 **服务**。
2. 在右侧列表找到 **通用**，点击左边的小三角展开。这里的“通用”是服务列表内的分组。
3. 找到以 **HLT -** 开头的操作，确保它已勾选。
4. 双击该行右侧的“无”或已有快捷键，同时按下想使用的组合键。看到对应符号后，点击“完成”。
5. 回到浏览器测试复制快捷键；Excel 写入快捷键要在 Excel 中测试。

当前已验证的 macOS 将这些操作归到“通用”；其他版本的分组名称或布局可能不同。

| 操作 | 示例快捷键 |
|---|---|
| HLT - Copy Rich Link | **Option + Command + K（⌥⌘K）** |
| HLT - Copy Excel Hyperlink | Control + Option + C（⌃⌥C） |
| HLT - Paste Excel Formula | Control + Option + V（⌃⌥V） |

这些是示例，不会自动修改系统快捷键。已有同样快捷键时，先清除旧操作的快捷键，或为新操作选其他组合。
如果输入含 Control + C 的组合导致设置窗口关闭，请换一个可用组合；仍可从“服务”菜单运行。

### Excel 公式（可选）

1. 按同样方法安装其余两个工作流。
2. 先在 Microsoft Excel 打开测试工作簿，单击一个空白单元格；如果正在编辑单元格，先退出编辑状态。
3. 切到浏览器，运行 **HLT - Copy Excel Hyperlink**。保持浏览器在前台，等复制完成后再切换；启用了通知时，会显示“公式已复制”。剪贴板得到 `=HYPERLINK("URL","Title")` 文本。
4. 切回 Microsoft Excel，确认目标单元格，运行 **HLT - Paste Excel Formula**。它将公式直接写入当前活动单元格，无需再用 Command + V。

此操作支持以 `=` 开头的公式，会覆盖活动单元格原内容，不会自动保存工作簿。请只写入自己信任的公式，先在空白测试工作簿中试用；不要依赖撤销恢复脚本写入。
普通粘贴有时会得到公式文本，第三个操作用于显式写入公式。它仅支持 Microsoft Excel，不支持 WPS。

### 权限与排错

- 脚本读取当前标签页的标题和 URL。Excel 写入动作还会读取剪贴板并修改活动单元格。
- 不发送网络请求，不读取网页正文，不需要开启浏览器的“允许来自 Apple Events 的 JavaScript”。
- 自动化提示的应用名取决于实际运行宿主，以系统提示为准。拒绝后可前往 **系统设置 → 隐私与安全性 → 自动化** 检查。
- 新版代码使用原生接口识别前台应用，没有模拟按键，也没有请求辅助功能权限。
- 从 Automator 编辑器点击“运行”时，前台可能是 Automator。请从目标应用的“服务”菜单或快捷键运行。
- 提示“请先复制以 = 开头的 Excel 公式”时，剪贴板里没有可用的公式文本。回到浏览器重新运行 **HLT - Copy Excel Hyperlink**，等复制完成后再切回 Excel。通知是可选的；未看到通知时，可以先粘贴到空白纯文本文件，检查是否以 `=HYPERLINK(` 开头。复制报错文字或其他内容会替换剪贴板中的公式，之后需要重新复制公式。
- 粘贴结果由接收软件决定。请用普通粘贴，而不是“粘贴并匹配样式”；未知组合请先测试。

### 升级与卸载

升级前，备份自己改过的旧工作流。将新版本同名文件复制到 `~/Library/Services` 并确认替换，重新检查快捷键。
卸载时，将该文件夹中的三个 `HLT - … .workflow` 移到废纸篓；只安装了一个就只移除该文件。
旧版中文名称的操作是独立文件，可保留作备份，但不要给它和新版绑定同一个快捷键。

## English

Copy the current Safari, Google Chrome, or Microsoft Edge page as a titled hyperlink.
For everyday use, install **HLT - Copy Rich Link** only.

Double-click **START-HERE.html** in the download to read a short setup guide in your browser.

> **Did installation open System Settings? Expand General inside the Services list.**
> Find **HLT - Copy Rich Link**, enable its checkbox, double-click “none” or the existing shortcut on the right, then press **Option + Command + K (⌥⌘K)**.
> The package does not assign shortcuts. You can also use the app’s Services menu without setting one.

### Install and try

1. Extract the ZIP and open `workflows`.
2. Double-click `HLT - Copy Rich Link.workflow` and choose **Install**.
3. If installation opens System Settings, use the instructions above or close Settings and test from the Services menu first. This settings entry point belongs to macOS’s workflow installation flow; behavior may vary by version. If opening the workflow goes straight to the Automator editor or asks to import into Shortcuts, cancel and use the manual method below.
4. In Safari, visit `https://example.com`. Choose **Safari → Services → HLT - Copy Rich Link** from the menu bar.
5. Keep the browser in front until copying finishes, then switch apps. If notifications are enabled, a “Link copied” notification appears. Allow the expected Automation request to the current browser; run the service again if the first attempt only completed authorization.
6. Paste with **Command + V** into an empty Excel cell or a new rich-text TextEdit document. Expect a clickable **Example Domain**. A plain-text editor should receive `https://example.com/`.
7. After the menu action works, follow the shortcut setup below.

**Manual installation:** In Finder, use **Go → Go to Folder**, enter `~/Library/Services`, and copy the desired `.workflow` files there. If needed, create `Services` inside `~/Library` first. Reopen the target app’s Services menu.

### Keyboard shortcuts

Full path: **System Settings → Keyboard → Keyboard Shortcuts → Services → General**.

1. Select **Services** in the Keyboard Shortcuts sidebar.
2. In the list on the right, expand **General** using its disclosure triangle. General is a group within the Services list.
3. Find the actions starting with **HLT -** and enable their checkboxes.
4. Double-click “none” or the existing shortcut on the right, then press the desired key combination. Check that the shortcut appears and click **Done**.
5. Test copy shortcuts in the browser and the formula-writing shortcut in Excel.

General is the group observed on the tested macOS version; names or layout may differ elsewhere.

| Action | Suggested shortcut |
|---|---|
| HLT - Copy Rich Link | **Option + Command + K (⌥⌘K)** |
| HLT - Copy Excel Hyperlink | Control + Option + C (⌃⌥C) |
| HLT - Paste Excel Formula | Control + Option + V (⌃⌥V) |

Shortcuts are optional examples; nothing assigns them automatically. Resolve conflicts with existing services. If recording Control + C combinations closes Settings, choose another combination or use the Services menu.

### Optional Excel formula tools

1. Install the other two workflows in the same way.
2. In Microsoft Excel, select an empty cell in a test workbook and leave edit mode if needed.
3. Switch to the browser and run **HLT - Copy Excel Hyperlink**. Keep the browser in front until copying finishes. If notifications are enabled, a “Formula copied” notification appears.
4. Switch back to Microsoft Excel, confirm the target cell, and run **HLT - Paste Excel Formula**. No ordinary paste is needed.

The writer accepts formulas beginning with `=`, replaces the active cell’s contents, and does not save the workbook. Use trusted formulas and a blank test workbook; do not rely on Undo for script writes. Ordinary paste may insert formula text. The formula writer supports Microsoft Excel only, not WPS.

### Permissions and troubleshooting

Only tab title/URL are read; the formula writer also reads clipboard text and writes the active Excel cell. The scripts make no network requests and do not read page content. No browser “JavaScript from Apple Events” option is needed. Frontmost-app detection uses a native API without simulated keys or Accessibility access.

The Automation host name varies by launch method. If denied, check **System Settings → Privacy & Security → Automation**. Run from the target app’s Services menu or shortcut, since the Automator editor itself may be in front when its Run button is used. Use ordinary paste; “Paste and Match Style” removes rich formatting. Receiving-app compatibility must be tested.

If the writer reports “Copy an Excel formula starting with = first”, the clipboard does not contain usable formula text. Run **HLT - Copy Excel Hyperlink** again and wait for copying to finish before switching to Excel. Notifications are optional; if no notification appears, paste into an empty plain-text file to check for `=HYPERLINK(`. Copying an error message or other content replaces the formula, so copy the formula again afterwards.

### Update or remove

Back up customized workflows before replacing same-named files in `~/Library/Services` with a new release. Recheck shortcuts afterwards. To uninstall, move the installed `HLT - … .workflow` files from that folder to Trash. Older services with different names are separate; avoid assigning the same shortcut twice.
