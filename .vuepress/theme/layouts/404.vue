<template>
  <section class="theme-container" v-if="!noFoundPageByTencent">
    <article class="content">
      <h1>404</h1>
      <blockquote>{{ getMsg() }}</blockquote>
      <router-link to="/">Take me home.</router-link>
      <img-lazy src="https://ghcdn.pages.dev/pic/20250705163803459.webp" />
    </article>
  </section>
</template>

<script>
import { defineComponent, computed, onMounted } from 'vue'
import { useInstance } from '@theme/helpers/composable'

const msgs = [
  `There's nothing here.`,
  `How did we get here?`,
  `That's a Four-Oh-Four.`,
  `Looks like we've got some broken links.`
]

export default defineComponent({
  setup (props, ctx) {
    const instance = useInstance()

    const noFoundPageByTencent = computed(() => {
      return instance.$themeConfig.noFoundPageByTencent !== false
    })

    const getMsg = () => {
      return msgs[Math.floor(Math.random() * msgs.length)]
    }

    onMounted(() => {
      if (noFoundPageByTencent.value) {
        const dom = document.createElement('script')
        dom.setAttribute('homePageName', '回到首页')
        dom.setAttribute('homePageUrl', instance.$site.base)
        dom.setAttribute('src', '//qzonestyle.gtimg.cn/qzone/hybrid/app/404/search_children.js')

        document.body.append(dom)
      }
    })

    return { noFoundPageByTencent, getMsg }
  }
})
</script>

<style src="../styles/theme.styl" lang="stylus"></style>

<style lang="stylus" scoped>
.content
  margin 4rem auto 0
  max-width 800px
  padding 0 2rem
.mod_404
  .desc
    .desc_link
      display: inline-block
      // margin: 20px 0
      background: #424242!important
      color: #ffffff
      padding: 6px 20px!important
      text-decoration: none!important
      border-radius: 4px
a
  display block
.image-wrapper
  display: block;
  width: 400px;
  height: 600px;
  margin: 40px auto;

@media screen and (max-width: 720px)
  .mod_404
    .desc
      margin: 50px 0
    .wrapper
      margin 0!important
      padding-top 20px
</style>

