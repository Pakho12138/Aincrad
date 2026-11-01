import Vue from 'vue';

export const EventBus = new Vue();

/** Loading 最少展示时长（从 Loading UI 出现起算，而非 HTML 解析时刻） */
export const LOADING_MIN_MS = 1500;

/** 首屏必要资源是否已就绪（loading 已可关闭） */
export const pageLoadState = {
  ready: false,
  pending: false,
  startedAt: 0,
};

export const FIRST_SCREEN_READY = 'aincrad:first-screen-ready';

let dismissTimer = null;

function dismissLoading() {
  if (pageLoadState.ready) return;
  pageLoadState.ready = true;
  pageLoadState.pending = false;
  dismissTimer = null;
  // 不在这里移除 page-loading：需等 Loading 淡出结束，否则会闪白底
  EventBus.$emit('hideLoading');
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(FIRST_SCREEN_READY));
  }
}

/** Loading 开始淡出：立刻去掉暗色底，露出下层首页（仍锁滚动、藏樱花） */
export function beginLoadingExit() {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.remove('page-loading');
  root.classList.add('page-loading-exit');
}

/** Loading 淡出结束：解锁滚动、放行樱花 */
export function clearPageLoadingClass() {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.remove('page-loading');
  root.classList.remove('page-loading-exit');
}

/**
 * 标记首屏资源就绪；若距 Loading 出现不足最小时长，会延后到满足后再关闭。
 */
export function markFirstScreenReady() {
  if (pageLoadState.ready || pageLoadState.pending) return;

  const startedAt = pageLoadState.startedAt || Date.now();
  if (!pageLoadState.startedAt) {
    pageLoadState.startedAt = startedAt;
  }

  const elapsed = Date.now() - startedAt;
  const wait = Math.max(0, LOADING_MIN_MS - elapsed);

  if (wait === 0) {
    dismissLoading();
    return;
  }

  pageLoadState.pending = true;
  dismissTimer = setTimeout(dismissLoading, wait);
}

/**
 * Loading UI 出现时调用：从此刻起算最小展示时长。
 * 不要用 head 里的 HTML 解析时间，否则 Vue 启动耗时会把最小时长吃掉。
 */
export function markLoadingStart() {
  if (dismissTimer) {
    clearTimeout(dismissTimer);
    dismissTimer = null;
  }
  pageLoadState.startedAt = Date.now();
  pageLoadState.ready = false;
  pageLoadState.pending = false;
}
