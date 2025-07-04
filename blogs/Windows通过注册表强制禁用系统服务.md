---
date: 2024-01-12
tags:
  - Windows 10
categories:
  - 电脑系统
image: https://ghcdn.pages.dev/pic/202404131535964.webp
---

# Windows 通过注册表强制禁用系统服务

`win + R`打开“运行”对话框，在运行对话框中输入`regedit`命令，回车后弹出注册表编辑器，依次展开`HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\（服务名）`，找到`Start`键，双击打开，将其值修改为`4`，点击“确定”按钮后，重新启动系统。

**注册表 start 值：**

- 0：默认开机 bios 启动而启动
- 1：跟随操作系统启动
- 2：自动启动
- 3：手动启动
- 4：禁用
