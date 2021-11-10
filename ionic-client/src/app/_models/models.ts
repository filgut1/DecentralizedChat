export interface User {
    epub: string;
    pub: string;
    alias: string;
    password?: string;
}

export interface UserProfile {
    epub: string;
    pub: string;
    alias: string;
}

export interface Chat {

}

export interface Message {
    uuid: string,
    from: string,
    ts: number,
    message: string
}