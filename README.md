## vSuperFiles

### 关键词

- Vue 指令
- 多文价夹
- 多文件
- 文件上传
- 拖拽上传

### 介绍

解决多文件夹拖拽，多文件上传问题。

### 安装

```shell
npm install vsuperfiles -S 
```

### 使用

> main.js

```javascript
import Vue from 'vue';
import App from './App.vue';
import vSuperFiles from 'vsuperfiles';

Vue.config.productionTip = false;

Vue.use(vSuperFiles({
    name: 'files' // 如果有必要，自定义指令名
}));

new Vue({
    render: (h) => h(App),
}).$mount('#app');

```

> App.vue

### 参数说明

1. VueUse 时:
    1. name: 自定义指令名字；即使用 v-files 时为 v-[name]

```javascript
Vue.use(vSuperFiles({
    name: 'files' // 如果有必要，自定义指令名
}));
```

```vue

<template>
  <div
      v-files.drag.webkitdirectory.multiple="{
        paths: [],
        files: [],
        accept: [],
    }"
      @files-change="handleFiles"
      @drag-error="error"
  ></div>
</template>
<script>
export default {
  methods: {
    handleFiles() {
    },
    error(e) {
    }
  }
}
</script>
```

2. 使用指令时：
    1. 修饰符
        1. `drag`：是否支持拖拽放入文件夹或文件，支持文件夹和多个文件传入。
        2. `webkitdirectory`: 点击时进入文件夹模式，默认进入文件选择模式。
        3. `multiple`: 开启多选模式，不设置时不可多选。
        4. `accept`: 支持的 `MIME-TYPE`
            1. 详情请见：[MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/accept)。
        5. `customize`: 回调函数，创建 `input` 时如果需要自定义，自行设置。
    2. 绑定值
        1. `paths`: 传入需要绑定的 `paths`，不传入时不绑定。
        2. `files`: 传入需要绑定的 `files`，不传入时不绑定。
        3. `accept`: `input` 的`accept`限定，不传时都允许。
    3. 事件
        1. @files-change: 用户传入文件时
            1. 回调第一个参数为 files，第二个为 paths。
            2. 分别为当前传入的文件和路径。
        2. @drag-error
            1. 拖拽时读取失败时回调。

### 待完成内容

- 类型声明
- 测试覆盖