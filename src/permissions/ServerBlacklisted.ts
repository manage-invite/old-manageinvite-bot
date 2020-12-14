import { Guild, GuildMember } from 'discord.js';
import PermissionLevel from '../lib/structures/PermissionLevel';
import { PERMISSION_LEVEL } from '../lib/utils/constants';
import type { GuildBlacklistedUser } from 'manageinvite-db-types';

export default class extends PermissionLevel {
    title = 'Server Blacklisted';
    level = PERMISSION_LEVEL.SERVER_BLACKLISTED;

    check(guild: Guild, member: GuildMember, guildSettings: GuildBlacklistedUser[]) {
        const roleIDs = this.fetchRoles(guild, 'blacklist');
        const hasBlacklistRole = roleIDs.some((id) => member.roles.cache.has(id));
        return hasBlacklistRole || guildSettings.some((u) => u.userID === member.id);
    }
}
