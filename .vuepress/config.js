const plugins = require('./config/plugins');
const nav = require("./config/nav");
const sidebar = require("./config/sidebar");
const friendLink = require("./config/friendLink");

module.exports = {
  base: '/',
  title: "AINCRAD",
  description: "愿此行，终抵群星",
  dest: "dist",
  permalink: "/:slug", // 开启永久路径
  head: [
    // [
    //   'script',
    //   {
    //     src: "/js/index.min.js" // 自动处理cdn路径
    //   }
    // ],
    [
      'link',
      {
        rel: "icon",
        href: "/favicon.ico"
      }
    ],
    // [
    //   'link',
    //   {
    //     rel: "stylesheet",
    //     href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css",
    //     integrity: "sha512-SfTiTlX6kk+qitfevl/7LibUOeJWlt9rbyDn92a1DqWOw9vWG2MFoays0sgObmWazO5BQPiFucnnEAjpAB+/Sw==",
    //     crossorigin: "anonymous",
    //     referrerpolicy: "no-referrer"
    //   }
    // ],
    [
      'meta',
      {
        name: "viewport",
        content: "width=device-width,initial-scale=1,user-scalable=no"
      }
    ],
    // 解决防盗链导致403问题
    [
      'meta',
      {
        name: "referrer",
        content: "no-referrer"
      }
    ],
  ],
  locales: {
    '/': {
      lang: 'zh-CN'
    }
  },
  markdown: {
    "lineNumbers": true,
  },
  theme: "reco",
  themeConfig: {
    modePicker: true, // 模式切换开关 (改了组件，会自动使用用户上次主动设置的模式)
    mode: 'light', // 默认 auto，auto 跟随系统，dark 暗色模式，light 亮色模式
    subSidebar: 'auto',
    type: "blog",
    blogConfig: {
      category: {
        location: 2,
        text: "分类"
      },
      tag: {
        location: 3,
        text: "标签"
      },
      socialLinks: [
        // 信息栏展示社交信息
        {
          icon: 'reco-github',
          link: 'https://github.com/Pakho12138',
        },
        {
          icon: 'reco-mayun',
          link: 'https://gitee.com/pakhoc',
        },
        {
          icon: 'reco-gitlab',
          link: 'https://gitlab.com',
        },
        {
          icon: 'reco-juejin',
          link: 'https://juejin.cn/user/2342416329748863',
        },
        {
          icon: 'reco-csdn',
          link: 'https://www.csdn.net',
        },
        {
          icon: 'reco-npm',
          link: 'https://www.npmjs.com',
        },
      ],
    },
    logo: "/logo.png",
    search: true,
    searchMaxSuggestions: 10,
    lastUpdated: "Last Updated",
    author: "Pakho",
    authorAvatar: "/avatar.webp",
    noFoundPageByTencent: false, //关闭404
    record: "v2.0.0",
    startYear: "2023",
    // 评论插件
    valineConfig: {
      appId: 'vmCTZevnoxQKw5s8SY3zaWTW-gzGzoHsz',// your appId
      appKey: 'VZ4UKu0rBRhwqf1BaQqW6UXd', // your appKey
      placeholder: '在这片空白之境，让你的思绪如流星划过，留下绚烂的痕迹...'
    },
    heroImages: [
      'https://ghcdn.pages.dev/image/20250704110330189.webp',
      'https://ghcdn.pages.dev/image/20250704110330193.webp',
      'https://ghcdn.pages.dev/image/20250704110330191.webp',
      'https://ghcdn.pages.dev/image/20250704110330192.webp',
    ],
    // config目录
    nav,
    sidebar,
    friendLink,
  },
  plugins,
}