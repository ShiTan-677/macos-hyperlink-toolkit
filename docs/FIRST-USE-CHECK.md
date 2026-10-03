# First-use check / 首次使用检查

This checklist follows the main Safari → Excel flow. A report from someone who has not used the toolkit is especially useful. Record whether the Mac/account already had these services or Automation permissions; an existing installation does not test first-run consent.

## 中文

目标是确认第一次接触项目的人能否顺利完成“下载 → 安装 → 使用 → 移除”。不需要写代码。请使用 `https://example.com` 和一个新建的空白 Excel 工作簿。

1. 从 [0.1.0 发布页](https://github.com/ShiTan-677/macos-hyperlink-toolkit/releases/tag/v0.1.0)下载 `macos-hyperlink-toolkit-0.1.0.zip`，不要下载 Source code。解压后打开 `START-HERE.html`。
2. 双击 `workflows/HLT - Copy Rich Link.workflow`，记录系统显示的是安装提示、编辑器还是其他界面。按指南完成安装；暂不设置快捷键。
3. 在 Safari 打开 example.com，从 **Safari → 服务 → HLT - Copy Rich Link** 运行。记录是否出现授权提示；允许后若未复制成功，再运行一次。保持 Safari 在前台，等复制完成。
4. 回 Excel，选中空白 A1，按 **⌘V**。记录是否显示 **Example Domain**、能否打开链接，以及实际网址是否为 `https://example.com/`。
5. 可选：到 **系统设置 → 键盘 → 键盘快捷键 → 服务 → 通用** 设置 **⌥⌘K**。先检查是否有同名或同快捷键的旧服务，再重复复制流程。单独记录按键是否触发；菜单成功不代表快捷键成功。
6. 在 Finder 前往 `~/Library/Services`，将本次安装的 `HLT - Copy Rich Link.workflow` 移到废纸篓。重新打开 Safari 的“服务”菜单，确认该项消失；如未消失，重新打开 Safari 后复查。需要继续使用时，再从下载包安装。
7. 记录卡住的步骤和提示原文。遇到问题时可以停止，不必为了完成清单去修改陌生的系统设置。

如果已经装有同名服务，先备份，避免覆盖自己的修改。无需为了反馈新建系统账户；按实际环境填写即可。

```text
工具版本：0.1.0
macOS / Safari / Excel 版本：
此前是否安装过 HLT、是否已有自动化授权：
下载及安装界面：
服务菜单复制 → Excel 粘贴：
链接显示内容 / 实际打开的网址：
快捷键测试（未测试 / 成功 / 失败）：
移除后菜单项是否消失：
卡住的步骤 / 提示原文：
哪一句说明不容易理解：
```

通过仓库的 [Issues](https://github.com/ShiTan-677/macos-hyperlink-toolkit/issues)反馈即可。请使用测试网页和空白工作簿，不附带私人网址或文档内容。

## English

1. Download the versioned ZIP from the [0.1.0 release](https://github.com/ShiTan-677/macos-hyperlink-toolkit/releases/tag/v0.1.0), extract it, and open `START-HERE.html`.
2. Install **HLT - Copy Rich Link**. Note which installation screen appears; skip shortcut setup for now.
3. Open `https://example.com` in Safari and run **Safari → Services → HLT - Copy Rich Link**. Allow the expected Automation prompt and retry if needed. Wait for copying to finish before switching apps.
4. Paste into A1 of a new empty Excel workbook. Check for **Example Domain**, open the link, and verify the destination URL.
5. Optionally assign **⌥⌘K** under **Services → General** and repeat. Report keyboard invocation separately from menu use.
6. Move this workflow out of `~/Library/Services` and check that the Services entry disappears, reopening Safari if needed. Reinstall if desired. Back up any existing customized workflow before replacing it.
7. Report the toolkit/macOS/browser/Excel versions, previous installation and permission state, results, unclear instructions, and exact errors in an [issue](https://github.com/ShiTan-677/macos-hyperlink-toolkit/issues).

Do not count this checklist as passed until someone actually performs it. Optional formula tools and other apps have separate checks in [VALIDATION.md](VALIDATION.md).
