---
date: 2023-08-12
tags:
 - Vue
categories:
 - 前端
image: https://ghcdn.pages.dev/pic/20250705160421816.webp
---

# 组合式 API 

## 什么是组合式 API？

Vue 3 组合式 API 是 Vue 3 中引入的全新特性，它允许我们将逻辑相关的代码封装到一组函数中，以便在不同组件中复用。相比于 Vue 2 中的 选项式API，组合式 API 更加灵活且易于组织和维护代码。在 Vue 3 中，我们可以使用 `<script setup>` 语法来编写更简洁、易读的组合式 API。

## 为什么使用组合式 API？

- **更简洁的代码：** 使用 `<script setup>` 语法可以让我们的代码更加简洁，不再需要在组合式API 中定义 `data`、`methods`、`computed` 等属性，而是可以直接使用变量和函数。

- **更好的作用域封装：** 在 Vue 2 中，我们需要通过 `this` 来访问组件实例的属性和方法。但在 `<script setup>` 中，我们可以直接访问响应式数据和组件上下文中的其他函数，无需使用 `this`，使得代码更加清晰。

- **更灵活的代码组织：**

  `选项式 API` 处理相同逻辑关注点的代码被强制拆分在了不同的选项中，位于文件的不同部分。在一个几百行的大组件中，要读懂代码中的一个逻辑关注点，需要在文件中反复上下滚动，这并不理想。另外，如果我们想要将一个逻辑关注点抽取重构到一个可复用的工具函数中，需要从文件的多个不同部分找到所需的正确片段。

  `组合式API`同一个逻辑关注点相关的代码被归为了一组：我们无需再为了一个逻辑关注点在不同的选项块间来回滚动切换。此外，我们现在可以很轻松地将这一组代码移动到一个外部文件中，不再需要为了抽象而重新组织代码，大大降低了重构成本，这在长期维护的大型项目中非常关键。

- **更好的类型推导：** 由于 `<script setup>` 中的代码是静态分析的，Vue 3 可以更好地推导出代码的类型信息，提供更好的类型检查和智能提示，增加了代码的安全性。

- **更小的生产包体积：**搭配 `<script setup>` 使用组合式 API 比等价情况下的选项式 API 更高效，对代码压缩也更友好。这是由于 `<script setup>` 形式书写的组件模板被编译为了一个内联函数，和 `<script setup>` 中的代码位于同一作用域。不像选项式 API 需要依赖 `this` 上下文对象访问属性，被编译的模板可以直接访问 `<script setup>` 中定义的变量，无需从实例中代理。这对代码压缩更友好，因为本地变量的名字可以被压缩，但对象的属性名则不能。

## 如何使用 `<script setup>` 语法？

在 Vue 3 中，我们可以在单文件组件的 `<script>` 部分使用 `<script setup>` 标签来编写组合式 API。

```vue
<template>
  <div>
    <p>{{ message }}</p>
    <button @click="increment">增加</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const message = ref('Hello, Vue 3 组合式 API!');
const increment = () => {
  count.value++;
};
</script>
```

在这个示例中，我们使用了 `<script setup>` 标签。在 `<script setup>` 中，我们可以直接使用 `ref` 来创建响应式数据 `message`，以及定义函数 `increment`，用于增加计数器的值。

## 组合式 API 的基本使用

### 响应式数据

使用 `ref` 来创建一个响应式数据，可以自动追踪其变化，并在模板中进行双向绑定。

```vue
<template>
  <div>
    <p>{{ count }}</p>
    <button @click="increment">增加</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const count = ref(0);
const increment = () => {
  count.value++;
};
</script>
```

在 Vue 3 组合式 API 中，我们可以使用 `reactive` 函数来创建一个响应式对象。与 `ref` 不同，`reactive` 可以将普通对象转换为响应式对象，使其内部的属性变成可监听的，从而在响应式数据变化时更新相关视图。

使用 `reactive` 函数的方式如下：

```vue
<template>
  <div>
    <p>{{ person.name }}</p>
    <p>{{ person.age }}</p>
    <button @click="incrementAge">增加年龄</button>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

const person = reactive({
  name: 'Alice',
  age: 25,
});

const incrementAge = () => {
  person.age++;
};
</script>
```

在上面的例子中，我们使用 `reactive` 函数来创建了一个响应式对象 `person`，该对象包含了 `name` 和 `age` 这两个属性。在模板中，我们可以直接访问 `person` 对象的属性，并且当 `age` 属性发生变化时，相关视图也会自动更新。

与 `ref` 不同，`reactive` 可以监听对象内部属性的变化，而不仅仅是对象本身的引用变化。因此，如果我们有一个复杂的对象，其中包含多个属性，可以使用 `reactive` 来确保其内部属性的响应式。

需要注意的是，由于 `reactive` 是递归的，如果对象的属性值也是对象，则内部对象的属性也会变成响应式的。对于新增加的属性，Vue 3 也会将其自动设置为响应式。

```vue
<template>
  <div class="hy-wrapper">
    <p>{{ person.name }}</p>
    <p>{{ person.age }}</p>
    <p>{{ person.newProperty?.value }}</p>
    <button @click="incrementAge">增加年龄</button>
    <button @click="addNewProperty">添加新属性</button>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

const person = reactive<any>({
  name: 'Alice',
  age: 25,
});

const incrementAge = () => {
  person.age++;
};

const addNewProperty = () => {
  // 直接给 newProperty 赋值，它会自动成为响应式的
  person.newProperty = {
    value: 'New Property',
  };
};
</script>
```

