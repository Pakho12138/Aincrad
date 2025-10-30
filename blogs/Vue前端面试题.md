---
date: 2025-10-29
tags:
 - 面试题
 - Vue
categories:
 - 前端
image: https://ghcdn.pages.dev/pic/20251030173324089.webp
---

# Vue前端面试题

## 1. Vue的核心点是什么？

1. **渐进式框架**：可按需引入功能（如仅用核心视图层，或集成路由、状态管理等），灵活适配不同项目规模。
2. **响应式系统**：核心是数据驱动视图，通过 `Object.defineProperty`（Vue2）或 `Proxy`（Vue3）监听数据变化，自动更新 DOM。
3. **组件化开发**：将页面拆分为独立可复用的组件，组件有自己的模板、逻辑和样式，提升代码复用性与维护性。
4. **模板语法**：基于 HTML 扩展，结合插值（`{{ }}`）、指令（`v-bind`/`v-on`/`v-model`等）和内置组件，简洁实现视图与数据绑定。
5. **虚拟 DOM 与 Diff 算法**：用 JS 对象模拟真实 DOM，通过 Diff 算法计算最小更新量，减少真实 DOM 操作，提升渲染性能。
6. **生命周期钩子**：提供组件从创建到销毁的各阶段钩子（如 `created`/`mounted`/`unmounted`），方便在特定阶段执行逻辑。
7. **单向数据流**：组件间数据传递遵循 “父传子（props）、子传父（事件）”，避免数据混乱，双向绑定（`v-model`）是其语法糖。

## 2. Vue2与Vue3的区别是什么？

1. **响应式原理**
   - Vue2：基于 `Object.defineProperty` 劫持对象属性的 `get/set`，存在无法监听数组索引 / 长度变化、新增属性需 `$set` 等局限。
   - Vue3：基于 `Proxy` 代理整个对象，可监听数组变化、新增 / 删除属性，无需额外 API，响应式更彻底。
2. **API 风格**
   - Vue2：以 **Options API** 为主（`data`、`methods`、`computed` 等选项分组），逻辑分散，复杂组件维护困难。
   - Vue3：新增 **Composition API**（`setup` 入口，配合 `ref`、`reactive`、`watch` 等），按逻辑关注点组织代码，复用性更强；同时兼容 Options API。
3. **生命周期**
   - Vue2：`beforeCreate`、`created`、`mounted` 等直接定义在选项中。
   - Vue3：Composition API 中通过 `onMounted`、`onUpdated` 等函数调用（`beforeCreate`/`created` 被 `setup` 替代）。
4. **模板语法**
   - Vue2：模板需单个根节点。
   - Vue3：支持 **多根节点（Fragment）**，无需额外包裹 div。
5. **性能优化**
   - Vue3：编译阶段优化（静态节点提升、事件缓存）、减少重渲染，性能比 Vue2 提升约 55%。
6. **TypeScript 支持**
   - Vue2：对 TS 支持较弱，需额外配置（如 `vue-class-component`）。
   - Vue3：原生用 TS 开发，类型定义更完善，TS 支持更友好。
7. **其他新特性**
   - Vue3 新增 `Teleport`（组件瞬移）、`Suspense`（异步组件加载）、`v-memo`（缓存模板片段）等；
   - 全局 API 调整：`createApp()` 替代 `new Vue()`，更符合树摇优化。

## 3. Vue3的Proxy为什么比Vue2的Object.defineProperty性能更好？

1. **初始化效率更高**
   - `Object.defineProperty` 需**遍历对象所有属性**，为每个属性单独设置 `getter/setter`，若对象嵌套层级深（如多层对象），需递归遍历所有子属性，初始化耗时随属性数量 / 层级增加而显著上升。
   - `Proxy` 直接**代理整个对象**，无需遍历属性，对嵌套对象采用 “懒代理”（访问嵌套对象时才代理），大幅减少初始化阶段的计算开销，尤其适合大型 / 深层对象。
