<template>
  <div class="kanbanniang">
    <div class="banniang-container" v-show="isLoaded">
      <div
        class="messageBox"
        :style="messageStyle"
        :class="{ show: isShowMessageBox }"
      >
        <span v-html="messages.message || '欢迎来到 ' + $site.title"></span>
      </div>
      <div
        v-show="!isShowBtns"
        :style="btnStyle"
        class="operation"
        @mouseenter="isShowMessageBox = true"
        @mouseleave="isShowMessageBox = false"
      >
        <i
          class="kbnfont kbn-ban-home ban-home"
          @click="goHome"
          @mouseenter="hoverGoHome"
          @mouseleave="resetMessage"
        ></i>
        <i class="kbnfont kbn-ban-message message"></i>
        <i
          class="kbnfont kbn-ban-close close"
          @click="closeBanNiang"
          @mouseenter="hoverCloseBanNiang"
          @mouseleave="resetMessage"
        ></i>
        <a
          target="_blank"
          href="https://vuepress-theme-reco.recoluan.com/views/plugins/kanbanniang.html"
        >
          <i
            class="kbnfont kbn-ban-info info"
            @mouseenter="hoverMoreInfo"
            @mouseleave="resetMessage"
          ></i>
        </a>
        <i
          v-show="myTheme.length > 1"
          class="kbnfont kbn-ban-theme skin"
          @click="changeTheme"
          @mouseenter="hoverChangeTheme"
          @mouseleave="resetMessage"
        ></i>
      </div>
      <canvas
        id="banniang"
        :style="modelStyle"
        :width="style.width"
        :height="style.height"
        class="live2d"
        @mouseenter="showHoverTips"
        @mouseleave="handleMouseLeave"
        @click="handleMouseClick"
      ></canvas>
    </div>
    <div class="showBanNiang" v-show="displayBanNiang" @click="showBanNiang">
      看板娘
    </div>
  </div>
</template>

<script>
import live2dJSString from "./assets/js/live2d";

