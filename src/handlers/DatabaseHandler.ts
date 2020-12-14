import type { GuildData, AnalyticEventData, DBManagerResponse } from 'manageinvite-db-types';
import type { Client } from 'discord.js';

export default class DatabaseHandler {

    public client: Client;
    public socketClient: SocketIOClient.Socket;

    constructor (client: Client) {
        this.client = client;
        this.socketClient = require('socket.io-client')(process.env.SOCKET_SERVER_URL!);
    }

    async init () {
        this.socketClient.emit('message', {
            op: 0,
            data: {
                name: `Shard #${this.client.shard?.ids[0]}`
            }
        })
    }

    async fetchGuild (guildID: string) {
        return new Promise((resolve) => {
            this.fetchGuilds([ guildID ]).then((guildsData) => {
                resolve(guildsData[0]);
            })
        })
    }

    async fetchGuilds (guilds: string[]): Promise<GuildData[]> {
        return new Promise((resolve) => {
            this.socketClient.emit('message', {
                op: 2,
                data: {
                    guilds
                }
            }, (response: GuildData[]) => {
                resolve(response);
            })
        })
    }

    async fetchMembers (members: { guildID: string, userID: string }[]) {
        return new Promise((resolve) => {
            this.socketClient.emit('message', {
                op: 1,
                data: {
                    members
                }
            //}, (response: MemberData) => {
            }, (response: any) => {
                resolve(response);
            })
        })
    }

    async addAnalytics (eventName: string, eventData: AnalyticEventData): Promise<void> {
        return new Promise((resolve, reject) => {
            this.socketClient.emit('message', {
                op: 5,
                data: {
                    eventName,
                    eventData
                }
            }, (response: DBManagerResponse) => {
                if (!response.success) reject(response.errorMessage);
                else resolve();
            })
        })
    }

}
