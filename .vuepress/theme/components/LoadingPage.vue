<!-- 首屏 Loading：固定遮罩盖在首页之上，就绪后自身淡出 -->
<template>
  <div
    id="loader-wrapper"
    :class="{ ready: fontsReady, leaving }"
    @transitionend="onTransitionEnd">
    <div class="loader-bg" aria-hidden="true">
      <span class="loader-orb loader-orb--a"></span>
      <span class="loader-orb loader-orb--b"></span>
      <span class="loader-stars"></span>
    </div>

    <div class="loader-stage">
      <div class="loadingTipsContainer" v-if="$frontmatter.home">
        <p class="loader-eyebrow">ENTERING</p>
        <h3 class="title">{{ $site.title || $localeConfig.title }}</h3>
        <p class="description">
          {{ $site.description || $localeConfig.description }}
        </p>
      </div>

      <div class="loadingImageContainer">
        <div class="loader-ring" aria-hidden="true"></div>
        <img
          src="/images/pikachu-running.gif"
          alt=""
          width="96"
          height="64" />
      </div>

      <div class="loader-progress" aria-hidden="true">
        <span class="loader-progress-bar"></span>
      </div>
      <p class="loader-hint">正在连接浮游城…</p>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';

export default defineComponent({
  name: 'LoadingPage',
  props: {
    /** 为 true 时开始淡出 */
    leaving: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const fontsReady = ref(false);

    onMounted(() => {
      const reveal = () => {
        fontsReady.value = true;
      };

      if (typeof document === 'undefined' || !document.fonts) {
        reveal();
        return;
      }

      Promise.all([
        document.fonts.load('700 60px GLOBAL_FONT1'),
        document.fonts.load('700 22px GLOBAL_FONT'),
      ])
        .then(() => document.fonts.ready)
        .then(reveal)
        .catch(reveal);

      setTimeout(reveal, 1200);
    });

    const onTransitionEnd = (e) => {
      // 只响应自身 opacity 过渡结束
      if (!props.leaving) return;
      if (e.target !== e.currentTarget) return;
      if (e.propertyName && e.propertyName !== 'opacity') return;
      emit('after-leave');
    };

    return { fontsReady, onTransitionEnd };
  },
});
</script>

