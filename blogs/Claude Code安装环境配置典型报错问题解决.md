---
date: 2026-03-12
tags:
  - Claude Code
categories:
  - AI
image: https://ghcdn.pages.dev/pic/20260403154941078.webp
---

# Claude Code安装环境配置典型报错问题解决
## 典型报错
```
Unable to connect to Anthropic services
Failed to connect to api.anthropic.com: ERR_BAD_REQUEST
```

### 解决方法

**方案1**：开启网络代理并打开`tun`模式（优先推荐）
**方案2**：手动替换Claude配置文件内容，分系统操作步骤如下：

#### Windows系统

1. 进入路径：`C盘\用户\你的用户名\.claude`
2. 找到目录下的`.json`配置文件，将原有内容**完整替换**为以下代码：
```json
{
"installMethod": "unknown",
"hasCompletedOnboarding": true
}
```

#### Mac/Linux系统

1. 打开系统终端，执行命令打开配置文件：
```bash
nano ~/.claude.json
```
2. 删除文件原有所有内容，粘贴上述JSON配置代码
3. 按`ctrl+o`保存修改，按`ctrl+x`退出编辑界面



## 报错1：claude命令未被识别

#### 报错信息
```
claude : 无法将“claude”项识别为 cmdlet、函数、脚本文件或可运行程序的名称。请检查名称的拼写，如果包括路径，请确保路径正确，然后再试一次。
```
#### 解决方法
打开PowerShell，执行以下全局安装指令：
```powershell
npm install -g @anthropic-ai/claude-code
```



## 报错2：Git路径未找到/环境变量异常

#### 报错信息
```
Claude Code was unable to find CLAUDE_CODE_GIT_BASH_PATH path “C:\Program Files\Git\bin\bash.exe”
```
#### 解决方法
1. 未安装Git：直接下载并安装Git官方客户端，安装时勾选「添加到系统环境变量」；
2. 已安装Git：检查系统环境变量中是否配置了Git的路径，若配置错误/缺失，可卸载Git后重新安装（重新安装会自动配置基础环境变量）。



## 报错3：PowerShell脚本运行权限被禁止

#### 报错信息
```
claude : 无法加载文件 ~\AppData\Roamning\npm\claude.ps1,因为在此系统上禁止运行脚本。
```
#### 解决方法
1. 以**管理员身份**打开PowerShell；
2. 执行以下权限配置命令，弹出确认提示时输入`Y`并回车：
```powershell
Set-ExecutionPolicy RemoteSigned
```

