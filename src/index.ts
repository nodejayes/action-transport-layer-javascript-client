export interface IAction<T> {
    type: string,
    payload: T,
}

export class Client {
    private connectionTry = 0;
    private url = '';
    private socket: WebSocket = null;
    private listeners = {
        msg: [],
        error: [],
    };

    constructor(url: string) {
        this.url = url;
    }

    public send<T>(type: string, payload: T): void {
        this.socket.send(JSON.stringify({type, payload}));
    }

    public onMessage<T>(cb: (a: IAction<T>) => void): void {
        if (typeof cb !== 'function') {
            return;
        }
        this.listeners.msg.push(cb);
    }

    public onError(cb: (err: Error) => void): void {
        if (typeof cb !== 'function') {
            return;
        }
        this.listeners.error.push(cb);
    }

    public async connect(): Promise<void> {
        if (this.socket) {
            return;
        }
        this.connectionTry++;
        return new Promise((resolve, reject) => {
            this.socket = new WebSocket(this.url);
            this.socket.onopen = () => {
                this.connectionTry = 1;
                resolve();
            };
            this.socket.onmessage = (m) => {
                if (!this.listeners.msg || this.listeners.msg.length < 1) {
                    return;
                }
                const a = JSON.parse(m.data);
                if (!a || typeof a.type !== typeof '') {
                    console.warn(`message is no action ${m.data}`);
                    return;
                }
                for (const handler of this.listeners.msg) {
                    handler(a);
                }
            };
            this.socket.onerror = (err) => {
                if (!this.listeners.error || this.listeners.error.length < 1) {
                    console.error(err);
                    return;
                }
                for (const handler of this.listeners.error) {
                    handler(err);
                }
            };
            this.socket.onclose = () => {
                setTimeout(() => {
                    this.connect().then();
                }, 5000);
            };
        });
    }

    public disconnect(): void {
        if (!this.socket) {
            return;
        }
        this.socket.close();
        this.socket = null;
    }
}
