---
date: 2023-12-12
tags:
  - Cordova
categories:
  - 前端
image: https://ghcdn.pages.dev/pic/20250705160421825.webp
---

# Cordova 插件开发

## 1. 安装 plugman

```sh
npm install plugman -g
```

## 2. 新建插件

```sh
plugman create --name TestPlugin --plugin_id cordova-plugin-testplugin --plugin_version 1.0.0
```

## 3. 添加平台

```sh
cd TestPlugin
plugman platform add --platform_name android
```

## 4. 初始化 package.json

```sh
npm init
```

## 5. 添加到 ionic 项目中

- 查看安装了哪些插件

  ```sh
  ionic cordova plugin ls
  ```

- 添加插件

  ```sh
  ionic cordova plugin add G:\app\test\TestPlugin
  ```

- 删除插件

  ```sh
  ionic cordova plugin remove cordova-plugin-testplugin
  ```

## 6. Android Studio 打开项目中 platform 下 android 工程，编辑 TestPlugin.java

## 7. 编辑 www 文件夹下 TestPlugin.js

## 8. 编辑 plugin.xml

## 9.js 调用插件

<br/>

**参考插件:**

[手机号码一键登录](https://github.com/lounai-chen/cordova-plugin-mobile-login)

[画中画](https://github.com/lounai-chen/cordova-plugin-floating-window)

[阿里云文件操作](https://github.com/lounai-chen/cordova-plugins-aliyunOSSupload)
