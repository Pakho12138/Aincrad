<template>
  <div ref="abstractRef" class="abstract-item img-blur" @click="$router.push(item.path)" @mouseenter="showKbnTip(item.title)">
    <reco-icon v-if="item.frontmatter.sticky" icon="reco-sticky" />
    <div class="info-detail">
      <div class="title">
        <reco-icon v-if="item.frontmatter.keys" icon="reco-lock" />
        <router-link :to="item.path">{{ item.title }}</router-link>
      </div>
      <PageInfo :pageInfo="item" :currentTag="currentTag" style="margin-top: 8px; --text-color-sub: #999"> </PageInfo>
      <div class="abstract" v-html="item.excerpt"></div>
      <span class="more">...</span>
    </div>
    <div class="thumbnail-wrapper">
      <img-lazy class="thumbnail" :src="item.frontmatter.image || item.firstImage || defaultImg" />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { RecoIcon } from '@vuepress-reco/core/lib/components';
import PageInfo from './PageInfo';
export default defineComponent({
  components: { PageInfo, RecoIcon },
  props: ['item', 'currentPage', 'currentTag'],
  data() {
    return {
      defaultImg: 'images/img-error.webp', // 默认图片
      observer: null,
      options: {
        root: null,
        rootMargin: '0px',
        threshold: 0,
      },
    };
  },
  methods: {
    handleIntersection(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('post-list-show');
          entry.target.classList.remove('img-blur');
          this.observer.unobserve(entry.target);
        }
      });
    },
    showKbnTip(text) {
      // 看板娘提示
      this.$kbnShowTip(`想看看文章<b>《${text}》</b>么？`);
    },
  },
  mounted() {
    this.observer = new IntersectionObserver(this.handleIntersection, this.options);
    this.observer.observe(this.$refs.abstractRef);
  },
  beforeDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  },
});
</script>

<style lang="stylus" scoped>
.abstract-item
  display flex
  position relative
  width 100%
  height 300px
  overflow: hidden;
  border-radius: $borderRadius
  box-shadow: var(--box-shadow);
  box-sizing: border-box;
  transition all .3s
  background-color var(--background-color)
  cursor: pointer;
  > * {
    pointer-events: auto;
  }
  & + &
    margin: 40px auto 0px;
  &:nth-child(2n-1)
    .more
      left 20px
  &:nth-child(2n)
    flex-direction row-reverse
    .more
      right 20px
  &:hover .thumbnail
    transform scale(1.2) rotate(5deg)
  .reco-sticky
    position absolute
    top 0
    left 0
    display inline-block
    color $accentColor
    font-size 2.4rem
  &:hover
    box-shadow: var(--box-shadow-hover)
  &.post-list-show
    animation: fade-in-bt .5s;
  &.img-blur .thumbnail
    filter blur(10px)
  .thumbnail-wrapper
    width 55%
    overflow hidden
    .thumbnail
      width 100%
      height 100%
      object-fit cover
      object-position center
      transition all .6s
  .info-detail
    position relative
    flex 1
    overflow hidden
    padding 20px
    .title
      position: relative;
      font-size: 1.28rem;
      line-height: 46px;
      display: inline-block;
    a
      color: var(--text-color);
    .reco-lock
      font-size 1.28rem
      color $accentColor
    &:after
      content: "";
      position: absolute;
      width: 100%;
      height: 2px;
      bottom: 0;
      left: 0;
      background-color: $accentColor;
      visibility: hidden;
      -webkit-transform: scaleX(0);
      transform: scaleX(0);
      transition: .3s ease-in-out;
    &:hover
      .title, a, .more
        color $accentColor
    &:hover:after
      visibility visible
      -webkit-transform: scaleX(1);
      transform: scaleX(1);
    .tags
      .tag-item
        &.active
          color $accentColor
        &:hover
          color $accentColor
    .abstract
      color #666
      line-height 1.8
    .more
      position: absolute;
      bottom: 10px;
      font-size: 3rem;
      color: #999;
@media (max-width: $MQMobile)
  .tags
    display block
    margin-top 1rem;
    margin-left: 0!important;
</style>
