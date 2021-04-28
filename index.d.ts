export class Client {
    constructor(url: string)
    send(type, payload): void;
    onMessage(cb): void;
    onError(cb): void;
    connect(): Promise<void>;
    disconnect(): void;
}
