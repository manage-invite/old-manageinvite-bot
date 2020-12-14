import { join, parse } from 'path';
import * as Sentry from '@sentry/node';
import { Collection } from 'discord.js';
import klaw from 'klaw';
import ManageInviteClient from '../lib/ManageInvite';
import type Command from '../lib/structures/Command';
import type { GuildCommand } from 'manageinvite-db-types';

export default class CommandHandler extends Collection<string, Command> {
    client: ManageInviteClient;

    constructor(client: ManageInviteClient) {
        super();

        this.client = client;

        this.init().catch((err) => Sentry.captureException(err));
    }

    async init() {
        const path = join(__dirname, '..', 'commands');
        const start = Date.now();

        klaw(path)
            .on('data', (item) => {
                const file = parse(item.path);
                if (!file.ext || file.ext !== '.js') return;

                const req = ((r) => r.default || r)(require(join(file.dir, file.base)));
                const newReq = new req(this.client, file.name, join(file.dir, file.base));

                this.set(file.name, newReq);
            })
            .on('end', () => {
                this.client.logger.info(`Loaded ${this.size} Commands in ${Date.now() - start}ms`);

                return this;
            });
    }

    fetch(name: string, commands: GuildCommand[]) {
        if (this.has(name)) return this.get(name) as Command;

        const commandAlias = this.find((c) => c.aliases.includes(name));
        if (commandAlias) return commandAlias;

        const alias = commands.find((x) => x.aliases.includes(name))?.cmdName;
        return alias ? (this.get(alias) as Command) : null;
    }
}
