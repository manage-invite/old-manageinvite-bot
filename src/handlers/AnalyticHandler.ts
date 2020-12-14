import * as Sentry from '@sentry/node';
import type ManageInvite from '../lib/ManageInvite';
import { AnalyticEvent } from 'manageinvite-db-types';

class AnalyticHandler {
    private readonly client: ManageInvite;
    private readonly events: AnalyticEvent[];

    public constructor(client: ManageInvite) {
        this.client = client;
        this.events = [];
    }

    public getEvents() {
        return this.events;
    }

    public addEvent(event: AnalyticEvent) {
        this.events.push(event);
    }

    public async publish(): Promise<void> {
        const event = this.events.shift();
        if (!event) return;
        await this.client.handlers.database.addAnalytics(event.eventName, event.eventData).catch((err) => Sentry.captureException(err));
    }
}

export default AnalyticHandler;
