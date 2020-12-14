import { GuildData } from 'manageinvite-db-types';
import { TFunction } from "i18next";
import ManageInviteClient from "../ManageInvite";

declare module 'discord.js' {

    interface Client {
        translate: Map<string, TFunction>;
    }

    interface Guild {
        client: ManageInviteClient;
        data: GuildData;
    }

    interface GuildMember {
        client: ManageInviteClient;
    }

}