2. **对数组的处理更高效**
   - `Object.defineProperty` 无法原生监听数组索引修改、长度变化，Vue2 需通过**重写数组原型方法**（如 `push`、`splice`）实现监听，额外的方法拦截逻辑增加性能损耗。
   - `Proxy` 可直接监听数组的索引操作、长度变化等原生行为，无需重写方法，处理更简洁高效。
3. **动态属性监听无额外开销**
   - `Object.defineProperty` 仅能监听初始化时已存在的属性，新增 / 删除属性需手动调用 `$set`/`$delete` 触发响应，额外的 API 调用带来性能损耗。
   - `Proxy` 能自动监听对象的新增、删除属性等动态操作，无需额外处理，减少性能浪费。
4. **代理层级更优**
   - `Object.defineProperty` 是 “属性级代理”，每个属性需单独维护 `getter/setter`，内存占用随属性数量增加而增长。
   - `Proxy` 是 “对象级代理”，一个代理即可覆盖对象所有属性（包括未来新增的），内存占用更稳定。

## 4. Vue3的响应式API。

1. **ref**
   - 作用：将**基本类型（如 number、string）** 或对象转为响应式数据，返回一个带 `value` 属性的响应式对象。
   - 特点：访问 / 修改值需通过 `.value`；若传入对象，内部会自动用 `reactive` 处理（深层响应式）。
   - 场景：管理基本类型数据，或需要明确控制的对象。
2. **reactive**
   - 作用：将**对象 / 数组**转为响应式代理对象，支持深层响应式（嵌套属性也会被代理）。
   - 特点：直接访问属性（无需 `.value`）；仅对对象有效，不能用于基本类型。
   - 场景：管理复杂对象 / 数组数据。
3. **toRef**
   - 作用：将响应式对象（`reactive` 创建）的**单个属性**转为 `ref`，保持与原对象的响应性关联。
   - 示例：`const nameRef = toRef(user, 'name')`（`user` 是 `reactive` 对象）。
4. **toRefs**
   - 作用：将响应式对象（`reactive` 创建）的**所有属性**转为 `ref`，返回一个包含这些 `ref` 的普通对象，解决解构时丢失响应性的问题。
   - 示例：`const { name, age } = toRefs(user)`（解构后 `name`、`age` 仍为响应式）。
5. **浅层响应式 API**
   - `shallowRef`：仅监听 `.value` 的变化（不处理内部对象的响应式），适合大型数据优化。
   - `shallowReactive`：仅代理对象第一层属性（深层属性不响应），适合无需深层监听的场景。
6. **工具函数**
   - `unref`：若值为 `ref` 则返回 `.value`，否则直接返回值（`val = isRef(val) ? val.value : val` 的简写）。
   - `isRef`/`isReactive`：判断值是否为 `ref`/`reactive` 创建的响应式数据。

## 5. 路由有几种实现模式？

- **哈希模式（Hash Mode）**
  - 基于 URL 中的 `#`（哈希）部分，`#` 后的内容不会发送到服务器。
  - 通过监听 `hashchange` 事件感知路由变化，触发页面更新。
  - 优点：兼容性好（支持低版本浏览器），无需服务器配置。
- **历史模式（History Mode）**
  - 基于 HTML5 的 History API（`pushState`、`replaceState`），URL 无 `#`，更美观。
  - 需要服务器配置（如 Nginx 转发所有请求到 index.html），避免刷新时 404。
  - 优点：符合 RESTful 风格，URL 更直观。

## 6. 路由有几种跳转方式？

主要分**声明式**和**编程式**两种，核心区别是使用场景（模板 vs 逻辑代码）：

1. **声明式跳转**（模板中使用标签）
   - Vue：`<router-link to="/path">跳转</router-link>`（自动渲染为 a 标签，避免刷新页面）。
   - React：`<Link to="/path">跳转</Link>`（react-router-dom 提供，功能类似）。
