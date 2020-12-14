import Command from '../../lib/structures/Command';
import type { ManageInviteMessage } from '../../lib/types/manageinvite';

export default class extends Command {
    dm = true;

    async execute(message: ManageInviteMessage) {
        const ping = await message.send(message.translate('general/ping:CALCULATING'));

        return ping.edit(message.translate('general/ping:RESPONSE', {
            command: ping.createdTimestamp - message.createdTimestamp,
            api: Math.floor(this.client.ws.ping)
        }));
    }
}
