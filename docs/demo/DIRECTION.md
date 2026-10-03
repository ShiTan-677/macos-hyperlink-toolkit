# Demo recording plan / 演示录制方案

Status: recording pending. This is a shooting guide, not evidence that a video or additional compatibility test has been completed.

## 目标与形式

优先制作 README 使用的 **20–30 秒静音实操演示**，展示 0.1.0 在 macOS 上的 **Safari → Copy Rich Link → Excel → 打开链接**。使用真实的 Safari、系统服务菜单和 Excel 画面。字幕提供中英文版本，同一份素材可以分别导出。

选择这个形式，是因为项目的价值体现在复制后得到的真实链接。服务菜单能说明动作从哪里启动，Excel 中的标题和链接跳转能展示结果。鼠标动作、复制等待和粘贴结果应保持连续；字幕只说明画面中已经发生的事。

录制者完成真实操作并保留原片；后期负责裁掉准备过程、放大关键区域、添加字幕和导出。录制时不需要说话、配乐或自行剪辑。静音版便于 README 直接观看。

这里参考了 [guizang-product-video-skill](https://github.com/op7418/guizang-product-video-skill) 先定镜头、使用真实功能、检查成片的工作方法。Safari 和 Excel 的界面不属于本仓库，不能作为业务组件挂进视频工程，因此采用真实录屏素材；不使用该技能的代码、默认主题或素材。

## 录制前准备

1. 确认 **HLT - Copy Rich Link** 已安装，并先完成一次菜单操作和浏览器授权。演示从已经安装的状态开始；安装方法在 README 中单独说明。
2. Safari 新开一个只有 `https://example.com` 的窗口；Excel 新建空白工作簿。将两者放在同一显示器上，便于看清切换过程。只让这两个测试窗口进入录制画面。
3. Excel 选 A1，适当加宽 A 列，将工作表缩放到约 150%–200%，让 **Example Domain** 在成片里清晰可读。录制开始时 A1 应为空。
4. 清理画面里的私人标签页和通知。录制前再检查 OBS 预览；避免把文件列表、个人消息或其他工作簿带进画面。
5. 主演示使用服务菜单。如果另拍快捷键片段，先实测 **⌥⌘K** 可用，再标注“已手动设置快捷键”。

## OBS 操作

1. 新建一个场景，例如 `HLT Demo`。
2. 在“来源”中点击 **＋ → macOS 屏幕捕获（macOS Screen Capture）**，选择显示器捕获，以便同时录下 Safari、菜单栏和 Excel。保留鼠标指针。若 OBS 请求录屏权限，按系统提示授权并重新打开 OBS。
3. 静音混音器中的麦克风、桌面和应用音频。30 fps 足够；保留清晰的原始画幅即可，不必为了 16:9 裁掉菜单或拉伸画面。
4. 先录 5 秒再回放，确认画面正常、菜单可见、Excel 文字清楚，然后清空测试单元格，准备正式录制。
5. 点击**开始录制**，切到 Safari，按下面的镜头顺序操作。结束后等两秒再停止。操作慢一点没有关系，优先保证连续、真实、清楚。
6. 保留原始 MKV 或 MP4，不必自行转换。录制路径可在 OBS 的**设置 → 输出 → 录制路径**中查看；若需要 MP4，也可使用 **文件 → 录像转封装（Remux Recordings）**。

参考：[OBS macOS 屏幕捕获](https://obsproject.com/kb/macos-screen-capture-source)、[OBS 录制设置](https://obsproject.com/kb/standard-recording-output-guide)。

## 主演示镜头表

时间是成片目标，不要求录制者掐秒操作。不要为了赶时长，在复制尚未完成时切走应用。

| 成片时间 | 真实操作与画面 | 中文字幕 | English caption |
|---|---|---|---|
| 0–4 秒 | Safari 显示 example.com，标题与网址可见 | 将网页复制为标题链接 | Copy a webpage as a titled link |
| 4–12 秒 | 展开 Safari → 服务，稍停让名称可读，再运行 HLT - Copy Rich Link；保持 Safari 在前台直到复制完成 | 服务 → HLT - Copy Rich Link | Services → HLT - Copy Rich Link |
| 12–19 秒 | 切到 Excel 空白 A1，按 ⌘V；让 Example Domain 保留在画面中 | 在 Excel 粘贴：⌘V | Paste in Excel: ⌘V |
| 19–27 秒 | 从 Example Domain 打开链接，浏览器显示目标网址；如单击仅选中单元格，使用该 Excel 版本提供的打开超链接操作 | 标题可点击，网址被保留 | Clickable title, original URL |
| 27–30 秒 | 结果短暂停留 | macOS Hyperlink Toolkit · 0.1.0 预览版 | macOS Hyperlink Toolkit · 0.1.0 preview |

如果权限提示、应用卡顿或误操作打断了流程，保留原片用于排查，再重新录一遍成功操作。不要通过替换单元格内容或拼接不同操作来制造成功效果。

## 可选的一分钟介绍版

沿用主片素材，再补下面两个片段即可，无需重录所有内容：

- **快捷键位置（8–12 秒）：**系统设置 → 键盘 → 键盘快捷键 → 服务，展开**通用**，让 HLT 服务行清晰可见。字幕说明“快捷键需要手动设置”。
- **公式工具（15–20 秒）：**Excel 先选空白 A2 并退出编辑状态；到 Safari 运行 **HLT - Copy Excel Hyperlink**，等复制完成；切回 Excel 运行 **HLT - Paste Excel Formula**，停留展示标题和公式栏中的 `=HYPERLINK(...)`。

一分钟版的顺序：0–5 秒介绍用途；5–32 秒主片实操；32–48 秒可选公式工具；48–56 秒快捷键位置；56–60 秒项目名称和 GitHub 地址。按素材实际长度调整，不用加快鼠标或隐藏等待来硬凑时长。

## 后期与验收

- 原片保存在仓库被忽略的 `artifacts/demo/raw/`，不提交到 Git。只在公开前审阅过的最终成片才进入发布资产。
- 去掉首尾准备过程，保留复制到粘贴的因果顺序；关键操作保持原速。必要的等待剪辑要明确，不宣称即时完成。
- 中文字幕和英文字幕分别导出，避免两行长字幕挡住服务菜单或单元格。1080p 成片中的主要文字以至少约 22 px 为目标，优先裁切放大而非缩小整个桌面。
- 主交付为静音 H.264 MP4，目标 20–30 秒、文字清晰、体积尽量控制在 10 MB 内。README 可用一张来自真实成片的静帧链接至视频；需要内联循环预览时另导出短 GIF。
- 发布前完整观看成片，并检查：服务名称、剪贴板等待、粘贴内容、链接目标、字幕时机、个人信息，以及首帧和末帧。额外检查每秒静帧和关键操作的原尺寸画面。
- 视频只展示实拍组合。不要在字幕里增加“所有浏览器”“任意软件”“自动配置快捷键”等未经验证的承诺。

## English summary

Record a continuous, silent Safari → Services → **HLT - Copy Rich Link** → paste into an empty Excel cell → open the resulting link sequence using `https://example.com`. Keep the browser in front until copying finishes. Capture the real application windows and menu bar, with readable text and no private content. Preserve the original recording for review.

The primary deliverable is a 20–30 second README demo. A longer version can reuse it with separate shortcut-settings and Excel-formula clips. Recording and final video review are still pending; this plan alone does not establish that they passed.
