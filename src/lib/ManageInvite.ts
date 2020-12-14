/* eslint-disable @typescript-eslint/naming-convention */
import './extensions/ManageInviteGuild';
import './extensions/ManageInviteGuildMember';
import './extensions/ManageInviteMessage';

import * as Sentry from '@sentry/node';
import { Client, Collection, Invite } from 'discord.js';
import { TFunction } from 'i18next';
import fetch from 'node-fetch';
import Logger from './utils/Logger';
import i18n from './utils/i18n';
import pkg from '../../package.json';
import AnalyticHandler from '../handlers/AnalyticHandler';
import CommandHandler from '../handlers/CommandHandler';
import DatabaseHandler from '../handlers/DatabaseHandler';
import EventHandler from '../handlers/EventHandler';
import PermissionsHandler from '../handlers/PermissionsHandler';

interface ManageInviteHandlers {
    database: DatabaseHandler;
    permissions: PermissionsHandler;
}

export default class ManageInviteClient extends Client {
    public shardCount = process.env.SHARD_COUNT!;
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    public handlers = {} as ManageInviteHandlers;
    public commands = new CommandHandler(this);
    public events = new EventHandler(this);
    public analytics = new AnalyticHandler(this);
    public caches = {
        invites: new Collection <string, Collection<string, Invite>> ()
    };

    public translate: Map<string, TFunction> = new Map();
    public logger = new Logger();
    public version = pkg.version;
    public owners: string[] = [];

    public constructor() {
        super({
            presence: { activity: { name: process.env.ACTIVITY, type: 'PLAYING' } }
            // TODO: specify intents
        });

        Sentry.init({
            dsn: process.env.API_SENTRY,
            release: this.version
        });

        this.login(process.env.DISCORD_TOKEN!).catch((err) => Sentry.captureException(err));
    }

    public async login(token: string): Promise<string> {
        this.handlers.database = new DatabaseHandler(this);
        await this.handlers.database.init();

        this.handlers.permissions = new PermissionsHandler(this);

        // Setup translation i18n before login to client
        this.translate = await i18n();
        this.logger.info('Loaded i18n Languages');

        return super.login(token);
    }

    public fetchData(property: string): any {
        return new Promise((resolve) => {
            return this.shard?.fetchClientValues(property).then((values) => {
                resolve(values.reduce((p, c) => p + c));
            })
        })
    }

    public async sendStatistics(shardID: number): Promise<void> {
        fetch('https://www.carbonitex.net/discord/data/botdata.php', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                shardid: shardID,
                shardcount: this.shardCount.toString(),
                servercount: this.guilds.cache
                    .filter((g) => g.shardID === shardID)
                    .size.toString(),
                key: process.env.API_CARBON
            })
        }).catch((err) => {
            Sentry.captureException(err);
        });

        fetch(`https://top.gg/api/bots/${process.env.ID}/stats`, {
            method: 'post',
            headers: {
                Authorization: process.env.API_TOPGG!,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                shard_id: shardID,
                shard_count: this.shardCount.toString(),
                server_count: this.guilds.cache
                    .filter((g) => g.shardID === shardID)
                    .size.toString()
            })
        }).catch((err) => {
            Sentry.captureException(err);
        });

        const guildCount = await this.fetchData('guilds.cache.size');

        fetch(`https://api.discordextremelist.xyz/v2/bot/${process.env.ID}/stats`, {
            method: 'post',
            headers: {
                Authorization: process.env.API_DEL!,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                guildCount: guildCount,
                shardCount: this.shardCount
            })
        }).catch((err) => {
            Sentry.captureException(err);
        });

        fetch(`https://api.botlist.space/v1/bots/${process.env.ID}`, {
            method: 'post',
            headers: {
                Authorization: process.env.API_BLS!,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                server_count: guildCount
            })
        }).catch((err) => {
            Sentry.captureException(err);
        });
    }
}
