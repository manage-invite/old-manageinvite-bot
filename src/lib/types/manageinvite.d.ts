import {
    Guild,
    GuildMember,
    GuildChannel,
    Message,
    MessageEmbed,
    MessageOptions,
    TextChannel,
    User
} from 'discord.js';
import ManageInviteClient from '../ManageInvite';
import ModerationLog from '../structures/ModerationLog';
import PermLevel from '../structures/PermissionLevel';
import { GuildData } from 'manageinvite-db-types';

export interface CommandOptions {
    description?: string;
    usage?: string;
    aliases?: string[];
    dm?: boolean;
    permission?: -1 | 0 | 2 | 3 | 4 | 9 | 10;
    mode?: 0 | 1 | 2;
    access?: 0 | 1 | 3;
    cooldown?: number;
}

export interface PermissionLevelOptions {
    title: string;
    level: -1 | 0 | 2 | 3 | 4 | 9 | 10;
    staff?: boolean;
    staffOverride?: boolean;
}

export interface PermissionLevel {
    title: string;
    level: -1 | 0 | 2 | 3 | 4 | 9 | 10;
    staff?: boolean;
    staffOverride?: boolean;
    check(guild: Guild, member: GuildMember): boolean;
}

export interface AccessLevel {
    level: 0 | 1 | 3;
    title: 'Default' | 'ManageInvite Staff';
}

export interface ManageInviteMessage extends Message {
    menuResponse?: Message;
    ask(question: string): Promise<Message | undefined>;
    dm(
        content: string | MessageEmbed,
        embed?: MessageEmbed,
        options?: MessageOptions
    ): Promise<Message>;
    error(
        content: string | MessageEmbed,
        embed?: MessageEmbed,
        options?: MessageOptions
    ): Promise<Message>;
    send(
        content: string | MessageEmbed,
        embed?: MessageEmbed,
        options?: MessageOptions
    ): Promise<Message>;
    success(
        content: string | MessageEmbed,
        embed?: MessageEmbed,
        options?: MessageOptions
    ): Promise<Message>;
    respond(
        content: string | MessageEmbed,
        embed?: MessageEmbed,
        options?: MessageOptions
    ): Promise<Message>;
    translate(key: string, args?: Record<string, unknown>): string;
}

export interface ManageInviteGuildMessage extends ManageInviteMessage {
    author: User;
    guild: ManageInviteGuild;
    member: ManageInviteGuildMember;
    channel: TextChannel;
}

export interface ManageInviteGuildMember extends GuildMember {
    fetchPermissions(ignoreStaff?: boolean): Promise<PermissionLevel>;
}

export interface ManageInviteGuild extends Guild {
    client: ManageInviteClient;
    data: GuildData;
    translate(key: string, args?: Record<string, unknown>): string;
    fetchPermissions(userID: string, ignoreStaff?: boolean): Promise<PermLevel>;
    fetchData(): Promise<GuildData>;
}

export interface FormatMessageOptions {
    oldMember?: TypicalGuildMember;
    channel?: GuildChannel;
    message?: TypicalGuildMessage;
}
