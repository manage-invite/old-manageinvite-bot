import { Structures } from 'discord.js';

export class ManageInviteGuildMember extends Structures.get('GuildMember') {
    async fetchPermissions(ignoreStaff = false) {
        return this.client.handlers.permissions.fetch(this.guild, this.id, ignoreStaff);
    }
}

Structures.extend('GuildMember', () => ManageInviteGuildMember);
