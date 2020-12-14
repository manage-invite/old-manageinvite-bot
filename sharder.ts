import { ShardingManager } from 'discord.js';
import * as dotenv from 'dotenv';
dotenv.config();

const manager = new ShardingManager("./dist/src/index.js", {
    token: process.env.DISCORD_TOKEN,
    totalShards: parseInt(process.env.SHARD_COUNT!),
    shardArgs: [ ...process.argv, ...[ "--sharded" ] ]
});

console.log("Hello, "+require("os").userInfo().username+". Thanks for using ManageInvite.");
manager.spawn();
