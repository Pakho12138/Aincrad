<template>
  <div class="home-blog">
    <div class="hero">
      <!-- 原背景 -->
      <!-- <div class="hero-bg" :class="{ show: bgLoaded && !(preClicked || nextClicked), 'back-in-right': nextClicked, 'back-in-left': preClicked }" :style="{ ...bgImageStyle }"></div> -->

      <!-- swiper背景 -->
      <Background ref="bgRef" :initialSlide="bgIndex"></Background>

      <span class="anchor-down" @click="scrollFn" @mouseenter="$kbnShowTip('点击这里，探索未知的世界~')"></span>

      <div class="video-wrapper">
        <VideoPlayer
          v-if="$frontmatter.bgVideo && showBgVideo"
          ref="videoRef"
          class="hero-video"
          :url="$frontmatter.bgVideo"
          :style="{ opacity: isVideoInit ? 1 : 0 }"
          @loadedmetadata="loadedMetaData"
          @canplay="videoCanPlay"
          @waiting="handleVideoWaiting"
          @playing="handleVideoPlay"
          @pause="handleVideoPause"
          @error="handleVideoError">
        </VideoPlayer>
        <div class="video-btn" :class="{ 'video-play': !isPlay, 'video-pause': isPlay }" @click="toggleVideoStatus" @mouseenter="$kbnShowTip('想看视频吗？可以先从左下角关闭音乐呢~')"></div>
        <div v-if="showBgVideo" class="video-btn video-close" @click="closeBgVideo"></div>
        <div class="video-stu" :class="{ show: showBgVideo && (!isVideoInit || !isCanPlay || !isPlay) }">
          <span v-if="!isVideoInit">{{ isError ? '视频加载出错' : '视频加载中...' }}</span>
          <span v-if="isVideoInit && isCanPlay && !isPlay">已暂停...</span>
          <span v-if="isVideoInit && !isCanPlay">缓冲中...</span>
        </div>
      </div>

      <ModuleTransition>
        <img class="hero-img" v-if="recoShowModule && $frontmatter.heroImage" :style="heroImageStyle || {}" :src="$withBase($frontmatter.heroImage)" alt="hero" />
      </ModuleTransition>

      <div class="focus-info" :class="{ hide: isPlay }">
        <ModuleTransition delay="0.04">
          <h1 class="hover" v-if="$frontmatter.heroText !== null" @mouseenter="$kbnShowTip($frontmatter.heroText || $title)">
            {{ $frontmatter.heroText || $title || 'vuePress-theme-reco' }}
          </h1>
        </ModuleTransition>

        <div class="header-info">
          <ModuleTransition delay="0.08">
            <div>
              <span id="description" v-if="$frontmatter.tagline !== null" class="description hover" @mouseenter="$kbnShowTip($frontmatter.heroText || $title)">
                <!-- {{ $frontmatter.tagline || $description || 'Welcome to your vuePress-theme-reco site' }} -->
              </span>
            </div>
          </ModuleTransition>
          <div class="link-btns">
            <img src="svg/next-b.svg" class="ic-arrow pre" @click="changeBg($event, true)" @mouseenter="$kbnShowTip('点击这里可以切换背景哟~')" />
            <PersonalInfo />
            <img src="svg/next-b.svg" class="ic-arrow" @click="changeBg" @mouseenter="$kbnShowTip('点击这里可以切换背景哟~')" />
          </div>
        </div>
      </div>

      <component v-if="bubbles && !isPlay" :is="bubbles" :options="options"></component>
    </div>

    <!-- 精灵球 -->
    <div class="pokeball" :class="{ shake: showShakeAnimate }" @mouseenter="$kbnShowTip('点下中间的按钮看看~')">
      <div class="ball-top"></div>
      <div class="ball-center">
        <div class="ball-line"></div>
        <div class="ball-btn">
          <div class="btn-inner select-cursor" @click="handleShowBanner"></div>
        </div>
      </div>
      <div class="ball-bottom"></div>
    </div>
    <!-- 精灵球的交互菜单 -->
    <div v-show="showBanner" class="animate-wrapper" :class="{ minisize: hideBannerAnimate, maxsize: showBannerAnimate }">
      <Banner v-show="recoShowModule" />
    </div>

    <ModuleTransition delay="0.16">
      <div v-show="recoShowModule" class="home-blog-wrapper">
        <div class="blog-list">
          <!-- 博客列表 -->
          <note-abstract :data="$recoPosts" @paginationChange="paginationChange" />
        </div>
        <!-- <div ref="infoRef" class="info-wrapper">
          <PersonalInfo />
          <h4><reco-icon icon="reco-category" /> {{ $recoLocales.category }}</h4>
          <ul class="category-wrapper">
            <li class="category-item" v-for="(item, index) in this.$categories.list" :key="index" @mouseenter="$kbnShowTip(`想看看分类<b>“${item.name}”</b>么？`)">
              <router-link :to="item.path">
                <span class="category-name">{{ item.name }}</span>
                <span class="post-num" :style="{ backgroundColor: getOneColor() }">{{ item.pages.length }}</span>
              </router-link>
            </li>
          </ul>
          <hr />
          <h4 v-if="$tags.list.length !== 0"><reco-icon icon="reco-tag" /> {{ $recoLocales.tag }}</h4>
          <TagList @getCurrentTag="getPagesByTags" />
          <h4 v-if="$themeConfig.friendLink && $themeConfig.friendLink.length !== 0"><reco-icon icon="reco-friend" /> {{ $recoLocales.friendLink }}</h4>
          <FriendLink />
        </div> -->
      </div>
    </ModuleTransition>

    <ModuleTransition delay="0.24">
      <Content v-show="recoShowModule" class="home-center" custom />
    </ModuleTransition>
  </div>
