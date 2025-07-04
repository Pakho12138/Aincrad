---
date: 2024-05-18
tags:
  - ffmpeg
categories:
  - 技术
image: https://ghcdn.pages.dev/pic/202405181531999.webp
---

# ffmpeg 教程：视频切片

## 1. ffmpeg 安装教程

### 1.1 下载地址

[Releases · BtbN/FFmpeg-Builds (github.com)](https://github.com/BtbN/FFmpeg-Builds/releases)

### 1.2 ffmpeg 环境配置

复制 ffmpeg 解压后的路径

![image-20240518143458890](https://ghcdn.pages.dev/other/202405181435295.png)

配置 ffmpeg 环境变量:高级系统设置>环境变量>双击系统变量 Path>新建>粘贴>确认

![微信截图_20240518142422](https://ghcdn.pages.dev/other/202405181435798.png)

## 2. 视频分割成 ts 文件

### 2.1 准备 mp4 文件

### 2.2 打开当前目录 cmd 命令窗口

![image-20240518144051565](https://ghcdn.pages.dev/other/202405181440981.png)

输入命令：

```bash
ffmpeg -i YOASOBI_BiriBiri.mp4 -c:v libx264 -c:a aac -strict -2 -f hls -hls_list_size 0 -hls_time 20 YOASOBI_BiriBiri.m3u8
```

```
默认的每片长度为 2 秒，m3u8 文件中默认只保存最新的 5 条片的信息，导致最后播放的时候只能播最后的一小部分（直播的时候特别注意）。
-hls_time n 设置每片的长度，默认值为 2，单位为秒。
-hls_list_size n 设置播放列表保存的最多条目，设置为 0 会保存有所片信息，默认值为5。
-hls_wrap n 设置多少片之后开始覆盖，如果设置为0则不会覆盖，默认值为0。这个选项能够避免在磁盘上存储过多的 片，而且能够限制写入磁盘的最多的片的数量。
-hls_start_number n 设置播放列表中 sequence number 的值为 number，默认值为 0。
注意：播放列表的 sequence number 对每个 segment 来说都必须是唯一的，而且它不能和片的文件名（当使用 wrap 选项时，文件名有可能会重复使用）混淆。
```

```
TS 文件是一种媒体的扩展名，它是日本高清摄像机拍摄下进行的封装格式。
MPEG2-TS（Transport Stream“传输流”；又称TS、TP、MPEG-TS 或 M2T）
是用于音效、图像与数据的通信协定，最早应用于DVD的实时传送节目。
MPEG2-TS格式的特点就是要求从视频流的任一片段开始都是可以独立解码的。
```

![img](https://ghcdn.pages.dev/other/202405181511544.image)

### 2.3 执行结果

![image-20240518151304679](https://ghcdn.pages.dev/other/202405181513636.png)
