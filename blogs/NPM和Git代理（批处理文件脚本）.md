---
date: 2024-03-22
tags:
  - Git
  - npm
categories:
  - 脚本
image: https://ghcdn.pages.dev/pic/202404131533069.webp
---

# NPM 和 Git 代理（批处理文件脚本）

```sh
@echo off
for /f "usebackq delims=" %%a in (`npm config get proxy`) do ( set abc=%%a)

if "%abc%" == "null" (
	npm config set proxy http://127.0.0.1:10809
	npm config set https-proxy http://127.0.0.1:10809
	git config --global http.proxy http://127.0.0.1:10809
	git config --global https.proxy http://127.0.0.1:10809
	echo "已设置npm与git代理: http://127.0.0.1:10809"
	pause
) else (
	npm config delete proxy
	npm config delete https-proxy
	git config --global --unset http.proxy
	git config --global --unset https.proxy
	echo "已取消npm与git代理"
	pause
)
@echo on
```
