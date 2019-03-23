/**
 * 沙箱
 * 
 * 流程
 * - 创建沙箱 -> 启动电脑
 * - 准备沙箱环境 -> 安装操作系统
 * - 执行代码 -> 在沙箱里面执行代码?
 * 
 * TODO 说明文档, 兼容 IE9+
 * TODO 补充测试用例
 * TODO 考虑默认值
 */
class BootupSandbox {
    /**
     * @param {object} options 
     * @param {Element} [options.container=window.document.body] options.container 放沙箱的容器
     */
    constructor(options = {}) {
        this.options = options;
        this.options.container = this.options.container || window.document.body;

        // 以 iframe 元素作为沙箱
        this.element = null;
        // 沙箱里面的 window
        this.window = null;
        // 沙箱里面的 document
        this.document = null;

        // 沙箱里监听的事件
        this._events = {};
        // 容器环境是否准备好了
        this._isEnvReady = false;

        this._init();
    }

    /**
     * 初始化
     */
    _init() {
        this.element = document.createElement('iframe');
        this.element.className = 'js-bootup-sandbox';
        this.setStyle({
            border: 'none'
        });
        this.options.container.appendChild(this.element);

        this.window = this.element.contentWindow;
        this.document = this.element.contentDocument;

        // 为了兼容 IE9, 需要预先写下基础的页面内容
        // 因为 IE9 下测试 this._iframe.contentDocument.body 为 null
        // https://stackoverflow.com/questions/16504816/how-to-set-html-content-into-an-iframe
        this.document.open();
        this.document.write('<html><head></head><body></body></html>');
        this.document.close();

        this.addEventListener(BootupSandbox.ENV_READY_EVENT_NAME, function() {
            this._isEnvReady = true;
        });
    }

    /**
     * 设置沙箱元素的样式
     * 
     * @param {object} style 
     * @return {BootupSandbox} this
     */
    setStyle(style) {
        for (var propertyName in style) {
            if (style.hasOwnProperty(propertyName)) {
                this.element.style[propertyName] = style[propertyName];
            }
        }
        return this;
    }

    /**
     * 在沙箱的 body 中注入脚本
     * 
     * @param {string}          content 脚本的内容(可以是直接的代码或者路径)
     * @param {object|Function} [options] options 当传入 Function 类型时, 默认指向 onload
     * @param {Function}        [options.onload=function() {}] options.onload
     * @param {Function}        [options.onerror=function() {}] options.onerror
     * @param {boolean}         [options.contentIsSrc=false] options.contentIsSrc `content` 参数是否代表为外部引用的 src 路径
     * @param {boolean}         [options.remove=false] options.remove 注入之后是否删除
     * @param {boolean}         [options.iife=true] options.iife 是否包装一个 IIFE 来隔离作用域(只针对直接的代码, 对外部引用的 JS 不起作用)
     * 
     * @return {BootupSandbox} this
     */
    injectScript(content, options) {
        if (!content) {
            return this;
        }

        var script = this.document.createElement('script');
        script.className = 'js-bootup-sandbox-script';

        // Function 类型默认指向 onload
        var _options = {};
        if (typeof options === 'function') {
            _options.onload = options;
        } else if (options) {
            _options = options;
        }

        // 设置默认值
        typeof _options.onload === 'undefined' && (_options.onload = function() {});
        typeof _options.onerror === 'undefined' && (_options.onerror = function() {});
        typeof _options.contentIsSrc === 'undefined' && (_options.contentIsSrc = false);
        typeof _options.remove === 'undefined' && (_options.remove = false);
        typeof _options.iife === 'undefined' && (_options.iife = true);

        // 包装一下 onload, 添加通用逻辑
        var optionsOnload = _options.onload;
        _options.onload = function() {
            // 虽然 script 节点只要添加到 DOM 中就会执行
            // 但针对指向 src 的 script 节点
            // 如果添加后立马删除这个节点, 会造成 script 节点的 onload 事件不一定被触发
            _options.remove && script.parentNode.removeChild(script);
            optionsOnload();
        };
        // 包装一下 onerror, 添加通用逻辑
        var optionsOnError = _options.onerror;
        _options.onerror = function() {
            console.error('injectScript fail', content);
            optionsOnError();
        };

        if (_options.contentIsSrc) {
            // IE8 不支持 `onload` 和 `Object.defineProperty` 因此选择不兼容 IE8 了
            // In Internet Explorer 8 `Object.defineProperty` only accepts DOM objects
            // https://kangax.github.io/compat-table/es5/
            // https://github.com/ded/script.js
            script.onload = _options.onload;
            script.onerror = _options.onerror;
            script.src = content;

            this.document.body.appendChild(script);
        } else {
            if (_options.iife) {
                script.text = '(function() {' + content + '})()';
            } else {
                script.text = content;
            }

            this.document.body.appendChild(script);
            setTimeout(_options.onload);
        }

        return this;
    }

    /**
     * 当容器环境准备好后需要触发的回调
     * 
     * 需要在 iframe 里面通过 postMessage 来触发这个事件
     * 
     * ```javascript
     * parent.postMessage({
     *     event: 'ENV_READY',
     *     data: ''
     * }, '*');
     * ```
     * 
     * @param {Function} callback 
     * @return {BootupSandbox} this
     */
    ready(callback) {
        if (this._isEnvReady) {
            setTimeout(callback.bind(this));
        } else {
            this.addEventListener(BootupSandbox.ENV_READY_EVENT_NAME, callback);
        }

        return this;
    }

    /**
     * 监听沙箱里的事件, 通过 postMessge 实现
     * 
     * 例如在沙箱中执行如下代码抛出事件
     * ```javascript
     * parent.postMessage({
     *     event: 'eventname',
     *     data: ''
     * }, '*');
     * ```
     * 
     * @param {string} event
     * @param {Function} handler
     * @return {BootupSandbox} this
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
     */
    addEventListener(event, handler) {
        var eventHandlers = this._events[event];
        if (!eventHandlers) {
            eventHandlers = this._events[event] = [];
        }

        var messageEventHandler = (e) => {
            var data = e.data;
            if (data) {
                var eventName = data.event;

                if (event === eventName) {
                    handler.call(this, data.data, data, e);
                }
            }
        };
        eventHandlers.push({
            originalHandler: handler,
            handler: messageEventHandler
        });

        window.addEventListener('message', messageEventHandler);

        return this;
    }

    /**
     * 移除沙箱里的事件监听
     * 
     * @param {string} event
     * @param {Function} [handler] handler
     * @return {BootupSandbox} this
     */
    removeEventListener(event, handler) {
        var eventHandlers = this._events[event];
        if (eventHandlers && eventHandlers.length > 0) {
            if (handler) {
                var found = eventHandlers.filter(function(eventHandler) {
                    return eventHandler.originalHandler === handler;
                })[0];

                if (found) {
                    eventHandlers.splice(eventHandlers.indexOf(found), 1)
                    window.removeEventListener('message', found.handler);
                }
            } else {
                eventHandlers.forEach(function(eventHandler) {
                    window.removeEventListener('message', eventHandler.handler);
                });
                delete this._events[event];
            }
        }

        return this;
    }
}

BootupSandbox.ENV_READY_EVENT_NAME = 'ENV_READY';

export default BootupSandbox;