<template>
  <div class="swiper-container">
    <div class="swiper-wrapper">
      <div
        class="swiper-slide"
        v-for="(url, index) in $themeConfig.heroImages"
        :key="index">
        <img
          v-if="index === criticalIndex"
          ref="criticalHeroImg"
          :src="url"
          fetchpriority="high"
          decoding="async"
          @load="onCriticalImageReady"
          @error="onCriticalImageReady" />
        <img
          v-else
          :data-src="url"
          class="swiper-lazy"
          loading="lazy"
          decoding="async" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, onMounted, ref } from 'vue';
import Swiper from 'swiper';
import 'swiper/css/swiper.min.css';
import { markFirstScreenReady } from '../helpers/eventBus';

const props = defineProps({
  initialSlide: {
    type: Number,
    default: () => 0,
  },
});

const { proxy } = getCurrentInstance();
const swiper = ref();
const criticalHeroImg = ref(null);
let imageReady = false;
let swiperReady = false;
let notified = false;

const criticalIndex = computed(() => {
  const list = (proxy && proxy.$themeConfig && proxy.$themeConfig.heroImages) || [];
  const len = list.length || 1;
  return ((props.initialSlide % len) + len) % len;
});

const tryNotifyReady = () => {
  if (notified || !imageReady || !swiperReady) return;
  notified = true;
  // 等浏览器把首帧画出来再通知关闭 Loading，避免淡出时底下还是空的
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      markFirstScreenReady();
    });
  });
};

const onCriticalImageReady = () => {
  imageReady = true;
  tryNotifyReady();
};

onMounted(() => {
  swiper.value = new Swiper('.swiper-container', {
    initialSlide: props.initialSlide,
    loop: true,
    speed: 500,
    effect: 'fade',
    lazy: {
      loadPrevNext: true,
      loadPrevNextAmount: 2,
      loadOnTransitionStart: true,
    },
    updateOnImagesReady: true,
    on: {
      init() {
        swiperReady = true;
        nextTick(() => {
          const img = Array.isArray(criticalHeroImg.value)
            ? criticalHeroImg.value[0]
            : criticalHeroImg.value;
          if (img && img.complete) {
            imageReady = true;
          }
          tryNotifyReady();
        });
      },
      imagesReady() {
        imageReady = true;
        tryNotifyReady();
      },
    },
  });
});

defineExpose({
  swiper,
});
</script>

<style lang="stylus" scoped>
.swiper-container {
  --swiper-theme-color: $accentColor;
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
  .swiper-slide img {
    width: 100%;
    height: 100%;
    transition: 1s linear 2s;
    transform: scale(1.1, 1.1);
    object-fit: cover;
  }
  .swiper-slide-active img,
  .swiper-slide-duplicate-active img {
    transition: 6s linear;
    transform: scale(1, 1);
  }
}
</style>