export default {
  name: "KanBanNiang",
  data() {
    return {
      isLoaded: true,
      displayBanNiang: false,
      isShowMessageBox: true,
      isShowBtns: false,
      messages: {
        message: "",
        welcome: "",
        home: "心里的花，我想要带你回家。",
        theme: "好吧，希望你能喜欢我的其他小伙伴。",
        close: "你知道我喜欢吃什么吗？痴痴地望着你。",
        hoverTips: ["心里的花，我想要带你回家。"],
        clickTips: ["嗷呜~"],
      },
      currentTheme: "",
      myTheme: [
        "blackCat",
        "whiteCat",
        "haru1",
        "haru2",
        "haruto",
        "koharu",
        "izumi",
        "shizuku",
        "wanko",
        "miku",
        "z16",
        "shield",
        "xiaomai",
      ],
      themeName: [
        "blackCat",
        "whiteCat",
        "haru1",
        "haru2",
        "haruto",
        "koharu",
        "izumi",
        "shizuku",
        "wanko",
        "miku",
        "z16",
        "shield",
        "xiaomai",
      ],
      // 模型地址
      model: {
        blackCat:
          "https://cdn.jsdelivr.net/gh/QiShaoXuan/live2DModel@1.0.0/live2d-widget-model-hijiki/assets/hijiki.model.json",
        whiteCat:
          "https://cdn.jsdelivr.net/gh/QiShaoXuan/live2DModel@1.0.0/live2d-widget-model-tororo/assets/tororo.model.json",
        haru1:
          "https://cdn.jsdelivr.net/gh/QiShaoXuan/live2DModel@1.0.0/live2d-widget-model-haru/01/assets/haru01.model.json",
        haru2:
          "https://cdn.jsdelivr.net/gh/QiShaoXuan/live2DModel@1.0.0/live2d-widget-model-haru/02/assets/haru02.model.json",
        haruto:
          "https://cdn.jsdelivr.net/gh/QiShaoXuan/live2DModel@1.0.0/live2d-widget-model-haruto/assets/haruto.model.json",
        koharu:
          "https://cdn.jsdelivr.net/gh/QiShaoXuan/live2DModel@1.0.0/live2d-widget-model-koharu/assets/koharu.model.json",
        izumi:
          "https://cdn.jsdelivr.net/gh/QiShaoXuan/live2DModel@1.0.0/live2d-widget-model-izumi/assets/izumi.model.json",
        shizuku:
          "https://ghcdn.pages.dev/live2d/shizuku/assets/shizuku.model.json",
        wanko: "https://ghcdn.pages.dev/live2d/wanko/assets/wanko.model.json",
        miku: "https://cdn.jsdelivr.net/gh/QiShaoXuan/live2DModel@1.0.0/live2d-widget-model-miku/assets/miku.model.json",
        z16: "https://cdn.jsdelivr.net/gh/QiShaoXuan/live2DModel@1.0.0/live2d-widget-model-z16/assets/z16.model.json",
        shield: "https://ghcdn.pages.dev/live2d/shield/model1.json",
        xiaomai: "https://ghcdn.pages.dev/live2d/xiaomai/xiaomai.model.json",
      },
      // model的高宽
      style: {
        width: 150,
        height: 220,
      },
      // model的样式
      modelStyle: {
        right: "90px",
        bottom: "-20px",
        opacity: "1",
      },
      // messageBox的样式
      messageStyle: {
        right: "68px",
        bottom: "190px",
      },
      // 按钮的样式
      btnStyle: {
        right: "90px",
        bottom: "40px",
      },
      timer: null,
    };
  },
  props: {
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  beforeMount() {
    const opts = this.$props.options;

    if (opts) {
      this.isShowBtns = opts.clean || false;
      this.messages = Object.assign(this.messages, opts.messages || {});
      if (opts.theme?.length) {
        this.myTheme = opts.theme;
        this.currentTheme = opts.theme[0];
      }
      opts.width && (this.style.width = opts.width);
      opts.height && (this.style.height = opts.height);
      // model的样式
      this.modelStyle = Object.assign(this.modelStyle, opts.modelStyle || {});
      // messageBox的样式
      this.messageStyle = Object.assign(this.messageStyle, opts.messageStyle || {});
      // 按钮的样式
      this.btnStyle = Object.assign(this.btnStyle, opts.btnStyle || {});
    } else {
      this.isShowBtns = CLEAN;
      this.messages = {
        message: MESSAGES.welcome,
        welcome: MESSAGES.welcome,
        home: MESSAGES.home,
        theme: MESSAGES.theme,
        close: MESSAGES.close,
        hoverTips: MESSAGES.hoverTips,
        clickTips: MESSAGES.clickTips,
      };
      this.myTheme = THEME;
      this.currentTheme = THEME[0];
      this.style = {
        width: WIDTH,
        height: HEIGHT,
      };
      // model的样式
      this.modelStyle = MODEL_STYLE;
      // messageBox的样式
      this.messageStyle = MESSAGE_STYLE;
      // 按钮的样式
      this.btnStyle = BTN_STYLE;
    }
  },
  mounted() {
    this.btnStyle = {
      ...this.btnStyle,
      height: this.myTheme.length > 1 ? "120px" : "100px",
    };
    // 初始化live2d模型
    this.initBanNiang();

    // 绑定$kbnShowTip方法到vue的Object原型上供外部调用
    this.__proto__.__proto__.$kbnShowTip = (text) => {
      this.showTip(text);
    };
  },
  methods: {
    hoverGoHome() {
      this.messages.message = this.messages.home;
    },
    hoverChangeTheme() {
      this.messages.message = this.messages.theme;
    },
    hoverMoreInfo() {
      this.messages.message = "想知道关于我的更多信息吗？";
    },
    hoverCloseBanNiang() {
      this.messages.message = this.messages.close;
    },
    resetMessage() {
      this.messages.message = this.messages.welocme;
    },
    goHome() {
      if (this.$route.path !== "/") {
        this.$router.push("/");
      }
    },
    changeTheme() {
      const themes = [];
      for (var i = 0; i < this.myTheme.length; i++) {
        if (this.myTheme[i] != this.currentTheme) {
          themes.push(this.myTheme[i]);
        }
      }
      const randomNum = Math.floor(Math.random() * (this.myTheme.length - 1));
      this.currentTheme = themes[randomNum];
      this.initBanNiang();
    },
    handleMouseClick() {
      this.messages.message =
        this.messages.clickTips[
          Math.floor(Math.random() * this.messages.clickTips.length)
        ];
      this.isShowMessageBox = true;
    },
    showHoverTips() {
      this.messages.message =
        this.messages.hoverTips[
          Math.floor(Math.random() * this.messages.hoverTips.length)
        ];
      this.isShowMessageBox = true;
    },
    handleMouseLeave() {
      this.startTimerClose();
    },
    startTimerClose() {
      this.timer && clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.isShowMessageBox = false;
      }, 3000);
    },
    showTip(text) {
      this.messages.message = text;
      this.isShowMessageBox = true;
      this.startTimerClose();
    },
    closeBanNiang() {
      this.isLoaded = false;
      this.displayBanNiang = true;
    },
    showBanNiang() {
      this.isLoaded = true;
      this.displayBanNiang = false;
      this.initBanNiang();
    },
    initBanNiang() {
      if (this.themeName.indexOf(this.currentTheme) === -1) {
        console.log(
          "@vuepress-reco/vuepress-plugin-kan-ban-niang不支持主题" +
            this.currentTheme +
            ", 请检查主题名, 或前往https://vuepress-theme-reco.recoluan.com/views/plugins/kanbanniang.html 查看支持的主题"
        );
        document.querySelector(".kanbanniang").style.display = "none";
        return;
      }
      // const isMobile = !!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      //   navigator.userAgent
      // )
      const isMobile =
        !!/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      if (isMobile) {
        this.isLoaded = false;
        return console.log("mobile do not load model");
      }
      if (!window.loadlive2d) {
        const script = document.createElement("script");
        script.innerHTML = live2dJSString;
        document.body.appendChild(script);
      }
      var ajax = new XMLHttpRequest();
      ajax.open("get", this.model[this.currentTheme]);
      ajax.send();
      ajax.onreadystatechange = function () {
        if (ajax.status !== 200) {
          console.log("看板娘的CDN资源加载失败了，请稍后刷新页面重试！");
          document.querySelector(".kanbanniang").style.display = "none";
        }
      };
      window.loadlive2d("banniang", this.model[this.currentTheme]);
    },
  },
};
</script>

