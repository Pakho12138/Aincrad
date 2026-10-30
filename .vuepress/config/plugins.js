const BASE_URL = 'https://ghcdn.pages.dev';
const MUSIC_LIST = [
    { artist: 'YOASOBI', name: '夜に駆ける' },
].map((music) => ({
    name: music.name,
    artist: music.artist,
    url: `${BASE_URL}/music/${music.name}.mp3`,
    cover: `${BASE_URL}/music_pic/${music.name}.webp`,
}))

module.exports = [
    // 公告
    // ['@vuepress-reco/vuepress-plugin-bulletin-popover', {
    //   title: '公告',
    //   body: [
    //     {
    //       type: 'title',
    //       content: '欢迎加我的QQ/vx 🎉🎉🎉',
    //       style: 'text-aligin: center;',
    //     },
    //     {
    //       type: 'text',
    //       content: 'QQ/VX：326061636',
    //       style: 'text-align: center;'
    //     },
    //     {
    //       type: 'text',
    //       content: '喜欢的主题特效可以去个人信息',
    //       style: 'text-align: center;'
    //     },
    //     {
    //       type: 'text',
    //       content: '友链或疑问均可在留言板给我留言',
    //       style: 'text-align: center;'
    //     }
    //   ],
    //   footer: [
    //     {
    //       type: 'button',
    //       text: '打赏',
    //       link: '/blog/donate'
    //     },
    //   ]
    // }],
    // 看板娘
    // [
    //     'plugins/vuepress-plugin-kan-ban-niang', {
    //         // theme: [
    //         //     'xiaomai', 'shield', 'wanko', 'miku', 'whiteCat', 'haru1', 'haru2', 'haruto', 'koharu', 'izumi', 'shizuku', 'blackCat', 'z16'
    //         // ],
    //         theme: [
    //             'wanko', 'shizuku', 'shield', 'xiaomai'
    //         ],
    //         clean: true,
    //         messages: {
    //             welcome: '欢迎来到我的博客',
    //             home: '心里的花，我想要带你回家。',
    //             theme: '好吧，希望你能喜欢我的其他小伙伴。',
    //             close: '你不喜欢我了吗？痴痴地望着你。',
    //             hoverTips: ['心里的花，我想要带你回家', '我的愿望是 ~ 世界和平！！！', '汪，汪汪~', ' (*･´ω`･)っ'],
    //             clickTips: ['嗷呜~', 'o(*￣▽￣*)o'],
    //         },
    //         modelStyle: { left: '20px', bottom: '-50px' },
    //         messageStyle: { left: '20px', bottom: '250px' },
    //         width: 250,
    //         height: 320
    //     }
    // ],
    // 音乐播放器
    // [
    //     "@vuepress-reco/vuepress-plugin-bgm-player", {
    //         audios: MUSIC_LIST,
    //         autoShrink: true,
    //         // autoplay: true,
    //     }
    // ],
    // 鼠标点击特效
    // [
    //     "vuepress-plugin-cursor-effects",
    //     {
    //         size: 2,                    // size of the particle, default: 2
    //         shape: 'circle',  // shape of the particle, default: 'star'
    //         zIndex: 999999999           // z-index property of the canvas, default: 999999999
    //     }
    // ],
    // 阅读进度条
    'reading-progress',
    // 小猫goTop
    'go-top',
    // 图片懒加载
    [
        'plugins/vuepress-plugin-img-lazy',
        {
            useNative: false, // 是否使用img原生懒加载
            // loadImage: 'images/img-loading.gif',
            errorImage: 'images/img-error.webp'
        }
    ],
    // 获取摘要和图片（自定义插件）
    'plugins/auto-summary',
    // 彩带背景
    // ["ribbon-animation", {
    //     size: 90,   // 默认数据
    //     opacity: 0.3,  //  透明度
    //     zIndex: -1,   //  层级
    //     opt: {
    //         // 色带HSL饱和度
    //         colorSaturation: "80%",
    //         // 色带HSL亮度量
    //         colorBrightness: "60%",
    //         // 带状颜色不透明度
    //         colorAlpha: 0.65,
    //         // 在HSL颜色空间中循环显示颜色的速度有多快
    //         colorCycleSpeed: 6,
    //         // 从哪一侧开始Y轴 (top|min, middle|center, bottom|max, random)
    //         verticalPosition: "center",
    //         // 到达屏幕另一侧的速度有多快
    //         horizontalSpeed: 200,
    //         // 在任何给定时间，屏幕上会保留多少条带
    //         ribbonCount: 2,
    //         // 添加笔划以及色带填充颜色
    //         strokeSize: 0,
    //         // 通过页面滚动上的因子垂直移动色带
    //         parallaxAmount: -0.5,
    //         // 随着时间的推移，为每个功能区添加动画效果
    //         animateSections: true
    //     },
    //     ribbonShow: false, //  点击彩带  true显示  false为不显示
    //     ribbonAnimationShow: true  // 滑动彩带
    // }],
    // 樱花特效（本地 fork：仅桌面 + 尊重 reduced-motion）
    'plugins/vuepress-plugin-sakura',
    // 代码复制
    [
        "vuepress-plugin-copy-copyright",
        {
            copyText: "复制代码",
            tip: { content: "复制成功" },
            copyright: false,
            authorName: 'Pakho',
        }
    ],
]