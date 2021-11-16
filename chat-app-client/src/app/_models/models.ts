export class User {
    epub: string;
    pub: string;
    alias: string;
    password: string;
}

export interface Message {
    uuid: string,
    from: string,
    ts: number,
    message: string
}