2. **编程式跳转**（JS 逻辑中调用方法）
   - 基础跳转：Vue 用`this.$router.push('/path')`；React 用`navigate('/path')`（v6+）或`history.push('/path')`（v5 及之前）。
   - 替换历史记录（不新增 history 条目）：Vue 用`this.$router.replace('/path')`；React 用`navigate('/path', { replace: true })`。
   - 前进 / 后退：Vue 用`this.$router.go(n)`（n 为正数前进，负数后退）；React 类似，`history.go(n)`。

核心是通过路由实例方法或专用标签，实现 SPA（单页应用）内的无刷新页面切换。

## 7. Pinia和VueX的区别。

1. **核心概念**
   - VueX：包含 `State`（状态）、`Mutation`（同步修改状态的唯一方式）、`Action`（异步操作，通过 `commit` 调用 Mutation）、`Getter`（计算属性），强制区分同步 / 异步修改逻辑。
   - Pinia：无 `Mutation`，状态可直接在 `Action` 中修改（支持同步 / 异步），核心为 `State`、`Action`、`Getter`，逻辑更简洁。
2. **模块化管理**
   - VueX：需通过 `Module` 拆分模块，复杂项目需手动开启 `namespaced: true` 避免命名冲突，嵌套模块访问路径繁琐（如 `this.$store.state.moduleA.subModuleB`）。
   - Pinia：每个 `defineStore` 定义的 Store 本身就是独立模块，无需额外配置命名空间，模块间调用直接导入即可，结构更清晰。
3. **TypeScript 支持**
   - VueX：对 TS 支持较弱，需手动定义大量类型（如 `State`、`Mutation` 类型），类型推断不友好。
   - Pinia：原生基于 TS 开发，类型推断自动完成，无需额外类型声明，与 TS 结合更自然。
4. **API 风格**
   - VueX：依赖 `commit('mutationName')`、`dispatch('actionName')` 等方法，写法较繁琐。
   - Pinia：直接调用 Store 中的方法（如 `store.actionName()`），修改状态可直接赋值（`store.state.count++`），API 更简洁直观。
5. **响应式处理**
   - VueX：Vue2 中基于 `Object.defineProperty`，Vue3 中 VueX 4 适配 `Proxy`，但整体响应式逻辑较间接。
   - Pinia：完全基于 Vue3 的响应式 API（`ref`、`reactive`），响应式处理更原生，与 Vue3 生态结合更紧密。
6. **官方推荐**
   - VueX：曾是 Vue 官方状态管理方案，Vue3 中仍可使用 VueX 4，但不再是首选。
   - Pinia：现为 Vue 官方推荐（尤雨溪背书），被视为 VueX 的继任者，更适合 Vue3 项目。

## 8. 虚拟DOM的实现。

1. **核心概念**虚拟 DOM（Virtual DOM）是用 **JavaScript 对象** 模拟真实 DOM 的结构，包含标签名（`tag`）、属性（`props`）、子节点（`children`）、key 等信息，避免频繁操作真实 DOM（真实 DOM 操作性能开销大）。

2. **实现步骤**

   - **创建虚拟节点（VNode）**：定义函数生成 VNode 对象，示例结构：

     ```javascript
     { tag: 'div', props: { id: 'box' }, children: [/* 子VNode或文本 */], key: '1' }
     ```

   - **挂载（mount）**：将 VNode 转换为真实 DOM。递归处理 VNode：创建对应标签的 DOM 元素 → 设置属性（`setAttribute`）→ 处理子节点（文本直接插入，子 VNode 递归挂载）→ 挂载到容器。

   - **Diff 算法（对比差异）**：对比新旧 VNode 的差异（同层比较，因 DOM 极少跨层级变动）：

     - 先比较标签名，不同则直接替换整个节点；
     - 标签相同则比较`props`，更新属性差异；
     - 比较`children`，通过`key`匹配相同节点（减少 DOM 移动），处理新增、删除、移动节点。

   - **打补丁（patch）**：根据 Diff 结果，将差异应用到真实 DOM，仅更新变化部分（如修改属性、插入新节点、移动节点位置）。

