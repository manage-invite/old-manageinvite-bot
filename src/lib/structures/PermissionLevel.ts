import type { Guild, GuildMember, Snowflake } from 'discord.js';
import type ManageInviteClient from '../ManageInvite';
import type { PermissionLevelOptions } from '../types/manageinvite';
import { PERMISSION_ROLE_TITLE } from '../utils/constants';

export default class PermissionLevel {
    title: string;
    level: -1 | 0 | 2 | 3 | 4 | 9 | 10;
    staff = false;
    staffOverride = false;
    client: ManageInviteClient;

    constructor(client: ManageInviteClient, options: PermissionLevelOptions) {
        this.client = client;
        this.title = options.title;
        this.level = options.level;

        if (options.staff) this.staff = options.staff;
        if (options.staffOverride) this.staffOverride = options.staffOverride;
    }

    fetchRoles(guild: Guild,
        permission: 'blacklist' | 'moderator' | 'administrator') {
        const pool: Snowflake[] = []

        let roleName: string;
        switch (permission) {
            case 'administrator':
                roleName = PERMISSION_ROLE_TITLE.ADMINISTRATOR.toLowerCase();
                break;
            case 'moderator':
                roleName = PERMISSION_ROLE_TITLE.MODERATOR.toLowerCase();
                break;
            case 'blacklist':
                roleName = PERMISSION_ROLE_TITLE.BLACKLIST.toLowerCase();
                break;
        }

        const permRole = guild.roles.cache.find((role) => role.name.toLowerCase() === roleName);
        if (permRole) pool.push(permRole.id);

        return pool;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    check(_guild: Guild, _member: GuildMember, ...args: any[]): boolean {
        throw new Error('Unsupported operation.');
    }
}
