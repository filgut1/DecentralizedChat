import { Type } from "@angular/core";

export interface User {
    epub: string;
    pub: string;
    alias: string;
    password?: string;
    profile?: any
}

export interface UserProfile {
    epub: string;
    pub: string;
    alias: string;
}

export type ChatType =
    | 'group'
    | 'direct';

export interface Chat {
    uuid: string,
    name: string,
    ts: number,
    type: ChatType
}

export interface Message {
    uuid: string,
    from: string,
    ts: number,
    message: string,
    senderEnc?: string
}

export enum NodeKeys {
    ChatLinks = 'chatLinks',
    Chats = 'chats',
    Messages = 'messages',
    Profile = 'profile',
    Contacts = 'contacts'
}