3. **优势**

   - 减少真实 DOM 操作次数（JS 对象操作更高效）；
   - 抽象 DOM 操作，便于跨平台（如服务端渲染 SSR、小程序等）。

## 9. 什么是WatchEffect？

- 定义：Vue3 Composition API 中的响应式副作用监听函数，用于自动追踪依赖的响应式数据，当依赖变化时触发副作用函数。

- 核心特点：

  - **自动收集依赖**：无需手动指定监听的数据源，函数内部用到的响应式数据（`ref`/`reactive` 等）会被自动追踪。
  - **即时执行**：初始化时会立即执行一次副作用函数，之后仅在依赖变化时重新执行。

- 清理机制：副作用函数可返回一个清理函数，该函数会在**下次执行前**或**停止监听时**调用，用于清除无效副作用（如定时器、事件监听）。

- 返回值：返回一个停止函数，调用后可终止监听（不再响应依赖变化）。

- 示例：

  ```js
  const count = ref(0)
  const stop = watchEffect(() => {
    console.log('count:', count.value) // 自动追踪 count，count 变化时触发
    return () => { /* 清理逻辑 */ }
  })
  // 停止监听
  stop()
  ```

## 10. Vue3中watchEffect和watch的区别是什么？

1. **依赖追踪方式**
   - `watchEffect`：**自动收集依赖**，副作用函数内部用到的响应式数据（`ref`/`reactive` 等）会被自动追踪，无需手动指定监听源。
   - `watch`：**需明确指定监听源**（如 `ref`、`reactive` 属性、`getter` 函数等），仅追踪指定的数据源，更精确。
2. **执行时机**
   - `watchEffect`：**初始化时立即执行一次**（默认 “eager”），之后依赖变化时再执行。
   - `watch`：默认**懒执行**（初始化不执行），仅在监听源变化时触发；需初始化执行可设置 `immediate: true`。
3. **新旧值获取**
   - `watchEffect`：无法直接获取依赖的旧值，仅能访问当前值。
   - `watch`：回调函数可接收两个参数（`newValue`、`oldValue`），明确获取变化前后的值。
4. **使用场景**
   - `watchEffect`：适合无需区分新旧值、依赖较多且需自动追踪的场景（如数据变化后同步更新 DOM 或执行副作用）。
   - `watch`：适合需要精确控制监听源、获取新旧值对比、或需懒执行的场景（如监听特定数据变化并做复杂处理）。

## 11. Vue 3中怎么同时watch监听多个数据？

在 Vue 3 的 `setup` 中使用 `watch` 函数时，第一个参数可以是**数组**，包含多个监听源（ref、reactive 属性、getter 函数等），回调函数的参数为对应源的新值和旧值数组。

1. **监听多个 ref 或 reactive 属性**

```javascript
import { ref, reactive, watch } from "vue";

export default {
  setup() {
    const name = ref("Alice");
    const age = ref(20);
    const user = reactive({ address: "Beijing" });

    // 同时监听 name、age、user.address
    watch(
      // 监听源数组（ref 直接传，reactive 属性需用 getter 函数）
      [name, age, () => user.address],
      // 回调函数：newValues 对应每个源的新值，oldValues 对应旧值
      (newValues, oldValues) => {
        console.log("变化的新值：", newValues); // [新 name, 新 age, 新 address]
        console.log("变化的旧值：", oldValues); // [旧 name, 旧 age, 旧 address]
      },
      // 配置项（可选）
      { immediate: true }
    );

    return { name, age, user };
  }
};
```

2. **注意事项**

