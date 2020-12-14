import {
    Message,
    MessageEmbed,
    MessageOptions,
    Structures,
} from 'discord.js';

export class ManageInviteMessage extends Structures.get('Message') {
    menuResponse?: Message = undefined;

    async ask(question: string) {
        this.menuResponse = await this.respond(question);

        const responses = await this.channel.awaitMessages((msg) =>
            msg.author.id === this.author.id, { time: 15000, max: 1 });
        return responses.first();
    }

    respond(content: string, embed?: MessageEmbed) {
        return this.channel.send(`${this.author} | ${content}`, {embed});
    }

    send(content: string | MessageEmbed,
        embed?: MessageEmbed,
        options?: MessageOptions) {
        if (typeof content === 'string') {
            return this.channel.send(content, { ...options, embed });
        }
        return this.channel.send(content);
    }

    embed(embed: MessageEmbed) {
        return this.channel.send('', embed);
    }

    success(content: string, embed?: MessageEmbed) {
        return this.channel.send(`${this.author} | ✔️ | ${content}`, { embed });
    }

    error(content: string, embed?: MessageEmbed, options?: MessageOptions) {
        return this.channel.send(`${this.author} | ❌ | ${content}`, { ...options, embed });
    }

    dm(content: string | MessageEmbed,
        embed?: MessageEmbed,
        options?: MessageOptions) {
        return this.author?.send(content, { ...options, embed });
    }

    translate(key: string, args?: Record<string, unknown>) {
        const language = this.client.translate.get(this.guild ? this.guild?.data.settings.language : 'en-US');

        if (!language) throw new Error('Message: Invalid language set in settings.');

        return language(key, args);
    }
}

Structures.extend('Message', () => ManageInviteMessage);
