<template>
  <div class="banner">
    <div
      class="banner-item select-cursor"
      v-for="(item, index) in bannerList"
      :key="index"
      @click="jumpUrl(item.url)"
      @mouseenter="$kbnShowTip(item.tip)">
      <img-lazy class="thumbnail" :src="item.cover || defaultImg" />
      <div class="info">
        <h3>{{ item.name }}</h3>
        <p>{{ item.tip }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance, onMounted, reactive, ref } from 'vue';

const { proxy } = getCurrentInstance();

const bannerList = ref([
  {
    name: '音乐',
    tip: '来听歌吧。DJ, drop the beat！',
    url: 'https://cloudmusic.pages.dev/',
    cover: 'https://ghcdn.pages.dev/pic/202404132202688.webp',
  },
  {
    name: 'MMD',
    tip: '基于threeJS实现的MMD播放器',
    url: 'https://mmdviewer.pages.dev/',
    cover: 'https://ghcdn.pages.dev/pic/202406022348221.webp',
  },
  {
    name: '暂未开放',
    tip: '暂未开放呦~',
    // name: '图库',
    // tip: 'AIGC, yyds！！！',
    url: '',
    cover: 'https://ghcdn.pages.dev/pic/202404132207985.webp',
  },
]);
const defaultImg = 'images/img-error.webp'; // 默认图片

function jumpUrl(url) {
  // window.location.href = url;
  url && window.open(url, '_blank');
}

function showKbnTip(text) {
  // 看板娘提示
  this.$kbnShowTip(text);
}

onMounted(() => {});
</script>

<style lang="stylus" scoped>
.banner {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 20px;
  .banner-item {
    position: relative;
    height: 160px;
    width: 257px;
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
    overflow: hidden;
    border-radius: 10px;
    margin: 0 5px;
    &:hover {
      img {
        transform: scale(1.2);
      }
      .info {
        visibility: visible;
        opacity: 1;
        h3,
        p {
          transform: translateX(0);
        }
      }
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      transform: scale(1);
      transition: all 0.6s;
    }
    .info {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      text-align: center;
      backface-visibility: hidden;
      background: rgba(0, 0, 0, 0.6);
      visibility: hidden;
      opacity: 0;
      backdrop-filter: blur(5px);
      transition: all 0.35s ease-in-out;
      h3 {
        text-transform: uppercase;
        color: #fff;
        text-align: center;
        font-size: 17px;
        padding: 10px;
        background: #111;
        margin: 30px 0 0;
        transition: all 0.35s ease-in-out;
        transform: translateX(-100%);
      }
      p {
        font-style: italic;
        font-size: 12px;
        position: relative;
        color: #bbb;
        padding: 20px;
        text-align: center;
        transition: all 0.35s linear;
        transform: translateX(100%);
      }
    }
  }
}
</style>
