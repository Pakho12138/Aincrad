<template>
<div class="personal-info-wrapper">
  <!-- <img
    class="personal-img"
    v-if="$themeConfig.authorAvatar"
    :src="$withBase($themeConfig.authorAvatar)"
    alt="author-avatar"
    @mouseenter="$kbnShowTip(`鼠标放上面看看~`)"
  >
  <h3
    class="name"
    v-if="$themeConfig.author"
  >
    {{ $themeConfig.author }}
  </h3>
  <div class="num">
    <div>
      <h3>{{$recoPosts.length}}</h3>
      <h6>{{$recoLocales.article}}</h6>
    </div>
    <div>
      <h3>{{$tags.list.length}}</h3>
      <h6>{{$recoLocales.tag}}</h6>
    </div>
  </div> -->
  <ul class="social-links">
    <li
      class="social-item"
      v-for="(item, index) in socialLinks"
      :key="index"
      @mouseenter="$kbnShowTip(`想访问链接<b>“${item.link}”</b>么？`)"
    >
      <reco-icon :icon="item.icon" :link="item.link" :style="{ color: item.color }" />
    </li>
  </ul>
  <hr>
</div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { RecoIcon } from '@vuepress-reco/core/lib/components'
import { getOneColor } from '@theme/helpers/other'
import { useInstance } from '@theme/helpers/composable'

export default defineComponent({
  components: { RecoIcon },
  setup (props, ctx) {
    const instance = useInstance()
    const socialLinks = computed(() => (instance.$themeConfig.blogConfig && instance.$themeConfig.blogConfig.socialLinks || []).map(item => {
      if (!item.color) item.color = getOneColor()
      return item
    }))

    return { socialLinks }
  }
})
</script>

<style lang="stylus" scoped>
.personal-info-wrapper {
  .personal-img {
    display block
    margin 2rem auto 1rem
    width 6rem
    height 6rem
    border-radius 50%
  }
  .name {
    font-size 1rem
    text-align center
    color var(--text-color)
  }
  .num {
    display flex
    margin 0 auto 1rem
    width 80%
    > div {
      text-align center
      flex 0 0 50%
      &:first-child {
        border-right 1px solid #333
      }
      h3 {
        line-height auto
        margin 0 0 .6rem
        color var(--text-color)
      }
      h6 {
        line-height auto
        color var(--text-color)
        margin 0
      }
    }
  }
  .social-links {
    box-sizing border-box
    display flex
    flex-wrap wrap
    padding 10px
    .social-item {
      width 39px
      height 36px
      line-height 36px
      text-align center
      list-style none
      transition transform .3s
      &:hover {
        transform scale(1.08)
      }
      i {
        cursor pointer
        font-size 22px
      }
    }
  }
}
</style>
