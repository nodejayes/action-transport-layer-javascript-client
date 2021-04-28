const Client = function (url) {
    const inst = {};
    inst._connectionTry = 0;
    inst._url = url;
    inst._socket = null;
    inst._listeners = {
        msg: [],
        error: [],
    };

    inst.send = function (type, payload) {
        inst._socket.send(JSON.stringify({type, payload}));
    };

    inst.onMessage = function (cb) {
        if (typeof cb !== 'function') {
            return;
        }
        inst._listeners.msg.push(cb);
    };

    inst.onError = function (cb) {
        if (typeof cb !== 'function') {
            return;
        }
        inst._listeners.error.push(cb);
    };

    inst.connect = function () {
        if (inst._socket) {
            return;
        }
        inst._connectionTry++;
        return new Promise((resolve, reject) => {
            inst._socket = new WebSocket(inst._url);
            inst._socket.onopen = () => {
                inst._connectionTry = 1;
                resolve();
            };
            inst._socket.onmessage = (m) => {
                if (!inst._listeners.msg || inst._listeners.msg.length < 1) {
                    return;
                }
                const a = JSON.parse(m.data);
                if (!a || typeof a.type !== typeof '') {
                    console.warn(`message is no action ${m.data}`);
                    return;
                }
                for (const handler of inst._listeners.msg) {
                    handler(a);
                }
            };
            inst._socket.onerror = (err) => {
                if (!inst._listeners.error || inst._listeners.error.length < 1) {
                    console.error(err);
                    return;
                }
                for (const handler of inst._listeners.error) {
                    handler(err);
                }
            };
            inst._socket.onclose = () => {
                setTimeout(() => {
                    inst.connect().then();
                }, 5000);
            };
        });
    };

    inst.disconnect = function () {
        if (!inst._socket) {
            return;
        }
        inst._socket.close();
        inst._socket = null;
    };

    return inst;
}

if (window) {
    window.atlJs = {
        Client: Client,
    };
} else {
    module.exports = atlJs;
}
