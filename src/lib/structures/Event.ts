import ManageInviteClient from '../ManageInvite';

export default class Event {
    client: ManageInviteClient;
    name: string;
    once = false;

    constructor(client: ManageInviteClient, name: string) {
        this.client = client;
        this.name = name;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    execute(..._args: unknown[]) {
        throw new Error('Unsupported operation.');
    }
}
