import { Guild, GuildMember } from 'discord.js';
import PermissionLevel from '../lib/structures/PermissionLevel';
import { PERMISSION_LEVEL } from '../lib/utils/constants';

export default class extends PermissionLevel {
    title = 'Server Administrator';
    level = PERMISSION_LEVEL.SERVER_ADMINISTRATOR;

    check(guild: Guild, member: GuildMember) {
        const roleIDs = this.fetchRoles(guild, 'administrator');
        const hasAdminRole = roleIDs.some((id) => member.roles.cache.has(id));
        return hasAdminRole || member.permissions.has('ADMINISTRATOR');
    }
}
