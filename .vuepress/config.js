const plugins = require('./config/plugins');
const nav = require('./config/nav');
const sidebar = require('./config/sidebar');
const friendLink = require('./config/friendLink');

module.exports = {
  base: '/',
  title: 'AINCRAD',
  description: '愿此行，终抵群星',
  dest: 'dist',
  permalink: '/:slug', // 开启永久路径
  head: [
    // 尽早标记 loading，并记录开始时间（供最小展示时长计算）
    [
      'script',
      {},
      "document.documentElement.classList.add('page-loading');window.__AINCRAD_LOADING_START__=Date.now();",
    ],
    [
      'style',
      {},
      'html.page-loading,html.page-loading body{background:#141b2d!important;overflow:hidden!important}html.page-loading .global-ui .Sakura{visibility:hidden!important;opacity:0!important;pointer-events:none!important}',
    ],
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    [
      'meta',
      {
        name: 'viewport',
        content: 'width=device-width,initial-scale=1,user-scalable=no',
      },
    ],
    // 解决防盗链导致403问题
    ['meta', { name: 'referrer', content: 'no-referrer' }],
    // 关键第三方源提前握手
    ['link', { rel: 'dns-prefetch', href: 'https://ghcdn.pages.dev' }],
    ['link', { rel: 'preconnect', href: 'https://ghcdn.pages.dev', crossorigin: '' }],
    // 首屏 hero 首图 preload（Swiper 首帧展示图）
    [
      'link',
      {
        rel: 'preload',
        as: 'image',
        href: '/images/bg1.webp',
        fetchpriority: 'high',
      },
    ],
    // 首屏字体 preload（放在字体 CDN 上，等 preconnect 完成即可发起）
    [
      'link',
      {
        rel: 'preload',
        as: 'font',
        href: 'https://ghcdn.pages.dev/fonts/PingFang SC Semibold.min.ttf',
        type: 'font/ttf',
        crossorigin: 'anonymous',
      },
    ],
    // Loading 页标题字体（GLOBAL_FONT1），避免 swap 时字形跳变
    [
      'link',
      {
        rel: 'preload',
        as: 'font',
        href: 'https://ghcdn.pages.dev/fonts/YunFengJingLongHangShu.min.ttf',
        type: 'font/ttf',
        crossorigin: 'anonymous',
      },
    ],
  ],
  locales: {
    '/': {
      lang: 'zh-CN',
    },
  },
  markdown: {
    lineNumbers: true,
  },
  theme: 'reco',
  themeConfig: {
    modePicker: true, // 模式切换开关 (改了组件，会自动使用用户上次主动设置的模式)
    mode: 'light', // 默认 auto，auto 跟随系统，dark 暗色模式，light 亮色模式
    subSidebar: 'auto',
    type: 'blog',
    blogConfig: {
      category: {
        location: 2,
        text: '分类',
      },
      tag: {
        location: 3,
        text: '标签',
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
    logo: '/logo.webp',
    search: true,
    searchMaxSuggestions: 10,
    lastUpdated: 'Last Updated',
    author: 'Pakho',
    authorAvatar: '/avatar.webp',
    noFoundPageByTencent: false, //关闭404
    record: 'v2.0.0',
    startYear: '2023',
    // 评论插件
    // valineConfig: {
    //   appId: 'vmCTZevnoxQKw5s8SY3zaWTW-gzGzoHsz', // your appId
    //   appKey: 'VZ4UKu0rBRhwqf1BaQqW6UXd', // your appKey
    //   placeholder: '在这片空白之境，让你的思绪如流星划过，留下绚烂的痕迹...',
    // },
    heroImages: [
      // 'https://ghcdn.pages.dev/image/20250704110330189.webp',
      // 'https://ghcdn.pages.dev/image/20250704110330193.webp',
      // 'https://ghcdn.pages.dev/image/20250704110330191.webp',
      // 'https://ghcdn.pages.dev/image/20250704110330192.webp',
      '/images/bg1.webp',
      '/images/bg2.webp',
      '/images/bg3.webp',
      '/images/bg4.webp',
    ],
    // config目录
    nav,
    sidebar,
    friendLink,
  },
  plugins,
};
