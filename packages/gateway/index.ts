import Shard from "./Shard";

export class GatewayManager extends Map<number, Shard> {
  /** The options that were used to initialize the GatewayManager */
  options: GatewayManagerOptions;

  constructor(options: GatewayManagerOptions) {
    super();

    this.options = options;
  }

  /** The bot token */
  get token(): string {
    return this.options.token;
  }

  /** The bot token with the Bot prefix to use */
  get botToken(): string {
    return `Bot ${this.token}`;
  }

  /** The base url for the gateway proxy */
  get baseURL(): string {
    return this.options.baseURL;
  }

  /** The shard id to start connecting from. Defaults to 0. */
  get firstShardId(): number {
    return this.options.firstShardId ?? 0;
  }

  /** The shard id to stop connection at. Defaults to highest shard id. */
  get lastShardId(): number {
    return this.options.lastShardId ?? 0;
  }

  /** The total amount of shards your bot will be using. Defaults to whatever discord recommends. */
  get totalShards(): number {
    return this.options.totalShards ?? 1;
  }

  /** The rest proxy url if one was provided to make requests to. */
  get restProxyURL(): string | undefined {
    return this.options.restProxyURL;
  }

  async login() {
    // fetch gateway data
    // const gatewayData = await fetch(this.restProxyURL ?? `https://discord.com/api/v10/gateway/bot`, {
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: this.botToken,
    //   },
    // })
    //   .then((response) => response.json())
    //   .catch(console.error);
    const gatewayData = { shards: 10 }

    // TODO: Set recommended values
    console.log("data", gatewayData);

    // Create all shards
    const shardCount = this.totalShards > 1 ? this.totalShards : gatewayData.shards;
    for (let i = 0; i < shardCount; i++) {
      const shard = new Shard(this, { id: i });
      this.set(i, shard);
      shard.identify();
    }

    // Begin starting them
  }
}

export default GatewayManager;

export interface GatewayManagerOptions {
  /** The bot token */
  token: string;
  /** The base url for the proxy websocket */
  baseURL: string;
  /** The shard id to start connecting from. Defaults to 0. */
  firstShardId?: number;
  /** The shard id to stop connection at. Defaults to highest shard id. */
  lastShardId?: number;
  /** The total amount of shards your bot will be using. Defaults to whatever discord recommends. */
  totalShards?: number;
  /** If you want the login() to use the rest proxy instead of directly calling the discord api. */
  restProxyURL?: string;
}
