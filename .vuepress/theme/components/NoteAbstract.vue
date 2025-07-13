<template>
  <div class="abstract-wrapper">
    <NoteAbstractItem
      v-for="item in currentPageData"
      :key="item.path"
      :item="item"
      :currentPage="currentPage"
      :currentTag="currentTag" />
    <pagation
      v-show="false"
      class="pagation"
      :total="data.length"
      :currentPage="currentPage"
      @getCurrentPage="getCurrentPage" />
    <div
      v-if="showNextBtn"
      class="btn-next"
      @click="currentPage++"
      @mouseenter="$kbnShowTip(`去看看更多文章~`)">
      加载更多
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, toRefs, computed, onMounted } from 'vue';
import pagination from '@theme/mixins/pagination';
import NoteAbstractItem from './NoteAbstractItem';
import { useInstance } from '@theme/helpers/composable';

export default defineComponent({
  mixins: [pagination],
  components: { NoteAbstractItem },
  props: ['data', 'currentTag'],

  setup(props, ctx) {
    const instance = useInstance();

    const { data } = toRefs(props);

    const currentPage = ref(1);

    const currentPageData = computed(() => {
      const start = (currentPage.value - 1) * instance.$perPage;
      const end = currentPage.value * instance.$perPage;

      return data.value.slice(0, end);
    });

    const getCurrentPage = page => {
      currentPage.value = page;
      instance._setStoragePage(page);

      ctx.emit('paginationChange', page);
    };

    onMounted(() => {
      // currentPage.value = instance._getStoragePage() || 1;
      currentPage.value = 1;
    });

    return { currentPage, currentPageData, getCurrentPage };
  },
  computed: {
    // 是否显示加载更多按钮
    showNextBtn() {
      return this.currentPage < Math.ceil(this.$props.data.length / 10);
    },
  },
  watch: {
    $route() {
      // this.currentPage = this._getStoragePage() || 1;
      this.currentPage = 1;
    },
  },
});
</script>

<style lang="stylus" scoped>
.abstract-wrapper {
  width: 100%;
}

.btn-next {
  margin: 40px auto 0;
  width: 80px;
  padding: 13px 35px;
  border: 1px solid #d6d6d6;
  border-radius: 50px;
  color: #adadad;
  text-align: center;
  &:hover {
    color: $accentColor;
    border: 1px solid $accentColor;
    box-shadow: 0 0 10px rgba($accentColor, 0.2);
  }
}
</style>