<style lang="stylus" scoped>
@require './assets/iconfont/iconfont.css'
  .showBanNiang
    position fixed
    right 70px
    bottom 6rem
    color $accentColor
    width 48px
    height 20px
    padding 10px
    cursor pointer
    border-radius 4px
    // 其他主题识别不到变量时使用
    background-color rgba(231, 234, 241, 0.5)
    // reco主题
    box-shadow var(--box-shadow)
    background-color var(--background-color)
  .banniang-container
    position fixed
    right 50px
    bottom 100px
    color #00adb5
    z-index 9999
    .messageBox
      position: fixed;
      bottom: 290px;
      right: 68px;
      width: 250px;
      height: auto;
      min-height: 70px;
      margin: -20px 20px;
      padding: 6px 10px;
      border-radius: 12px;
      box-sizing: border-box;
      box-shadow: rgba(0, 0, 0, 0.12) 0px 0px 2px 0px, rgba(0, 0, 0, 0.24) 0px 2px 2px 0px;
      transition: all 0.2s ease 0s;
      background: rgb(255, 255, 255);
      color: rgb(33, 33, 33);
      font-size: 14px;
      text-overflow: ellipsis;
      overflow: hidden;
      animation-delay: 5s;
      animation-duration: 50s;
      animation-iteration-count: infinite;
      animation-name: shake;
      animation-timing-function: ease-in-out;
      word-break: break-all;
      opacity: 0;
      // position fixed
      // padding 10px
      // height 60px
      // width 160px
      // border-radius 8px
      // background-color lighten($accentColor, 50%)
      // color $textColor
      // opacity 0.8
      &.show{
        opacity: 1;
      }
      :deep b {
        color $accentColor
      }
    .operation
      width 20px
      position fixed
      display flex
      flex-direction column
      justify-content space-between
      i
        font-size 20px
        cursor pointer
        color lighten($textColor, 50%)
        &:hover
          color lighten($accentColor, 50%)
    #banniang
      z-index 99999
      pointer-events auto
      position fixed