</template>

<script>
import { defineComponent, toRefs, ref, reactive, computed, onBeforeMount, onMounted, nextTick } from 'vue';
import TagList from '@theme/components/TagList';
import FriendLink from '@theme/components/FriendLink';
import NoteAbstract from '@theme/components/NoteAbstract';
import { ModuleTransition, RecoIcon } from '@vuepress-reco/core/lib/components';
import PersonalInfo from '@theme/components/PersonalInfo';
import { getOneColor } from '@theme/helpers/other';
import { useInstance, useShowModule } from '@theme/helpers/composable';
import Typed from '@theme/lib/typed.js';
import VideoPlayer from '@theme/components/VideoPlayer';
import Banner from '@theme/components/Banner.vue';
import Background from '../Background.vue';

export default defineComponent({
  components: { NoteAbstract, TagList, FriendLink, ModuleTransition, PersonalInfo, RecoIcon, VideoPlayer, Banner, Background },
  data() {
    return {
      recoShow: false,
      currentPage: 1,
      tags: [],
      bubbles: null,
      options: null,
      showBgVideo: false,
      isVideoInit: false,
      isCanPlay: false,
      isPlay: false,
      isError: false,
      observer: null,
      options: {
        root: null,
        rootMargin: '0px',
        threshold: 0,
      },
      showBanner: true,
      showBannerAnimate: false,
      hideBannerAnimate: false,
      showShakeAnimate: false,
      timer: null,
    };
  },
  setup(props, ctx) {
    const instance = useInstance();

    const state = reactive({
      recoShow: false,
      heroHeight: 0,
    });

    const recoShowModule = useShowModule();

    const heroImageStyle = computed(() => instance.$frontmatter.heroImageStyle || {});

    // 原先的背景封面图片
    // const bgImageStyle = computed(() => {
    //   const url = instance.$frontmatter.bgImage ? instance.$withBase(instance.$frontmatter.bgImage) : require('../../images/bg.svg');

    //   const initBgImageStyle = {
    //     textAlign: 'center',
    //     overflow: 'hidden',
    //     background: `url(${url}) center/cover no-repeat`,
    //   };

    //   const { bgImageStyle } = instance.$frontmatter;

    //   return bgImageStyle ? { ...initBgImageStyle, ...bgImageStyle } : initBgImageStyle;
    // });

    const bgRef = ref('');
    const bgImage = ref('');
    const bgIndex = ref(0);
    const bgLoaded = ref(false);
    // 自定义修改的背景图片设置, 随机产生一张图片
    const bgImageStyle = computed(() => {
      const initBgImageStyle = {
        background: `url(${bgImage.value}) center/cover no-repeat `,
      };
      // 获取用户自定义的样式，优先更高
      const { bgImageStyle } = instance.$frontmatter;

      return bgImageStyle ? { ...initBgImageStyle, ...bgImageStyle } : initBgImageStyle;
    });

    const preClicked = ref(false);
    const nextClicked = ref(false);
    const changeBg = (e, isPre = false) => {
      // preClicked.value = isPre;
      // nextClicked.value = !isPre;
      // setTimeout(() => {
      //   preClicked.value = false;
      //   nextClicked.value = false;
      // }, 1000);
      // bgLoaded.value = false;
      // isPre ? bgIndex.value-- : bgIndex.value++;
      // const url = instance.$themeConfig.heroImages[Math.abs(bgIndex.value) % instance.$themeConfig.heroImages.length];
      // bgImage.value = url ? instance.$withBase(url) : instance.$frontmatter.bgImage; //如果用户没有设置背景图，设置主题默认封面图
      // isBgLoaded();
      if (isPre) {
        bgIndex.value = --bgIndex.value % instance.$themeConfig.heroImages.length;
        instance.$refs.bgRef.swiper.slidePrev();
      } else {
        bgIndex.value = ++bgIndex.value % instance.$themeConfig.heroImages.length;
        instance.$refs.bgRef.swiper.slideNext();
      }
      localStorage.setItem('bgIndex', instance.$refs.bgRef.swiper.realIndex);
    };

    const isBgLoaded = () => {
      let img = new Image();
      img.src = bgImage.value;
      img.onload = () => {
        bgLoaded.value = true;
        img = null;
      };
      img.onerror = () => {
        img = null;
      };
    };

    // 根据当前时间弹出不同问候语
    const greetingByTime = () => {
      let tip = '';
      const curHour = new Date().getHours();
      if (curHour >= 0 && curHour < 7) {
        tip = '夜深了，好好做个美梦吧，晚安！';
      } else if (curHour >= 7 && curHour < 12) {
        tip = '一日之计在于晨，加油！';
      } else if (curHour >= 12 && curHour < 17) {
        tip = '午后很容易犯困呢，幸福地睡个午觉吧！';
      } else if (curHour >= 17 && curHour < 20) {
        tip = '傍晚了，和家人好好吃顿饭吧！';
      } else if (curHour >= 20 && curHour < 24) {
        tip = '晚上好，今天过得怎么样？';
      }
      instance.$kbnShowTip(tip);
    };

    onBeforeMount(() => {
      greetingByTime();

      // bgIndex.value = Math.floor(Math.random() * instance.$themeConfig.heroImages.length); // 现有列表条数内产生随机数
      bgIndex.value = +(localStorage.getItem('bgIndex') || 0);
      const randomBg = instance.$themeConfig.heroImages[bgIndex.value];
      bgImage.value = randomBg ? instance.$withBase(randomBg) : instance.$frontmatter.bgImage; //如果用户没有设置背景图，设置主题默认封面图
      isBgLoaded();
    });

    onMounted(() => {
      state.heroHeight = document.querySelector('.hero').clientHeight;
      state.recoShow = true;

      nextTick().then(() => {
        new Typed('#description', {
          strings: instance.$frontmatter.tagline || instance.$description,
          typeSpeed: 35,
          backDelay: 1500,
          backSpeed: 25,
          cursorChar: ' __',
          loop: false,
        });
      });
    });

    return { recoShowModule, heroImageStyle, bgImageStyle, ...toRefs(state), getOneColor, changeBg, bgLoaded, preClicked, nextClicked, bgIndex };
  },
  mounted() {
    console.log(
      '\n%c欢迎来到我的博客🎮我是Pakho！🚀',
      'color:#6366f1; background:#0b1021; font-size:1.5rem; padding:0.15rem 0.25rem; margin: 1rem auto; font-family: Rockwell; border: 2px solid #6366f1; border-radius: 4px;font-weight: bold; text-shadow: 1px 1px 1px #00af87bf;'
    );

    import('vue-canvas-effect/src/components/bubbles').then(module => {
      this.bubbles = module.default;
    });
    this.recoShow = true;

    // 视口监听
    // this.observer = new IntersectionObserver(this.handleIntersection, this.options);
    // this.observer.observe(this.$refs.infoRef);

    const goTopEl = document.getElementById('goTop');
    goTopEl &&
      goTopEl.addEventListener('mouseenter', () => {
        this.$kbnShowTip('回到开始的地方~');
      });

    const musicEl = document.querySelector('.reco-bgm-panel');
    musicEl &&
      musicEl.addEventListener('mouseenter', () => {
        this.$kbnShowTip('畅游音乐海洋吧~');
      });

    const searchEl = document.querySelector('.search-box');
    searchEl &&
      searchEl.addEventListener('mouseenter', () => {
        this.$kbnShowTip('这世界总有人在忙忙碌碌寻宝藏~');
      });
  },

  methods: {
    paginationChange(page) {
      // setTimeout(() => {
      //   window.scrollTo(0, this.heroHeight);
      // }, 100);
    },
    getPagesByTags(tagInfo) {
      this.$router.push({ path: tagInfo.path });
    },
    scrollFn() {
      const windowH = document.getElementsByClassName('hero')[0].clientHeight - 58; // 获取窗口高度
      document.documentElement.scrollTop = windowH; // 滚动条滚动到指定位置
    },
    videoCanPlay() {
      this.isCanPlay = true;
    },
    toggleVideoStatus() {
      if (this.isPlay) {
        this.$refs.videoRef.player.pause();
      } else {
        if (!this.showBgVideo) {
          this.showBgVideo = true;
        }
        this.$nextTick(() => {
          this.$refs.videoRef.player.play();
        });
      }
    },
    loadedMetaData() {
      setTimeout(() => {
        this.isVideoInit = true;
      }, 400);
    },
    handleVideoPlay() {
      this.isPlay = true;
    },
    handleVideoPause() {
      this.isPlay = false;
    },
    handleVideoWaiting() {
      console.log('waiting');
      this.isCanPlay = false;
    },
    handleVideoError() {
      this.isError = true;
    },
    closeBgVideo() {
      this.showBgVideo = false;
      setTimeout(() => {
        // 等待动画结束
        this.isVideoInit = false;
        this.isPlay = false;
        this.isError = false;
      }, 400);
    },
    handleIntersection(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          if (this.observer) {
            this.observer.disconnect();
          }
        }
      });
    },
    handleShowBanner() {
      if (this.timer) {
        return;
      }
      if (this.showBanner) {
        // 收起菜单
        this.hideBannerAnimate = true;
        this.timer = setTimeout(() => {
          this.timer = null;
          this.hideBannerAnimate = false;
          this.showBanner = false;
          // 收起之后，精灵球摇晃的动画
          this.showShakeAnimate = true;
          setTimeout(() => {
            this.$kbnShowTip('我收服神奇宝贝了~');
            this.showShakeAnimate = false;
          }, 3000);
        }, 2000);
      } else {
        // 显示菜单
        this.$kbnShowTip('出来吧！皮卡丘~');
        this.showBannerAnimate = true;
        this.showBanner = true;
        this.timer = setTimeout(() => {
          this.timer = null;
          this.showBannerAnimate = false;
        }, 2000);
      }
    },
  },
});
</script>

