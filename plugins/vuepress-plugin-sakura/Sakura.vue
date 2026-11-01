<template>
  <div v-if="active" class="Sakura">
    <canvas ref="canvas" class="sakura-canvas" :style="{ zIndex }"></canvas>
  </div>
</template>

<script>
const MOBILE_BREAKPOINT = 720;
const FIRST_SCREEN_READY = 'aincrad:first-screen-ready';

function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isDesktopViewport() {
  if (typeof window === 'undefined') return false;
  return window.innerWidth > MOBILE_BREAKPOINT;
}

class Petal {
  constructor(x, y, s, r, fnx, fny, fnr, img) {
    this.x = x;
    this.y = y;
    this.s = s;
    this.r = r;
    this.fnx = fnx;
    this.fny = fny;
    this.fnr = fnr;
    this.img = img;
  }
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.r);
    ctx.drawImage(this.img, 0, 0, 40 * this.s, 40 * this.s);
    ctx.restore();
  }
  update(w, h, factory) {
    this.x = this.fnx(this.x);
    this.y = this.fny(this.y);
    this.r = this.fnr(this.r);
    if (this.x > w || this.x < 0 || this.y > h || this.y < 0) {
      const seed = factory();
      this.x = seed.x;
      this.y = seed.y;
      this.s = seed.s;
      this.r = seed.r;
      this.fnx = seed.fnx;
      this.fny = seed.fny;
      this.fnr = seed.fnr;
    }
  }
}

function makeSeed(w, h) {
  const random = -0.5 + Math.random();
  const drift = 1.5 + Math.random() * 0.7;
  const spin = Math.random() * 0.03;
  const fromTop = Math.random() > 0.4;
  return {
    x: fromTop ? Math.random() * w : w,
    y: fromTop ? 0 : Math.random() * h,
    s: Math.random(),
    r: Math.random() * 6,
    fnx: (x) => x + 0.5 * random - 1.7,
    fny: (y) => y + drift,
    fnr: (r) => r + spin,
  };
}

export default {
  name: 'Sakura',
  data() {
    return {
      active: false,
      num: typeof SAKURA_NUM === 'undefined' ? 10 : SAKURA_NUM,
      show: typeof SAKURA_SHOW === 'undefined' ? true : SAKURA_SHOW,
      zIndex: typeof SAKURA_ZINDEX === 'undefined' ? -1 : SAKURA_ZINDEX,
      rafId: null,
      resizeHandler: null,
    };
  },
  mounted() {
    if (!this.show) return;
    if (!isDesktopViewport()) return;
    if (prefersReducedMotion()) return;
    // 等首屏 Loading 结束后再启动，避免在 Loading 出现前闪出樱花
    if (!document.documentElement.classList.contains('page-loading')) {
      this.activate();
    } else {
      window.addEventListener(FIRST_SCREEN_READY, this.activate, { once: true });
    }
  },
  beforeDestroy() {
    window.removeEventListener(FIRST_SCREEN_READY, this.activate);
    this.stop();
  },
  methods: {
    activate() {
      if (this.active) return;
      this.active = true;
      this.$nextTick(() => this.start());
    },
    start() {
      const canvas = this.$refs.canvas;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const setSize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      setSize();
      this.resizeHandler = setSize;
      window.addEventListener('resize', this.resizeHandler, { passive: true });

      const img = new Image();
      img.src =
        typeof SAKURA_IMG !== 'undefined' && SAKURA_IMG.replace
          ? SAKURA_IMG.httpUrl
          : require('./sakura.png');

      const list = [];
      const w = window.innerWidth;
      const h = window.innerHeight;
      for (let i = 0; i < this.num; i++) {
        const seed = makeSeed(w, h);
        seed.x = Math.random() * w;
        seed.y = Math.random() * h;
        list.push(new Petal(seed.x, seed.y, seed.s, seed.r, seed.fnx, seed.fny, seed.fnr, img));
      }

      const loop = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < list.length; i++) {
          list[i].update(canvas.width, canvas.height, () => makeSeed(canvas.width, canvas.height));
          list[i].draw(ctx);
        }
        this.rafId = window.requestAnimationFrame(loop);
      };
      img.onload = () => {
        this.rafId = window.requestAnimationFrame(loop);
      };
    },
    stop() {
      if (this.rafId) {
        window.cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
      if (this.resizeHandler) {
        window.removeEventListener('resize', this.resizeHandler);
        this.resizeHandler = null;
      }
    },
  },
};
</script>

<style scoped>
.sakura-canvas {
  pointer-events: none;
  position: fixed;
  top: 0;
  left: 0;
}
</style>
