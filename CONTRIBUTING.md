# Contributing

Small, reproducible improvements are welcome. For compatibility reports, include macOS, browser, receiving app and toolkit versions, plus the exact service used. Try `https://example.com` and a blank document first.

## Make a change

1. Edit `src/common.js` or an action entry point under `src/`.
2. Run the four build/test commands in the README.
3. Test the generated workflow through the target app’s Services menu. Testing only an `osascript` invocation does not cover the Automator host or its permissions.
4. Update both READMEs when behavior changes, and record real compatibility results in `docs/VALIDATION.md`.

Do not commit `dist/`, compiled scripts, personal workflows, real browsing history, or workbook contents. Generated packages are uploaded as release assets.

Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/), for example `fix: preserve quoted page titles` or `docs: explain Automation permissions`.

Runtime dependencies should remain limited to macOS and the user's target apps. New integrations should have a concrete user need and a tested installation path.

## 中文

反馈请附上系统、浏览器、接收软件和工具版本，说明运行了哪个操作。优先用 `https://example.com` 和空白文稿复现。

修改 `src/` 下的源码，运行 README 中的构建与测试命令，再从目标应用“服务”菜单验证生成的工作流。涉及用户操作的修改应同步中英文文档。仅命令行测试通过，不能代表 Automator 权限和实际粘贴已经通过。

提交遵循 Conventional Commits；不要提交生成目录、私人工作流、真实浏览记录或工作簿内容。