<style lang="stylus">
.home-blog {
  padding: 0;
  margin: 0px auto;
  .hero {
    margin $navbarHeight auto 0
    position relative
    box-sizing border-box
    padding 0 20px
    height 100vh
    display flex
    align-items center
    justify-content center
    text-align center
    overflow hidden

    .hero-bg {
      position absolute
      width 100%
      height 100%
      &.show {
        animation zoom-in 10s linear both
      }
      &.back-in-right {
        animation backInRight 1s
      }
      &.back-in-left {
        animation backInLeft 1s
      }
    }

    .video-wrapper{
      position absolute
      top 0
      bottom 0
      left 0
      right 0

      .hero-video {
        width 100%
        height 100%
        object-fit cover
        object-position center
        pointer-events none
      }

      .video-btn {
        position: absolute;
        bottom: 3px;
        right: 5px;
        width: 32px;
        height: 32px;
        z-index: 7;
        background-position: center;
        background-size: cover;
        cursor: pointer;
        opacity: .8;
        animation: poi-face 10s linear infinite alternate;
        &:hover {
          opacity: 1;
        }
        &.video-play {
          background: url(https://ghcdn.pages.dev/other/202403221729599.png);
        }
        &.video-pause {
          background: url(https://ghcdn.pages.dev/other/202403221738731.png);
        }
        &.video-close {
          background: url(https://ghcdn.pages.dev/other/202404030926646.png);
          left: 5px;
        }
      }

      .video-stu{
        position: absolute;
        bottom: -100px;
        left: 0;
        right: 0;
        margin: auto;
        padding: 6px 15px;
        text-align: center;
        color: #666;
        width: 100%;
        min-height: 37px;
        box-sizing: border-box;
        background-color: rgba(255, 255, 255, .8);
        border-radius: 0;
        font-size: 18px;
        transition: .4s ease all;
        &.show{
          bottom: 0;
        }
      }
    }

    .hero-img {
      max-width: 300px;
      margin: 0 auto 1.5rem
    }

    .focus-info {
      z-index 1
      transition: .4s ease all;
      &.hide{
        transform: translateY(-999px);
      }
    }

    h1 {
      display: block;
      margin:0 auto 1.8rem;
      font-size: 3rem;
      font-family: cursive;
      font-weight: bold;
    }

    .header-info{
      min-width: 90%;
      display: inline-block;
      position: relative;
      margin: auto;
      color: #eaeadf;
      background: rgba(0, 0, 0, .5);
      padding: 15px;
      margin-top: 22px;
      letter-spacing: 0;
      line-height: 30px;
      border-radius: 10px;
      box-sizing: initial;
      white-space: nowrap;
      transform: translateZ(0);
      &:before {
        content: "";
        position: absolute;
        top: -16px;
        left: 30%;
        transform: translateY(-50%);
        margin-left: -16px;
        border-width: 16px;
        border-style: solid;
        border-color: transparent transparent rgba(0, 0, 0, .5) transparent;
      }
      .description {
        margin: 1.8rem auto;
        font-size: 1.2rem;
        line-height: 1.3;
      }
      .link-btns {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 10px;
        .personal-info-wrapper {
          .personal-img, .name, .num, hr {
            display: none;
          }
          .social-links {
            margin: 0;
            padding: 0;
            justify-content: center;
          }
        }
        .ic-arrow {
          width: 39px;
          height: 28px;
          &.pre {
            transform: rotate(180deg)
          }
        }
      }
    }
  }
  .home-blog-wrapper {
    display flex
    align-items: flex-start;
    margin 40px auto 0
    padding 0 20px
    max-width $homePageWidth
    .blog-list {
      max-width 800px
      margin 0 auto
      flex auto
      width 0
      .abstract-wrapper {
        .abstract-item:last-child {
          margin-bottom: 0px;
        }
      }
    }
    .info-wrapper {
      position -webkit-sticky;
      position sticky;
      top 70px
      overflow hidden
      transition all .3s
      margin-left 40px
      flex 0 0 300px
      height auto
      box-shadow var(--box-shadow)
      border-radius $borderRadius
      box-sizing border-box
      padding 0 15px
      background var(--background-color)
      &:hover {
        box-shadow var(--box-shadow-hover)
      }
      &.show{
        animation: fade-in-bt .5s;
      }
      h4 {
        color var(--text-color)
      }
      .category-wrapper {
        list-style none
        padding-left 0
        .category-item {
          margin-bottom .4rem
          padding: .4rem .8rem;
          transition: all .5s
          border-radius $borderRadius
          box-shadow var(--box-shadow)
          background-color var(--background-color)
          &:hover {
            transform scale(1.04)
            a {
              color $accentColor
            }
          }
          a {
            display flex
            justify-content: space-between
            align-items: center
            color var(--text-color)
            .post-num {
              width 1.6rem;
              height 1.6rem
              text-align center
              line-height 1.6rem
              border-radius $borderRadius
              background #eee
              font-size 13px
              color #fff
            }
          }
        }
      }
    }
  }
}

@media (max-width: $MQMobile) {
  .home-blog {
    .hero {
      height 450px
      img {
        max-height: 210px;
        margin: 2rem auto 1.2rem;
      }

      h1 {
        margin: 0 auto 1.8rem ;
        font-size: 2rem;
      }

      .description {
        font-size: 1.2rem;
      }

      .action-button {
        font-size: 1rem;
        padding: 0.6rem 1.2rem;
      }
    }
    .home-blog-wrapper {
      display block!important
      .blog-list {
        width auto
      }
      .info-wrapper {
        // display none!important
        margin-left 0
        .personal-info-wrapper {
          display none
        }
      }
    }
  }
}

@media (max-width: $MQMobileNarrow) {
  .home-blog {
    .hero {
      height 450px
      img {
        max-height: 210px;
        margin: 2rem auto 1.2rem;
      }

      h1 {
        margin: 0 auto 1.8rem ;
        font-size: 2rem;
      }

      h1, .description, .action {
        // margin: 1.2rem auto;
      }

      .description {
        font-size: 1.2rem;
      }

      .action-button {
        font-size: 1rem;
        padding: 0.6rem 1.2rem;
      }
    }

    .home-blog-wrapper {
      display block!important
      .blog-list {
        width auto
      }
      .info-wrapper {
        // display none!important
        margin-left 0
        .personal-info-wrapper {
          display none
        }
      }
    }
  }
}

/* -------------添加向下滚动箭头------------- */
.anchor-down {
  display: block;
  bottom: 45px;
  width: 30px;
  height: 30px;
  font-size: 34px;
  text-align: center;
  animation: bounce-in 3.5s infinite;
  position: absolute;
  left: 50%;
  bottom: 10%;
  margin-left: -15px;
  cursor: pointer;
  z-index 1
  &::before {
    content: "";
    width: 18px;
    height: 18px;
    display: block;
    border-right: 7px solid #fff;
    border-top: 7px solid #fff;
    transform: rotate(135deg) skew(10deg, 10deg);
    position: absolute;
    bottom: 10px;
  }
}
@-webkit-keyframes bounce-in{
  0%{transform:translateY(0); opacity: 1}
  50%{transform:translateY(-20px); opacity: 0.5}
  to{transform:translateY(0); opacity: 1}
}
@keyframes bounce-in{
  0%{transform:translateY(0); opacity: 1}
  50%{transform:translateY(-20px); opacity: 0.5}
  to{transform:translateY(0); opacity: 1}
}

@-webkit-keyframes zoom-in{
  to{transform:scale(1.1);}
}
@keyframes zoom-in{
  to{transform:scale(1.1);}
}

@keyframes backInRight {
  0% {
    transform: translateX(2000px) scale(0.8);
  }

  80% {
    transform: translateX(0px) scale(0.8);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes backInLeft {
  0% {
    transform: translateX(-2000px) scale(0.8);
  }

  80% {
    transform: translateX(0px) scale(0.8);
  }

  100% {
    transform: scale(1);
  }
}

@-webkit-keyframes poi-face {
    2%,24%,80% {
      transform: translate(0,1.5px) rotate(1.5deg)
    }

    4%,68%,98% {
      transform: translate(0,-1.5px) rotate(-.5deg)
    }

    38%,6% {
      transform: translate(0,1.5px) rotate(-1.5deg)
    }

    8%,86% {
      transform: translate(0,-1.5px) rotate(-1.5deg)
    }

    10%,72% {
      transform: translate(0,2.5px) rotate(1.5deg)
    }

    12%,64%,78%,96% {
      transform: translate(0,-.5px) rotate(1.5deg)
    }

    14%,54% {
      transform: translate(0,-1.5px) rotate(1.5deg)
    }

    16% {
      transform: translate(0,-.5px) rotate(-1.5deg)
    }

    18%,22% {
      transform: translate(0,.5px) rotate(-1.5deg)
    }

    20%,36%,46% {
      transform: translate(0,-1.5px) rotate(2.5deg)
    }

    26%,50% {
      transform: translate(0,.5px) rotate(.5deg)
    }

    28% {
      transform: translate(0,.5px) rotate(1.5deg)
    }

    30%,40%,62%,76%,88% {
      transform: translate(0,-.5px) rotate(2.5deg)
    }

    32%,34%,66% {
      transform: translate(0,1.5px) rotate(-.5deg)
    }

    42% {
      transform: translate(0,2.5px) rotate(-1.5deg)
    }

    44%,70% {
      transform: translate(0,1.5px) rotate(.5deg)
    }

    48%,74%,82% {
      transform: translate(0,-.5px) rotate(.5deg)
    }

    52%,56%,60% {
      transform: translate(0,2.5px) rotate(2.5deg)
    }

    58% {
      transform: translate(0,.5px) rotate(2.5deg)
    }

    84% {
      transform: translate(0,1.5px) rotate(2.5deg)
    }

    90% {
      transform: translate(0,2.5px) rotate(-.5deg)
    }

    92% {
      transform: translate(0,.5px) rotate(-.5deg)
    }

    94% {
      transform: translate(0,2.5px) rotate(.5deg)
    }

    0%,100% {
      transform: translate(0,0) rotate(0)
    }
}

@keyframes poi-face {
    2%,24%,80% {
      transform: translate(0,1.5px) rotate(1.5deg)
    }

    4%,68%,98% {
      transform: translate(0,-1.5px) rotate(-.5deg)
    }

    38%,6% {
      transform: translate(0,1.5px) rotate(-1.5deg)
    }

    8%,86% {
      transform: translate(0,-1.5px) rotate(-1.5deg)
    }

    10%,72% {
      transform: translate(0,2.5px) rotate(1.5deg)
    }

    12%,64%,78%,96% {
      transform: translate(0,-.5px) rotate(1.5deg)
    }

    14%,54% {
      transform: translate(0,-1.5px) rotate(1.5deg)
    }

    16% {
      transform: translate(0,-.5px) rotate(-1.5deg)
    }

    18%,22% {
      transform: translate(0,.5px) rotate(-1.5deg)
    }

    20%,36%,46% {
      transform: translate(0,-1.5px) rotate(2.5deg)
    }

    26%,50% {
      transform: translate(0,.5px) rotate(.5deg)
    }

    28% {
      transform: translate(0,.5px) rotate(1.5deg)
    }

    30%,40%,62%,76%,88% {
      transform: translate(0,-.5px) rotate(2.5deg)
    }

    32%,34%,66% {
      transform: translate(0,1.5px) rotate(-.5deg)
    }

    42% {
      transform: translate(0,2.5px) rotate(-1.5deg)
    }

    44%,70% {
      transform: translate(0,1.5px) rotate(.5deg)
    }

    48%,74%,82% {
      transform: translate(0,-.5px) rotate(.5deg)
    }

    52%,56%,60% {
      transform: translate(0,2.5px) rotate(2.5deg)
    }

    58% {
      transform: translate(0,.5px) rotate(2.5deg)
    }

    84% {
      transform: translate(0,1.5px) rotate(2.5deg)
    }

    90% {
      transform: translate(0,2.5px) rotate(-.5deg)
    }

    92% {
      transform: translate(0,.5px) rotate(-.5deg)
    }

    94% {
      transform: translate(0,2.5px) rotate(.5deg)
    }

    0%,100% {
      transform: translate(0,0) rotate(0)
    }
}

.pokeball {
  position: relative;
  border-radius: 50%;
  height: 100px;
  width: 100px;
  margin: 40px auto 20px;
  transform-origin: bottom;
  overflow: hidden;
  &.shake {
    animation: shake 3s ease both;
  }
  .ball-top {
    width: 100%;
    height: 50%;
    background: linear-gradient(45deg, rgb(191,30,46) ,rgb(205,56,75), #fff);
  }
  .ball-center {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    .ball-line {
      width: 100%;
      height: 10px;
      background: linear-gradient(45deg, #000 66%, #fff);
    }
    .ball-btn {
        width: 30px;
        height: 30px;
        position: absolute;
        background: rgb(230, 231, 233);
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        border: 6px solid;
        display: flex;
        align-items: center;
        justify-content: center;
        .btn-inner {
          width: 60%;
          height: 60%;
          border-radius: 50%;
          background: #e6e7e9;
          border: 2px solid #666;
          filter: brightness(1.05);
          &:active {
            filter: brightness(0.9);
          }
        }
    }
  }
  .ball-bottom {
    width: 100%;
    height: 50%;
    background: linear-gradient(45deg, #999, rgb(230,231,233), #fff);
  }
}

.animate-wrapper {
  animation: none;
  &.minisize {
    animation: minisize 1.5s ease both;
  }
  &.maxsize {
    animation: minisize 1s reverse both;
  }
}

@keyframes minisize {
  0% {
    transform: scale(1) matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }
  60% {
    transform: scale(0) matrix3d(0.01, 0, 0, 0, 0, 1, 0, -0.01, 0, 0, 1, 0, 0, 0, 0, 1);
  }
  100% {
    transform: scale(0);
    margin-top: -200px;
    opacity: 0;
  }
}

@keyframes shake {
  25% {
    transform: rotate(25deg);
  }
  50% {
    transform: rotate(0deg);
  }
  75% {
    transform: rotate(-25deg);
  }
}
</style>