@-webkit-keyframes shake {
  2% {
      transform: translate(.5px,-1.5px) rotate(-.5deg)
  }

  4% {
      transform: translate(.5px,1.5px) rotate(1.5deg)
  }

  6% {
      transform: translate(1.5px,1.5px) rotate(1.5deg)
  }

  8% {
      transform: translate(2.5px,1.5px) rotate(.5deg)
  }

  10% {
      transform: translate(.5px,2.5px) rotate(.5deg)
  }

  12% {
      transform: translate(1.5px,1.5px) rotate(.5deg)
  }

  14% {
      transform: translate(.5px,.5px) rotate(.5deg)
  }

  16% {
      transform: translate(-1.5px,-.5px) rotate(1.5deg)
  }

  18% {
      transform: translate(.5px,.5px) rotate(1.5deg)
  }

  20% {
      transform: translate(2.5px,2.5px) rotate(1.5deg)
  }

  22% {
      transform: translate(.5px,-1.5px) rotate(1.5deg)
  }

  24% {
      transform: translate(-1.5px,1.5px) rotate(-.5deg)
  }

  26% {
      transform: translate(1.5px,.5px) rotate(1.5deg)
  }

  28% {
      transform: translate(-.5px,-.5px) rotate(-.5deg)
  }

  30% {
      transform: translate(1.5px,-.5px) rotate(-.5deg)
  }

  32% {
      transform: translate(2.5px,-1.5px) rotate(1.5deg)
  }

  34% {
      transform: translate(2.5px,2.5px) rotate(-.5deg)
  }

  36% {
      transform: translate(.5px,-1.5px) rotate(.5deg)
  }

  38% {
      transform: translate(2.5px,-.5px) rotate(-.5deg)
  }

  40% {
      transform: translate(-.5px,2.5px) rotate(.5deg)
  }

  42% {
      transform: translate(-1.5px,2.5px) rotate(.5deg)
  }

  44% {
      transform: translate(-1.5px,1.5px) rotate(.5deg)
  }

  46% {
      transform: translate(1.5px,-.5px) rotate(-.5deg)
  }

  48% {
      transform: translate(2.5px,-.5px) rotate(.5deg)
  }

  50% {
      transform: translate(-1.5px,1.5px) rotate(.5deg)
  }

  52% {
      transform: translate(-.5px,1.5px) rotate(.5deg)
  }

  54% {
      transform: translate(-1.5px,1.5px) rotate(.5deg)
  }

  56% {
      transform: translate(.5px,2.5px) rotate(1.5deg)
  }

  58% {
      transform: translate(2.5px,2.5px) rotate(.5deg)
  }

  60% {
      transform: translate(2.5px,-1.5px) rotate(1.5deg)
  }

  62% {
      transform: translate(-1.5px,.5px) rotate(1.5deg)
  }

  64% {
      transform: translate(-1.5px,1.5px) rotate(1.5deg)
  }

  66% {
      transform: translate(.5px,2.5px) rotate(1.5deg)
  }

  68% {
      transform: translate(2.5px,-1.5px) rotate(1.5deg)
  }

  70% {
      transform: translate(2.5px,2.5px) rotate(.5deg)
  }

  72% {
      transform: translate(-.5px,-1.5px) rotate(1.5deg)
  }

  74% {
      transform: translate(-1.5px,2.5px) rotate(1.5deg)
  }

  76% {
      transform: translate(-1.5px,2.5px) rotate(1.5deg)
  }

  78% {
      transform: translate(-1.5px,2.5px) rotate(.5deg)
  }

  80% {
      transform: translate(-1.5px,.5px) rotate(-.5deg)
  }

  82% {
      transform: translate(-1.5px,.5px) rotate(-.5deg)
  }

  84% {
      transform: translate(-.5px,.5px) rotate(1.5deg)
  }

  86% {
      transform: translate(2.5px,1.5px) rotate(.5deg)
  }

  88% {
      transform: translate(-1.5px,.5px) rotate(1.5deg)
  }

  90% {
      transform: translate(-1.5px,-.5px) rotate(-.5deg)
  }

  92% {
      transform: translate(-1.5px,-1.5px) rotate(1.5deg)
  }

  94% {
      transform: translate(.5px,.5px) rotate(-.5deg)
  }

  96% {
      transform: translate(2.5px,-.5px) rotate(-.5deg)
  }

  98% {
      transform: translate(-1.5px,-1.5px) rotate(-.5deg)
  }

  0%,100% {
      transform: translate(0,0) rotate(0)
  }
}

