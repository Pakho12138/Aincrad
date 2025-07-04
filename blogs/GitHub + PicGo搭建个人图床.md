---
date: 2024-01-26
tags:
  - Github
  - PicGo
  - PicList
categories:
  - 技术
image: https://ghcdn.pages.dev/pic/202404132158489.webp
---

# GitHub + PicGo 搭建个人图床

### **配置 GitHub**

1. 访问 [GitHub 官网](https://link.zhihu.com/?target=https%3A//github.com/)，注册或登录账户。

2. 点击“New”按钮创建新仓库，用于存储图片。

   ![](https://ghcdn.pages.dev/other/202401251936226.png)

![image-20240125194857425](https://ghcdn.pages.dev/other/202401251949773.png)

### **配置 PicGo**

> 这里也可以使用[PicList](https://piclist.cn/)，功能基于 PicGo 二次开发，用法相同，功能更全。详见下文**优化**相关内容。

1. 下载并安装 [PicGo](https://molunerfinn.com/PicGo/)，一个图像上传工具。

2. 在**PicGo**中配置 GitHub 仓库。

   > Github 创建一个 token：进入 Github 主页，右上角点击头像选择 `Settings -> Developer settings -> Personal access tokens`，最后点击 `generate new token`；

   ![image-20240126102419277](https://ghcdn.pages.dev/other/202401261024786.png)

   > Github 填写基础信息，最后复制生成的 token 并保存。

   ![image-20240126102911230](https://ghcdn.pages.dev/other/202401261029609.png)

   > PicGo 配置：打开图床设置-勾选 Github,如图配置。自定义域名可以使用 [jsDelivr](https://www.jsdelivr.com/) 为图片访问进行免费加速：

   ```
   https://cdn.jsdelivr.net/gh/用户名/仓库名
   https://ghcdn.pages.dev
   ```

   ![image-20240126104136915](https://ghcdn.pages.dev/other/202401261142672.png)

### **使用 Typora 撰写文档时上传图片**

> 打开**Typora -> 偏好设置 -> 图像**，选择上传服务为**PicGo(app)**，然后选择**PicGo**的启动路径，最后点击**验证图片上传选项**按钮验证是否能正常上传图片。

![image-20240126105408963](https://ghcdn.pages.dev/other/202401261148666.png)

> 接着在编写 markdown 文档的时候就可以直接粘贴图片进来，点击**上传图片**就可以啦！

![image-20240126114139935](https://ghcdn.pages.dev/other/202401261141211.png)

> 上传完成之后地址就自动替换成云端的地址了。

![image-20240126114547146](https://ghcdn.pages.dev/other/202401261145196.png)

### **优化**

#### **使用 PicList 代替 PicGo**

> PicGo 目前只支持删除图库图片，但无法同时删除云端图片，在管理云端资源方面还不够完善。所以这里使用[PicList](https://piclist.cn/)，配置方式同 PicGo，支持同步删除云端图片和管理云端数据，并且也支持 Typora 撰写文档时上传图片，只需要将上文中 Typora**偏好设置**里面的 PicGo 路径设置为 PicList 的启动路径即可。
>
> 文档地址：[PicList: 基于 PicGo 的二次开发版本，增加了云端删除和图床管理功能 (gitee.com)](https://gitee.com/kuingsmile/PicList)
>
> 下载地址：[https://github.com/Kuingsmile/PicList/releases/latest](https://github.com/Kuingsmile/PicList/releases/latest)

![image-20240126110647312](https://ghcdn.pages.dev/other/202401261451177.png)
