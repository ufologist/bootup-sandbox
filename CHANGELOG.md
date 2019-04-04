# CHANGELOG

* v0.0.3 2019-4-4

  * 构造函数增加了 `options.beforeMount` 选项, 在沙箱挂载到 DOM 节点之前执行这个 hook

* v0.0.2 2019-3-25

  * 调整 `addEventListener` 入参 `handler` 方法的参数
    * `handler(data.data, data, event)` -> `handler(event, data.data)`

* v0.0.1 2019-3-23

  * 初始版本