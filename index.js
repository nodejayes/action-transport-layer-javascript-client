class Client {
    constructor(url) {
        this._connectionTry = 0;
        this._url = url;
        this._socket = null;
        this._listeners = {
            msg: [],
            error: [],
        };
    }

    send(type, payload) {
        this._socket.send(JSON.stringify({type, payload}));
    }

    onMessage(cb) {
        if (typeof cb !== 'function') {
            return;
        }
        this._listeners.msg.push(cb);
    }

    onError(cb) {
        if (typeof cb !== 'function') {
            return;
        }
        this._listeners.error.push(cb);
    }

    connect() {
        if (this._socket) {
            return;
        }
        this._connectionTry++;
        return new Promise((resolve, reject) => {
            this._socket = new WebSocket(this._url);
            this._socket.onopen = () => {
                this._connectionTry = 1;
                resolve();
            };
            this._socket.onmessage = (m) => {
                if (!this._listeners.msg || this._listeners.msg.length < 1) {
                    return;
                }
                const a = JSON.parse(m);
                if (!a || typeof a.type !== typeof '') {
                    console.warn(`message is no action ${m}`);
                    return;
                }
                for (const handler of this._listeners.msg) {
                    handler(a);
                }
            };
            this._socket.onerror = (err) => {
                if (!this._listeners.error || this._listeners.error.length < 1) {
                    console.error(err);
                    return;
                }
                for (const handler of this._listeners.error) {
                    handler(err);
                }
            };
            this._socket.onclose = () => {
                setTimeout(() => {
                    this.connect().then();
                }, 5000);
            };
        });
    }

    disconnect() {
        if (!this._socket) {
            return;
        }
        this._socket.close();
        this._socket = null;
    }
}

module.exports = {Client};