- 监听 `reactive` 对象的属性时，需用 **getter 函数**（如 `() => user.address`），否则会监听整个对象的所有属性变化（可能触发不必要的回调）。
- 若监听的是多个 `reactive` 对象，直接传入对象即可（但通常建议精确到属性，避免性能问题）。
- 回调函数的 `newValues` 和 `oldValues` 顺序与监听源数组的顺序一致。

## 12. nextTick的作用与原理。

- 作用：在 Vue 的 DOM 异步更新完成后执行回调函数，解决数据更新后立即操作 DOM 获取不到最新 DOM 状态的问题。
- 原理：
  1. Vue 中数据变化触发的 DOM 更新是异步的，会将更新操作放入 "异步更新队列"，等待当前同步代码执行完毕后批量处理；
  2. nextTick 的回调会被添加到该异步队列末尾（或使用浏览器原生异步 API，如`Promise.then`、`MutationObserver`、`setTimeout`），确保在 DOM 更新完成后执行。

## 13. 为什么vue不建议v-for和v-if放在一起？

Vue 不建议 v-for 与 v-if 共存，核心原因是**两者优先级冲突导致性能浪费**：v-for 的优先级高于 v-if，会先遍历所有列表项，再对每个项执行 v-if 判断，即使 90% 的项会被 v-if 过滤，也会先完成无意义的遍历。

### 具体问题与解决方案

#### 1. 场景 1：过滤列表项（如 “只显示已完成的任务”）

错误写法（低效）：先遍历所有 task，再判断是否 completed，遍历了无用项。

```vue
<!-- 错误：v-for与v-if同处一个标签 -->
<li v-for="task in tasks" v-if="task.completed" :key="task.id">
  {{ task.name }}
</li>
```

正确写法：用**computed 先过滤数据**，v-for 直接遍历过滤后的结果，避免无效遍历。

```vue
<!-- 正确：v-for遍历已过滤的computed属性 -->
<li v-for="task in completedTasks" :key="task.id">
  {{ task.name }}
</li>

<script>
export default {
  computed: {
    completedTasks() {
      // 先过滤，再返回给v-for
      return this.tasks.filter(task => task.completed)
    }
  }
}
</script>
```

#### 2. 场景 2：控制整个列表是否渲染（如 “列表为空时不显示”）

错误写法（逻辑冗余）：v-for 先遍历空数组（无意义），再 v-if 判断是否显示，多余一次遍历。

```vue
<!-- 错误：v-for与v-if同处一个标签 -->
<ul v-for="task in tasks" v-if="tasks.length">
  <li :key="task.id">{{ task.name }}</li>
</ul>
```

正确写法：把**v-if 提至父元素**，先判断列表是否有数据，再决定是否执行 v-for，减少无效操作。

```vue
<!-- 正确：父元素判断，有数据才执行v-for -->
<ul v-if="tasks.length">
  <li v-for="task in tasks" :key="task.id">
    {{ task.name }}
  </li>
</ul>
```

## 14. vue路由守卫有哪些？

### 1. 全局守卫（影响所有路由）

定义在`router/index.js`中，对所有路由生效，常用 2 种：

- **beforeEach**：路由**跳转前**触发（可阻止跳转），最常用作登录验证。

  示例（未登录拦截跳登录页）：

  ```javascript
  const router = createRouter({ ... })
  // to：目标路由，from：当前路由，next：放行/跳转控制
  router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    // 若目标路由需要登录，且无token，跳登录页
    if (to.meta.requiresAuth && !token) {
      next('/login') 
    } else {
      next() // 正常放行
    }
  })
  ```

- **afterEach**：路由**跳转后**触发（无法阻止跳转），常用作修改页面标题、埋点统计。

  示例：

  ```javascript
  router.afterEach((to) => {
    document.title = to.meta.title || '默认标题' // 用路由meta配置页标题
  })
  ```

### 2. 路由独享守卫（仅影响单个路由）

在路由配置中定义，只对当前路由生效，仅`beforeEnter`一种：示例（详情页校验 ID 合法性）：

