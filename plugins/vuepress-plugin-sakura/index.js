const { resolve } = require('path');

module.exports = (options = {}, context) => ({
  define() {
    const {
      num = 10,
      show = true,
      zIndex = -1,
      img = { replace: false, httpUrl: '' },
      mobileBreakpoint = 768,
    } = options;

    return {
      SAKURA_NUM: num,
      SAKURA_IMG: img,
      SAKURA_SHOW: show,
      SAKURA_ZINDEX: zIndex,
      SAKURA_MOBILE_BREAKPOINT: mobileBreakpoint,
    };
  },
  // VuePress 需要先注册组件，globalUIComponents 的名字才会生效
  enhanceAppFiles: resolve(__dirname, './enhanceAppFile.js'),
  globalUIComponents: ['Sakura'],
});
