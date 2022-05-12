import RestManager, { Snowflake } from ".";

export class Endpoints {
    /** The rest manager these endpoints will be used on */
    manager: RestManager;

    constructor(manager: RestManager) {
        this.manager = manager;
    }

    /** The base url to send the requests to with the api version. */
    get baseURL(): string {
        return `${this.manager.baseURL}/v${this.manager.version}`;
    }

    /** The base endpoint for channel related endpoints. */
    channelsBase(channelId: Snowflake): string {
        return `${this.baseURL}/channels/${channelId}`
    }

    /** The base endpoint for guild related requests */
    guildsBase(guildId: Snowflake): string {
        return `${this.baseURL}/guilds/${guildId}`
    }

    /** The guild channels endpoint */
    guildChannels(guildId: Snowflake): string {
        return `${this.guildsBase(guildId)}/channels`;
    }
}

export default Endpoints;