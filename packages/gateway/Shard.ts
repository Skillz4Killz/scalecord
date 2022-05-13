import GatewayManager from ".";
import WebSocket from "ws";

export class Shard extends WebSocket {
  /** The gateway manager instance. */
  manager: GatewayManager;
  /** The options used to configure the shard. */
  options: ShardOptions;

  constructor(manager: GatewayManager, options: ShardOptions) {
    super(manager.baseURL);

    this.manager = manager;
    this.options = options;

    this.onopen = (e) => console.log("opened", this.id, e);
    // this.onclose = (e) => console.log("closed", this.id, e);
    // this.onmessage = (e) => console.log("message", this.id, e);
    // this.onerror = (e) => console.log("errored", this.id, e);
  }

  /** The shard id */
  get id(): number {
    return this.options.id;
  }

  /** Start the connection for this shard. */
  async identify() {
    // TODO: everything
  }
}

export default Shard;

export interface ShardOptions {
  /** The shard id. */
  id: number;
}
