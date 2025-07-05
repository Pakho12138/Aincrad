---
date: 2023-12-10
tags:
  - Git
categories:
  - 前端
image: https://ghcdn.pages.dev/pic/20250705160421823.webp
---

# 自动打包并部署到 Github 脚本

```sh
#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build

# 进入生成的文件夹
cd public

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:Pakho12138/Aincrad.git master:gh-pages

cd -

```
