import { inspect } from 'util';
import { Message, GuildMember, User } from 'discord.js';
import Event from '../lib/structures/Event';
import { ManageInviteGuildMessage } from '../lib/types/manageinvite';
import { GuildData } from 'manageinvite-db-types';
import { PERMISSION_LEVEL } from '../lib/utils/constants';
import { fetchAccess, permissionError } from '../lib/utils/util';

export default class extends Event {
    async execute(message: Message | ManageInviteGuildMessage) {
        if (message.partial || (message.author?.bot)) return;

        if (message.channel.type === 'dm')
            return this.handleDM(message as Message);

        return this.handleGuild(message as ManageInviteGuildMessage);
    }

    async handleGuild(message: ManageInviteGuildMessage) {
        if (!message.guild.available) return;
        if (!message.guild.me)
            await message.guild.members.fetch(this.client.user?.id!);

        const botMember = message.guild.me as GuildMember;
        const botSendPerms = message.channel.permissionsFor(botMember);
        if (!botSendPerms || !botSendPerms.has('SEND_MESSAGES')) return;

        const data = (message.guild.data = await message.guild.fetchData());

        const possibleBotMentions = [
            `<@${this.client.user?.id}>`,
            `<@!${this.client.user?.id}>`
        ];
        if (possibleBotMentions.includes(message.content)) {
            return message.reply(message.translate('misc:PREFIX', {
                prefix: data.settings
            }));
        }

        const userPermissions = await this.client.handlers.permissions.fetch(message.guild, message.author.id);
        // eslint-disable-next-line max-len
        const actualUserPermissions = await this.client.handlers.permissions.fetch(message.guild, message.author.id, true);

        if (
            userPermissions.level ===
            PERMISSION_LEVEL.SERVER_BLACKLISTED
        )
            return;

        const [split, ...params] = message.content.split(' ');

        const prefix = data.settings.prefix;
        if (!prefix || !message.content.startsWith(prefix)) return;

        const command = this.client.commands.fetch(split.slice(prefix.length).toLowerCase(), data.commands);
        if (!command) return;
        if (!message.member)
            await message.guild.members.fetch(message.author.id);

        const accessLevel = await fetchAccess(message.guild);
        if (command.access && accessLevel.level < command.access) {
            return message.error(message.translate('misc:MISSING_ACCESS', {
                command: command.access,
                level: accessLevel.level,
                title: accessLevel.title
            }));
        }

        if (
            !this.client.owners.includes(message.author.id) &&
            message.author.id !== message.guild.ownerID
        )
            return message.error(message.translate('misc:DISABLED'));

        if (
            userPermissions.level < command.permission ||
            (actualUserPermissions.level < command.permission &&
                actualUserPermissions.level !==
                PERMISSION_LEVEL.SERVER_BLACKLISTED &&
                command.permission <= PERMISSION_LEVEL.SERVER_OWNER)
        ) {
            return message.error(permissionError(this.client, message, command, actualUserPermissions));
        }

        this.client.analytics.addEvent({
            userId: message.author.id,
            eventName: 'COMMAND_CREATE',
            eventData: {
                messageId: message.id,
                channelId: message.channel.id,
                guildId: message.guild.id,
                timestamp: message.createdTimestamp,
                command: command.name,
                commandArgs: params
            }
        });

        return command.execute(message, params.join(' '), userPermissions);
    }

    handleDM(message: Message) {
        if (!message.content.startsWith(process.env.PREFIX!)) return;

        const command = this.client.commands.get(message.content
            .split(' ')[0]
            .slice(process.env.PREFIX!.length));

        if (
            !command ||
            !command.dm ||
            command.permission > PERMISSION_LEVEL.SERVER_MEMBER
        )
            return;

        command.execute(message);
    }
}
