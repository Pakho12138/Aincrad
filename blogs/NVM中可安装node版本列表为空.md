---
date: 2024-08-08
tags:
  - NVM
categories:
  - 前端
image: https://ghcdn.pages.dev/pic/202408081432073.webp
---

# NVM中可安装node版本列表为空

![image-20240801110105313](https://ghcdn.pages.dev/other/202408011101058.png)

### 问题解决

经过查找`nvm`的文档，发现，对于中国用户而言，可以切换`nodejs`或`npm`的镜像地址来访问：

![image-20240619163901976](https://ghcdn.pages.dev/other/202408011103931.png)

所以，在命令行中执行如下2行命令：

```shell
nvm node_mirror https://npmmirror.com/mirrors/node/
nvm npm_mirror https://npmmirror.com/mirrors/npm/
```

![image-20240801110553535](https://ghcdn.pages.dev/other/202408011105163.png)