以下是关于 `toRef` 和 `toRefs` 的 Markdown 文档：

### toRef 和 toRefs 函数

`toRef` 和 `toRefs` 是 Vue3 中用于处理响应式数据的实用函数，它们能够在组合式 API 中更方便地处理响应式数据。

#### toRef 函数

`toRef` 函数用于将一个响应式数据对象的属性转换为一个新的 ref 对象。这样，我们可以在组合式 API 中以 ref 的方式访问原始数据对象的属性，从而使其成为一个响应式数据。

```javascript
import { reactive, toRef } from 'vue';

const state = reactive({
  count: 0,
  message: 'Hello!'
});

const countRef = toRef(state, 'count');
```

在上面的例子中，我们使用 `toRef` 函数将 `state` 对象中的 `count` 属性转换为一个 ref 对象 `countRef`。现在，`countRef` 就是一个独立的响应式数据，并且与 `state.count` 相关联，对 `countRef` 的修改会同步更新到 `state.count`。

#### toRefs 函数

`toRefs` 函数用于将一个响应式数据对象转换为 ref 对象的集合。这个函数在组合式 API 中经常用于返回响应式数据对象的所有属性，以便在模板中可以直接解构使用每个属性。

```javascript
import { reactive, toRefs } from 'vue';

const state = reactive({
  count: 0,
  message: 'Hello!'
});

const stateRefs = toRefs(state);
```

在上面的例子中，我们使用 `toRefs` 函数将 `state` 对象转换为一个包含两个 ref 对象的集合 `stateRefs`，其中一个是 `count`，另一个是 `message`。现在，我们可以在模板中直接解构使用这些属性：

```vue
<template>
  <div>
    <p>Count: {{ stateRefs.count }}</p>
    <p>Message: {{ stateRefs.message }}</p>
  </div>
</template>

<script setup>
import { toRefs } from 'vue';
import { state } from './state';

const stateRefs = toRefs(state);
</script>
```

在上述模板中，我们可以直接使用 `stateRefs.count` 和 `stateRefs.message`，它们会保持响应式，并且与 `state.count` 和 `state.message` 相关联。这样，当 `state.count` 或 `state.message` 发生变化时，模板中相应的内容也会自动更新。

### 计算属性

使用 `computed` 来创建计算属性，根据响应式数据的变化自动更新计算结果。

```vue
<template>
  <div>
    <p>{{ count }}</p>
    <p>平方：{{ squaredCount }}</p>
    <button @click="increment">增加</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const count = ref(0);
const increment = () => {
  count.value++;
};

const squaredCount = computed(() => count.value ** 2);
</script>
```

### 监视属性

使用 `watch` 函数来监视响应式数据的变化。`watch` 函数接收两个参数：要监视的数据和回调函数。当被监视的数据发生变化时，回调函数将被触发。

```vue
<template>
  <div>
    <p>{{ count }}</p>
    <button @click="increment">增加</button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const count = ref(0);
const increment = () => {
  count.value++;
};

watch(count, (newValue, oldValue) => {
  console.log(`count 变为 ${newValue}，之前是 ${oldValue}`);
});
</script>
```

在上面的例子中，我们使用 `watch` 监视了 `count` 这个响应式数据的变化。每当 `count` 的值发生变化时，回调函数会被触发，并输出变化前后的值。



## 组合式 API 进阶

### 生命周期钩子

在 Vue 3 组合式 API 中，我们可以使用 `onXXX` 函数来模拟传统的生命周期钩子。例如，`onMounted` 用于在组件挂载后执行逻辑，`onUnmounted` 用于在组件卸载时执行逻辑。

```vue
<template>
  <div>
    <p>{{ message }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const message = ref('Hello, Vue 3 组合式 API!');

onMounted(() => {
  console.log('组件挂载成功！');
});

onUnmounted(() => {
  console.log('组件即将卸载！');
});
</script>
```

### 自定义函数

我们可以将多个相关的逻辑封装成自定义函数，并在组件中复用它们。

```vue
<template>
  <div>
    <p>{{ count }}</p>
    <button @click="increment">增加</button>
    <button @click="reset">重置</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const count = ref(0);

const increment = () => {
  count.value++;
};

const reset = () => {
  count.value = 0;
};
</script>
```

## 依赖注入

组合式 API 还支持依赖注入，我们可以使用 `provide` 和 `inject` 在组件树中传递数据。

```vue
<template>
  <div>
    <child-component />
  </div>
</template>

<script setup>
import { provide, ref } from 'vue';

const message = ref('Hello, Vue 3 组合式 API!');

provide('message', message);
</script>
```

在子组件中可以通过 `inject` 来接收数据：

```vue
<template>
  <div>
    <p>{{ injectedMessage }}</p>
  </div>
</template>

<script setup>
import { inject } from 'vue';

const injectedMessage = inject<string>('message');
</script>
```

## 结语

Vue 3 组合式 API 是 Vue.js 引入的一个强大特性，它提供了更灵活、易于维护的代码组织方式。通过 `<script setup>` 语法，我们可以编写更加简洁、易读的代码，并享受更好的类型推导和智能提示。
