import { Structures } from 'discord.js';

export class ManageInviteGuild extends Structures.get('Guild') {
    fetchData() {
        return this.client.handlers.database.fetchGuild(this.id);
    }

    async fetchPermissions(userID: string, ignoreStaff = false) {
        return this.client.handlers.permissions.fetch(this, userID, ignoreStaff);
    }

    translate(key: string, args?: Record<string, unknown>) {
        const language = this.client.translate.get(this.data?.settings.language ?? 'en-US');

        if (!language) throw new Error('Guild: Invalid language set in settings.');

        return language(key, args);
    }
}

Structures.extend('Guild', () => ManageInviteGuild);
