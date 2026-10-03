# Pulse · 运动应用 UI 与 Lottie 交互概念

由赋界科技使用 Codex 独立新建，非客户案例、非客户交付。界面、插画与完成徽章矢量动画原创，MIT 许可。播放器为官方 lottie-web 5.13.0（MIT），许可见 vendor/Lottie-LICENSE.md。

在线入口：https://zhanghongqian2025.github.io/fujie-companion-ui-demo/pulse/

三个界面状态：今日、计时、完成动效。支持 30/45/60 秒选择，开始、暂停、恢复、重置，以及 5 秒完整流程演示。完成徽章为独立 `completion.json`，30 fps、3 秒、320×320、14 个矢量层，无图像资源。

无登录、模型、统计 SDK、个人数据存储或数据上传。计时仅保留于当前标签页内存；数字为演示数据。减少动态效果启用时显示静态完成反馈。此样例不是运动指导或健康建议。

运行：仓库根目录执行 `node serve.cjs`，打开 http://127.0.0.1:8742/pulse/ 。重建动画：`node pulse/generate-animation.cjs`。

交付边界：可检查 HTML/CSS/JS 与 Lottie JSON；尚未证明买方项目接入、Figma/AE 工程交付、PAG/Spine/Rive 技能、真实设备数据或原生 Android/iOS 播放兼容性。任何客户范围与价格需单独确认。