```javascript
const routes = [
  {
    path: '/detail/:id',
    component: Detail,
    // 仅当前路由跳转前触发
    beforeEnter: (to, from, next) => {
      // 校验ID是否为数字，不合法则跳首页
      if (isNaN(to.params.id)) {
        next('/')
      } else {
        next()
      }
    }
  }
]
```

### 3. 组件内守卫（仅当前组件生效）

定义在组件内部，监听组件与路由的关联变化，常用 3 种：

- **beforeRouteEnter**：组件**进入前**触发（此时`this`未生成，需用`next回调`访问组件）。

  示例（获取路由参数）：

  ```vue
  <script>
  export default {
    beforeRouteEnter(to, from, next) {
      // 通过next回调获取组件实例（this）
      next(vm => {
        vm.id = to.params.id // 把路由参数赋值给组件data
      })
    }
  }
  </script>
  ```

- **beforeRouteLeave**：组件**离开前**触发（可阻止离开，如提示未保存内容）。

  示例（表单未提交拦截）：

  ```vue
  <script>
  export default {
    data() { return { formEdited: false } },
    beforeRouteLeave(to, from, next) {
      if (this.formEdited) {
        if (confirm('表单未保存，确定离开？')) {
          next()
        } else {
          next(false) // 阻止离开
        }
      } else {
        next()
      }
    }
  }
  </script>
  ```

- **beforeRouteUpdate**：组件复用（如`/user/1`跳`/user/2`）时触发，用于更新组件数据。

## 15. Vue的插槽有哪些？

Vue 的插槽（Slot）是**组件间内容分发的出口**，允许父组件向子组件的指定位置插入自定义内容，实现组件的灵活复用。

### 1. 基础插槽（默认插槽）

子组件用 `<slot>` 标签定义 “内容接收区”，父组件在使用子组件时，直接在组件标签内写内容即可传入。

- 子组件（Child.vue）：

  ```vue
  <template>
    <div>
      <h2>子组件标题</h2>
      <slot>默认内容（父组件没传内容时显示）</slot>
    </div>
  </template>
  ```

- 父组件使用：

  ```vue
  <template>
    <Child>
      <p>这是父组件传给子组件的内容</p> <!-- 会替换slot标签 -->
    </Child>
  </template>
  ```

### 2. 具名插槽

当子组件需要多个 “内容接收区” 时，给 `<slot>` 加 `name` 属性区分，父组件用 `v-slot:name`（简写 `#name`）指定内容对应位置。

- 子组件（Child.vue）：

  ```vue
  <template>
    <div>
      <slot name="header">默认头部</slot>
      <slot>默认内容</slot>
      <slot name="footer">默认底部</slot>
    </div>
  </template>
  ```

- 父组件使用：

  ```vue
  <template>
    <Child>
      <template #header>
        <h1>父组件的头部</h1>
      </template>
      <p>父组件的内容</p> <!-- 对应默认插槽 -->
      <template #footer>
        <p>父组件的底部</p>
      </template>
    </Child>
  </template>
  ```

### 3. 作用域插槽

子组件向父组件 “传数据”，让父组件能基于子组件的数据渲染内容，子组件用 `slotProps` 传值，父组件接收后使用。

- 子组件（Child.vue）：

  ```vue
  <template>
    <ul>
      <li v-for="item in list" :key="item.id">
        <!-- 把item传给父组件 -->
        <slot :item="item">默认显示：{{ item.name }}</slot>
      </li>
    </ul>
  </template>
  <script>
  export default {
    data() {
      return { list: [{ id: 1, name: "苹果" }, { id: 2, name: "香蕉" }] };
    },
  };
  </script>
  ```

- 父组件使用：

  ```vue
  <template>
    <Child>
      <!-- 接收子组件传的item，自定义渲染 -->
      <template #default="slotProps">
        水果：{{ slotProps.item.name }}（ID：{{ slotProps.item.id }}）
      </template>
    </Child>
  </template>
  ```