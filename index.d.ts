export class Client {
    constructor(url: string)
    send<T>(type: string, payload: T): void;
    onMessage<T>(cb: (a: {type: string, payload: T}) => void): void;
    onError(cb: (e: Error) => void): void;
    connect(): Promise<void>;
    disconnect(): void;
}