<style lang="stylus" scoped>
#loader-wrapper
  --loader-ink: #f4f1e8
  --loader-muted: rgba(244, 241, 232, 0.72)
  --loader-accent: $accentColor
  /* 必须 fixed：盖在首页之上，而不是文档流里把首页顶下去 */
  position fixed
  top 0
  right 0
  bottom 0
  left 0
  z-index 99999
  width 100vw
  height 100vh
  overflow hidden
  background linear-gradient(145deg, #141b2d 0%, #243b6b 48%, #10182a 100%)
  color var(--loader-ink)
  opacity 1
  visibility visible
  pointer-events auto
  transition opacity 0.9s ease, visibility 0.9s ease

  &.leaving
    opacity 0
    visibility hidden
    pointer-events none

  &.ready
    .loadingTipsContainer
      opacity 1
      transform translate3d(0, 0, 0)
    .loader-eyebrow
      opacity 1
    .loader-hint
      opacity 1

.loader-bg
  position absolute
  inset 0
  pointer-events none
  overflow hidden

.loader-orb
  position absolute
  border-radius 50%
  filter blur(48px)
  opacity 0.55
  animation loader-drift 8s ease-in-out infinite alternate

  &--a
    width 42vw
    height 42vw
    top -12%
    left -8%
    background radial-gradient(circle, rgba(75, 108, 183, 0.7) 0%, transparent 70%)

  &--b
    width 36vw
    height 36vw
    right -10%
    bottom -8%
    background radial-gradient(circle, rgba(217, 57, 59, 0.35) 0%, transparent 70%)
    animation-delay -3s

.loader-stars
  position absolute
  inset 0
  background-image radial-gradient(1.5px 1.5px at 12% 18%, rgba(255,255,255,0.7), transparent),
    radial-gradient(1px 1px at 28% 62%, rgba(255,255,255,0.55), transparent),
    radial-gradient(1.5px 1.5px at 64% 24%, rgba(255,255,255,0.65), transparent),
    radial-gradient(1px 1px at 78% 72%, rgba(255,255,255,0.5), transparent),
    radial-gradient(1.5px 1.5px at 88% 36%, rgba(255,255,255,0.6), transparent),
    radial-gradient(1px 1px at 46% 80%, rgba(255,255,255,0.45), transparent)
  animation loader-twinkle 4.5s ease-in-out infinite alternate

.loader-stage
  position relative
  z-index 1
  height 100%
  display flex
  flex-direction column
  align-items center
  justify-content center
  padding 0 1.5rem
  box-sizing border-box

.loadingTipsContainer
  display flex
  flex-direction column
  align-items center
  text-align center
  max-width 36rem
  margin-bottom 1.75rem
  opacity 0
  transform translate3d(0, 12px, 0)
  transition opacity 0.35s ease, transform 0.45s ease

.loader-eyebrow
  margin 0 0 0.65rem
  font-family GLOBAL_FONT, sans-serif
  font-size 0.72rem
  letter-spacing 0.42em
  text-indent 0.42em
  color rgba(244, 241, 232, 0.55)
  opacity 0
  transition opacity 0.4s ease 0.1s

.title
  margin 0
  font-family GLOBAL_FONT1, serif
  font-size clamp(2.6rem, 8vw, 4rem)
  font-weight 700
  letter-spacing 0.06em
  line-height 1.15
  color var(--loader-ink)
  text-shadow 0 0 24px rgba(75, 108, 183, 0.35), 0 2px 16px rgba(0, 0, 0, 0.35)

.description
  margin 0.9rem 0 0
  font-family GLOBAL_FONT, cursive, sans-serif
  font-size clamp(1rem, 2.8vw, 1.35rem)
  font-weight 600
  line-height 1.5
  color var(--loader-muted)
  text-shadow 0 1px 8px rgba(0, 0, 0, 0.25)

.loadingImageContainer
  position relative
  width 7.5rem
  height 7.5rem
  display flex
  align-items center
  justify-content center
  margin 0.25rem 0 1.75rem

  img
    position relative
    z-index 1
    width 6rem
    height 4rem
    object-fit contain
    filter drop-shadow(0 8px 16px rgba(0, 0, 0, 0.35))
    animation loader-bob 1.2s ease-in-out infinite

.loader-ring
  position absolute
  inset 0
  border-radius 50%
  border 1px solid rgba(244, 241, 232, 0.18)
  box-shadow 0 0 0 10px rgba(75, 108, 183, 0.08),
    inset 0 0 24px rgba(75, 108, 183, 0.15)
  animation loader-pulse 2.2s ease-in-out infinite

  &::after
    content ''
    position absolute
    inset -6px
    border-radius 50%
    border 1px solid transparent
    border-top-color rgba(217, 57, 59, 0.75)
    border-right-color rgba(217, 57, 59, 0.2)
    animation loader-spin 1.4s linear infinite

.loader-progress
  width min(14rem, 56vw)
  height 2px
  border-radius 999px
  background rgba(244, 241, 232, 0.14)
  overflow hidden

.loader-progress-bar
  display block
  width 40%
  height 100%
  border-radius inherit
  background linear-gradient(90deg, transparent, var(--loader-accent), #f0c4a8, transparent)
  animation loader-slide 1.35s ease-in-out infinite

.loader-hint
  margin 0.85rem 0 0
  font-family GLOBAL_FONT, sans-serif
  font-size 0.78rem
  letter-spacing 0.12em
  color rgba(244, 241, 232, 0.42)
  opacity 0
  transition opacity 0.35s ease 0.15s

@keyframes loader-drift
  from
    transform translate3d(0, 0, 0) scale(1)
  to
    transform translate3d(4%, 6%, 0) scale(1.08)

@keyframes loader-twinkle
  from
    opacity 0.55
  to
    opacity 1

@keyframes loader-bob
  0%, 100%
    transform translate3d(0, 0, 0)
  50%
    transform translate3d(0, -6px, 0)

@keyframes loader-pulse
  0%, 100%
    transform scale(1)
    opacity 0.85
  50%
    transform scale(1.06)
    opacity 1

@keyframes loader-spin
  to
    transform rotate(360deg)

@keyframes loader-slide
  0%
    transform translate3d(-120%, 0, 0)
  100%
    transform translate3d(320%, 0, 0)

@media (max-width: 719px)
  .loadingTipsContainer
    margin-bottom 1.25rem
  .loadingImageContainer
    width 6.5rem
    height 6.5rem
    margin-bottom 1.35rem
    img
      width 5rem
      height 3.35rem
  .loader-hint
    font-size 0.7rem
</style>
