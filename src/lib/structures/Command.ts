import { Message } from 'discord.js';
import ManageInviteClient from '../ManageInvite';
import {
    CommandOptions,
    ManageInviteGuildMessage,
    PermissionLevel
} from '../types/manageinvite';
import { PERMISSION_LEVEL, ACCESS_LEVEL } from '../utils/constants';

export default class Command {
    client: ManageInviteClient;
    name: string;
    path: string;
    aliases: string[];
    dm: boolean;
    permission: -1 | 0 | 2 | 3 | 4 | 9 | 10;
    access: 0 | 1 | 3;
    cooldown: number;

    constructor(client: ManageInviteClient, name: string, path: string, options?: CommandOptions) {
        this.client = client;
        this.name = name;
        this.path = path;
        this.aliases = (options?.aliases) ?? [];
        this.dm = (options?.dm) ?? false;
        this.permission =
            (options?.permission) ??
            PERMISSION_LEVEL.SERVER_MEMBER;
        this.access =
            (options?.access) ?? ACCESS_LEVEL.DEFAULT;
        this.cooldown = (options?.cooldown) ?? 3;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    execute(_message: Message | ManageInviteGuildMessage, _params?: string, _permissions?: PermissionLevel) {
        throw new Error('Unsupported operation.');
    }
}
