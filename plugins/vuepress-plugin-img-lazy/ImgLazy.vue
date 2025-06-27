<template>
  <img
    v-bind="$attrs"
    v-if="config.loadImage"
    :src="config.loadImage"
    :data-src="dataSrc"
    :loading="config.useNative ? 'lazy' : null"
    :class="[config.selector, { show: showAnimate }]"
    @load="handleImageLoad"
    @error="handleError" />
  <!-- 当 config.loadImage 无值时显示 CSS 加载效果 -->
  <div v-else class="image-loading">
    <div v-if="!showAnimate" class="skeleton-loader"></div>
    <img
      v-bind="$attrs"
      :data-src="dataSrc"
      :loading="config.useNative ? 'lazy' : null"
      :class="[config.selector, { show: showAnimate }]"
      @load="handleImageLoad"
      @error="handleError" />
  </div>
</template>

<script>
import config from '@dynamic/imgLazy';

export default {
  name: 'ImgLazy',
  props: {
    src: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isFirst: true,
      showAnimate: false,
    };
  },
  computed: {
    config() {
      return config;
    },
    dataSrc() {
      return this.src &&
        this.src.charAt(0) === '/' &&
        !this.src.startsWith(this.$site.base)
        ? this.$site.base + this.src.slice(1)
        : this.src;
    },
  },
  methods: {
    handleError(e) {
      config.errorImage && (e.currentTarget.src = config.errorImage);
      this.$emit('error', e);
    },
    handleImageLoad() {
      if (config.loadImage) {
        if (!this.isFirst) {
          this.showAnimate = true;
        }
        this.isFirst = false;
      } else {
        this.showAnimate = true;
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.show {
  animation: blur-in 1s ease-out; // 修改动画为 ease-out 让结束更平滑
}

.image-loading {
  position: relative;
  width: 100%;
  height: 100%;
  // 使用 data-aspect-ratio 属性计算 padding-bottom
  padding-bottom: calc(attr(data-aspect-ratio number) * 100%);
  background-color: #f0f0f0;
  overflow: hidden;

  .skeleton-loader {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite; // 添加骨架屏动画
  }

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 0.3s ease;

    &.show {
      opacity: 1;
    }
  }
}

@keyframes blur-in {
  0% {
    filter: blur(10px);
    transform: scale(1.05); // 初始时稍微放大
  }
  100% {
    filter: blur(0);
    transform: scale(1); // 恢复正常大小
  }
}

@keyframes skeleton-loading {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>
