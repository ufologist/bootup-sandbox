import BootupSandbox from '../src/bootup-sandbox.js';

describe('constructor', function() {
    test('默认在 body 上创建沙箱', function() {
        var sandbox = new BootupSandbox();

        var iframe = document.body.querySelector('.js-bootup-sandbox');
        expect(iframe).not.toBe(null);
        expect(sandbox.element).toBe(iframe);
        expect(sandbox.window).toBe(iframe.contentWindow);
        expect(sandbox.document).toBe(iframe.contentDocument);
    });

    test('在选定的容器上创建沙箱', function() {
        var div = document.createElement('div');
        document.body.appendChild(div);

        new BootupSandbox({
            container: div
        });
        expect(div.querySelector('.js-bootup-sandbox')).not.toBe(null);
    });
});

describe('setStyle', function() {
    test('默认样式', function() {
        var sandbox = new BootupSandbox();
        expect(sandbox.element.style.border).toBe('');
    });

    test('设置样式', function() {
        var sandbox = new BootupSandbox();
        sandbox.setStyle({
            border: '1px solid #000'
        });

        expect(sandbox.element.style.border).toBe('1px solid #000');
    });
});

describe('injectScript', function() {
    test('注入代码', function(done) {
        var sandbox = new BootupSandbox();
        sandbox.injectScript('window.foo = "bar"', function() {
            expect(sandbox.window.foo).toBe('bar');
            done();
        });
    });

    test('默认注入 IIFE 代码', function(done) {
        var sandbox = new BootupSandbox();
        sandbox.injectScript('var foo = "bar"', function() {
            expect(sandbox.window.foo).toBeUndefined();
            done();
        });
    });

    test('关闭 IIFE 选项', function(done) {
        var sandbox = new BootupSandbox();
        sandbox.injectScript('var foo = "bar"', {
            iife: false,
            onload: function() {
                expect(sandbox.window.foo).toBe('bar');
                done();
            }
        });
    });

    test('注入文件', function(done) {
        var sandbox = new BootupSandbox();
        sandbox.injectScript('https://unpkg.com/jquery@3.3.1/dist/jquery.min.js', {
            contentIsSrc: true,
            onload: function() {
                expect(sandbox.window.$.fn.jquery).toBe('3.3.1');
                done();
            }
        });
    });

    test('默认不删除注入的元素', function(done) {
        var sandbox = new BootupSandbox();
        sandbox.injectScript('var foo = "bar"', function() {
            expect(sandbox.document.body.querySelector('.js-bootup-sandbox-script')).not.toBe(null);
            done();
        });
    });

    test('删除注入的元素', function(done) {
        var sandbox = new BootupSandbox();
        sandbox.injectScript('var foo = "bar"', {
            remove: true,
            onload: function() {
                expect(sandbox.document.body.querySelector('.js-bootup-sandbox-script')).toBe(null);
                done();
            }
        });
    });
});

describe('ready', function() {
    test('初始环境', function() {
        var sandbox = new BootupSandbox();
        expect(sandbox._isEnvReady).toBe(false);
    });

    test('触发容器环境准备好了', function(done) {
        var sandbox = new BootupSandbox();
        sandbox.ready(function() {
            expect(this).toBe(sandbox);
            expect(sandbox._isEnvReady).toBe(true);
        }).ready(function() {
            expect(sandbox.window.foo).toBe('bar');
        }).injectScript(`
            window.foo = 'bar';
            parent.postMessage({
                event: '${BootupSandbox.ENV_READY_EVENT_NAME}',
                data: ''
            }, '*');
        `, function() {
            expect(sandbox._isEnvReady).toBe(true);
            sandbox.ready(function() {
                done();
            });
        });
    });
});

describe('addEventListener', function() {
    test('监听事件', function() {
        var sandbox = new BootupSandbox();
        var handler1 = function() {};
        var handler2 = function() {};
        sandbox.addEventListener('test', handler1);
        sandbox.addEventListener('test', handler2);

        expect(sandbox._events.test[0].originalHandler).toBe(handler1);
        expect(sandbox._events.test[1].originalHandler).toBe(handler2);
    });

    test('触发事件', function(done) {
        var sandbox = new BootupSandbox();
        sandbox.addEventListener('test', function(event, data) {
            expect(sandbox.window.foo).toBe('bar');
            expect(data).toBe('foobar');
            done();
        });

        sandbox.injectScript(`
            window.foo = 'bar';

            parent.postMessage({
                event: 'test',
                data: 'foobar'
            }, '*');
        `);
    });
});

describe('removeEventListener', function() {
    test('删除指定事件的事件监听', function() {
        var sandbox = new BootupSandbox();
        var handler1 = function() {};
        var handler2 = function() {};
        sandbox.addEventListener('test', handler1);
        sandbox.addEventListener('test', handler2);

        sandbox.removeEventListener('test', handler1);
        expect(sandbox._events.test[0].originalHandler).toBe(handler2);
    });

    test('删除指定事件的所有监听', function() {
        var sandbox = new BootupSandbox();
        var handler1 = function() {};
        var handler2 = function() {};
        sandbox.addEventListener('test', handler1);
        sandbox.addEventListener('test', handler2);

        sandbox.removeEventListener('test');
        expect(sandbox._events.test).toBeUndefined();
    });
});