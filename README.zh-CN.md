# macOS Hyperlink Toolkit

[English](README.md)

通过 macOS 快速操作，将当前网页复制成**带标题的可点击链接**，或 Excel `HYPERLINK()` 公式。

```text
Safari / Chrome / Edge         Excel / 富文本编辑器          纯文本编辑器
     Copy Rich Link    →          Example Domain       或   https://example.com/
                                 （可点击标题）
```

**建议从 Copy Rich Link 开始。**另外两个是可选的 Excel 公式工具。
运行下载好的工作流不需要安装浏览器扩展、Homebrew、Node.js 或 Python。

**[下载 0.1.0 安装包](https://github.com/ShiTan-677/macos-hyperlink-toolkit/releases/download/v0.1.0/macos-hyperlink-toolkit-0.1.0.zip)** · [版本说明与校验文件](https://github.com/ShiTan-677/macos-hyperlink-toolkit/releases/tag/v0.1.0)

0.1.0 是**公开预览版**。Safari → Excel 已通过本机服务菜单验收；其他组合和 macOS 版本仍待实测，详见下方[兼容性说明](#兼容性与隐私)和[验证记录](docs/VALIDATION.md)。

## 安装

1. 点击上方的**下载安装包**。GitHub 自动提供的 **Source code** 是开发源码，不含生成的工作流。
2. 解压后可先双击 **START-HERE.html**，在浏览器里阅读安装指南，再打开 `workflows` 文件夹。
3. 双击 **HLT - Copy Rich Link.workflow**，选择“安装”。
4. 在 Safari 打开 `https://example.com`，从菜单栏选择 **Safari → 服务 → HLT - Copy Rich Link**，等复制完成。首次出现控制浏览器的自动化提示时允许，必要时重试；再到 Excel 的空白单元格按 **⌘V**，应显示可点击的 **Example Domain**。
5. 菜单运行成功后，可以按[首次使用指南](docs/START-HERE.md#快捷键)设置 **Option + Command + K（⌥⌘K）**。快捷键是可选的。

> **安装后打开了快捷键设置？可以先关闭，用“服务”菜单试一次。**
> 之后设置快捷键的完整路径是：**系统设置 → 键盘 → 键盘快捷键 → 服务 → 通用**。展开【通用】，勾选 **HLT - Copy Rich Link**，再双击右侧快捷键栏。安装包不会自动分配快捷键。

如果双击打开了编辑器，指南中还有完全通过 Finder 操作的手动安装方法。开发者也可以按下方命令构建相同安装包。

## 三个操作

**HLT** 是 **Hyperlink Toolkit（超链接工具箱）**的缩写，用来让这几个服务在菜单中排列在一起，不是需要额外安装的软件。

| 操作名称 | 功能 | 示例快捷键 |
|---|---|---|
| **HLT - Copy Rich Link** | **复制网页为标题链接**：富文本软件获得标题链接，纯文本软件获得 URL | **⌥⌘K** |
| HLT - Copy Excel Hyperlink | **复制网页为 Excel 公式**：将 `=HYPERLINK("URL","标题")` 文本放入剪贴板 | ⌃⌥C |
| HLT - Paste Excel Formula | **将公式写入 Excel**：将剪贴板公式写入活动单元格 | ⌃⌥V |

复制时请将浏览器切到前台，并等复制完成后再切换应用。启用了通知时，会显示复制成功提示。公式写入要求 Microsoft Excel 位于前台，并且存在工作簿和活动工作表单元格。它会覆盖该单元格的原内容，不会保存工作簿；请先在空白测试工作簿里使用，不要依赖撤销恢复脚本写入。

公式写入也接受以 `=` 开头的其他可信 Excel 公式，通过 Excel 脚本接口操作。公式复制使用英文 `HYPERLINK` 和逗号分隔符，其他地区设置下的手动粘贴效果尚待验证。写入动作仅支持 Microsoft Excel，不支持 WPS。

## 兼容性与隐私

| 使用组合 | 当前证据 |
|---|---|
| Safari → 标题链接 → Microsoft Excel | 服务菜单流程中的标题粘贴和链接跳转已获确认 |
| Safari → 超链接公式 → Excel 写入 | 服务菜单验收及原生 Excel 接口测试通过 |
| Chrome / Edge 作为来源浏览器 | 已实现，有隔离逻辑测试；尚未实测 |
| TextEdit / Word / 备忘录 / WPS 接收标题链接 | 尚未实测，采用何种剪贴板格式取决于接收软件 |
| 将公式直接写入 WPS | 不支持，写入操作要求 Microsoft Excel |

交互验收环境为 macOS **26.6.2**、Safari **26.6.2**、Excel **16.112.4**，这不代表最低版本要求。新账户首次授权、快捷键触发仍待验证。只需安装实际使用的来源浏览器。

- 富文本复制在同一个剪贴板项目中提供 HTML、纯文本 URL、URL 和标题四种表示。接收软件决定采用哪种，因此不是所有软件都会粘贴出富文本链接。
- 运行脚本只读取当前标签页的标题和 URL、操作剪贴板，以及按需写入 Excel 单元格。脚本不发送网络请求，没有统计或后台常驻服务。系统通用剪贴板、第三方剪贴板工具仍遵循各自设置。
- 首次使用需要 macOS 自动化授权。这些脚本不使用 System Events、模拟按键、网页 JavaScript 或辅助功能 API。
- 通知是可选的；通知无法显示不会导致复制失败。

详见[安装、权限、排错、升级与卸载](docs/START-HERE.md)和[验证记录](docs/VALIDATION.md)。

第一次使用时，可以照着[首次使用检查清单](docs/FIRST-USE-CHECK.md)完成下载、试用和卸载，并反馈卡住的步骤。

## 开发

构建和打包测试需要 **Python 3.9+**；隔离逻辑测试需要 **Node.js 18+**；原生检查还需要 macOS。这些只属于开发环境要求，普通用户无需安装。

```sh
python3 tools/build.py
node --test tests/core.test.cjs
python3 -m unittest discover -s tests -p 'test_*.py'
osascript -l JavaScript tests/native-clipboard.js "$PWD/src/common.js"
```

第一条命令从源码生成 `dist/` 下的三个独立 JXA 脚本、三个快速操作、中英指南、许可证、版本化 ZIP 和 SHA-256 校验文件，不会安装服务或修改系统设置。其余命令分别检查脚本逻辑、打包一致性和 macOS 原生剪贴板；原生检查使用私有剪贴板，不影响当前复制内容。

公共实现位于 `src/common.js`，三个入口位于 `src/<action>.js`。构建时将它们嵌入每个工作流，安装完成后不依赖源码所在路径。修改源码后重新构建即可，无需手工同步多个文件。

最初原型包含两个 AppleScript；当前三个功能统一使用 JXA，以共享浏览器处理，并只在实际调用时解析目标应用。

已安装并打开 Microsoft Excel 时，可以选择运行真实接口测试：

```sh
osascript -l JavaScript tests/excel-integration.js "$PWD/src/common.js"
```

该测试新建一个空白工作簿，验证公式写入、读回和中文标题计算，随后关闭而不保存；临时替换并恢复剪贴板各格式内容（若其他应用中途改变剪贴板则不覆盖）。为了单独验证 Excel 脚本接口，测试中模拟前台条件，不能替代服务菜单和快捷键验收。CI 不要求安装 Office。

详见[贡献说明](CONTRIBUTING.md)和[发布清单](docs/RELEASING.md)。CI 通过代表逻辑及打包检查通过，不能替代实际安装和 Office 粘贴测试。

## 相关项目

- [Copy Hyperlink as Edge Does](https://github.com/qxj/copy-hyperlink)：适合偏好浏览器扩展的 Chromium 用户。
- [Raycast Script Commands](https://github.com/raycast/script-commands)：已使用 Raycast 的用户可参考；本项目尚未提供 Raycast 集成。

## 许可证

[MIT](LICENSE) © 2026 HAN Fang。