@keyframes shake {
  2% {
      transform: translate(.5px,-1.5px) rotate(-.5deg)
  }

  4% {
      transform: translate(.5px,1.5px) rotate(1.5deg)
  }

  6% {
      transform: translate(1.5px,1.5px) rotate(1.5deg)
  }

  8% {
      transform: translate(2.5px,1.5px) rotate(.5deg)
  }

  10% {
      transform: translate(.5px,2.5px) rotate(.5deg)
  }

  12% {
      transform: translate(1.5px,1.5px) rotate(.5deg)
  }

  14% {
      transform: translate(.5px,.5px) rotate(.5deg)
  }

  16% {
      transform: translate(-1.5px,-.5px) rotate(1.5deg)
  }

  18% {
      transform: translate(.5px,.5px) rotate(1.5deg)
  }

  20% {
      transform: translate(2.5px,2.5px) rotate(1.5deg)
  }

  22% {
      transform: translate(.5px,-1.5px) rotate(1.5deg)
  }

  24% {
      transform: translate(-1.5px,1.5px) rotate(-.5deg)
  }

  26% {
      transform: translate(1.5px,.5px) rotate(1.5deg)
  }

  28% {
      transform: translate(-.5px,-.5px) rotate(-.5deg)
  }

  30% {
      transform: translate(1.5px,-.5px) rotate(-.5deg)
  }

  32% {
      transform: translate(2.5px,-1.5px) rotate(1.5deg)
  }

  34% {
      transform: translate(2.5px,2.5px) rotate(-.5deg)
  }

  36% {
      transform: translate(.5px,-1.5px) rotate(.5deg)
  }

  38% {
      transform: translate(2.5px,-.5px) rotate(-.5deg)
  }

  40% {
      transform: translate(-.5px,2.5px) rotate(.5deg)
  }

  42% {
      transform: translate(-1.5px,2.5px) rotate(.5deg)
  }

  44% {
      transform: translate(-1.5px,1.5px) rotate(.5deg)
  }

  46% {
      transform: translate(1.5px,-.5px) rotate(-.5deg)
  }

  48% {
      transform: translate(2.5px,-.5px) rotate(.5deg)
  }

  50% {
      transform: translate(-1.5px,1.5px) rotate(.5deg)
  }

  52% {
      transform: translate(-.5px,1.5px) rotate(.5deg)
  }

  54% {
      transform: translate(-1.5px,1.5px) rotate(.5deg)
  }

  56% {
      transform: translate(.5px,2.5px) rotate(1.5deg)
  }

  58% {
      transform: translate(2.5px,2.5px) rotate(.5deg)
  }

  60% {
      transform: translate(2.5px,-1.5px) rotate(1.5deg)
  }

  62% {
      transform: translate(-1.5px,.5px) rotate(1.5deg)
  }

  64% {
      transform: translate(-1.5px,1.5px) rotate(1.5deg)
  }

  66% {
      transform: translate(.5px,2.5px) rotate(1.5deg)
  }

  68% {
      transform: translate(2.5px,-1.5px) rotate(1.5deg)
  }

  70% {
      transform: translate(2.5px,2.5px) rotate(.5deg)
  }

  72% {
      transform: translate(-.5px,-1.5px) rotate(1.5deg)
  }

  74% {
      transform: translate(-1.5px,2.5px) rotate(1.5deg)
  }

  76% {
      transform: translate(-1.5px,2.5px) rotate(1.5deg)
  }

  78% {
      transform: translate(-1.5px,2.5px) rotate(.5deg)
  }

  80% {
      transform: translate(-1.5px,.5px) rotate(-.5deg)
  }

  82% {
      transform: translate(-1.5px,.5px) rotate(-.5deg)
  }

  84% {
      transform: translate(-.5px,.5px) rotate(1.5deg)
  }

  86% {
      transform: translate(2.5px,1.5px) rotate(.5deg)
  }

  88% {
      transform: translate(-1.5px,.5px) rotate(1.5deg)
  }

  90% {
      transform: translate(-1.5px,-.5px) rotate(-.5deg)
  }

  92% {
      transform: translate(-1.5px,-1.5px) rotate(1.5deg)
  }

  94% {
      transform: translate(.5px,.5px) rotate(-.5deg)
  }

  96% {
      transform: translate(2.5px,-.5px) rotate(-.5deg)
  }

  98% {
      transform: translate(-1.5px,-1.5px) rotate(-.5deg)
  }

  0%,100% {
      transform: translate(0,0) rotate(0)
  }
}
</style>
