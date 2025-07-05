---
date: 2023-12-13
tags:
  - npm
categories:
  - 脚本
image: https://ghcdn.pages.dev/pic/20250705160421826.webp
---

# npm install 报错 ERR code ETIMEDOUT 的解决办法

将 **npm** 改为 **淘宝镜像**即可

1. 查看 npm 镜像设置

   ```sh
   npm config get registry
   ```

2. 将 npm 设置为淘宝镜像

   ```sh
   npm config set registry https://registry.npm.taobao.org
   ```

3. 再次查看 npm 镜像设置

   ```sh
   npm config get registry
   ```

4. 重新 install

   ```sh
   npm install
   ```
