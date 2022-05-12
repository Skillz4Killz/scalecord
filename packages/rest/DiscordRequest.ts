import RestManager from ".";

export class DiscordRequest {
  /** The rest manager instance */
  manager: RestManager;
  /** The headers we will send for this request */
  headers: Record<string, string> = {};
  /** The method being used to send the request */
  method: RequestMethod;
  /** The url to send the request */
  url: string;
  /** The body of the request if one is given */
  body?: Record<string, unknown>;

  constructor(
    manager: RestManager,
    options: DiscordRequestOptions,
    payload?: Record<string, unknown>,
    reason?: string
  ) {
    this.manager = manager;
    this.url = options.url;
    this.method = options.method;

    if (reason) this.setReasonHeader(reason);
    if (payload) this.setBody(payload);
  }

  /** Generate the final form of headers to send. */
  get generateHeaders() {
    return {
      ...this.headers,
      "User-Agent":
        "DiscordBot (https://github.com/Skillz4Killz/scalecord, 0.0.1)",
      Authorization: `Bot ${this.manager.token}`,
    };
  }

  /** Set the header for the reason, useful for audit logs. */
  setReasonHeader(reason: string) {
    this.headers["X-Audit-Log-Reason"] = encodeURIComponent(reason);
  }

  /** Set the body for the request. */
  setBody(body: Record<string, unknown>) {
    this.body = body;
    if (body.attachments) {
      // TODO: attachments
    } else {
      this.headers["Content-Type"] = "application/json";
    }
  }

  /** Execute the request. */
  async execute() {
    return await fetch(this.url, {
      method: this.method,
      body: this.body ? JSON.stringify(this.body) : undefined,
      headers: this.generateHeaders,
    })
      .then((response) => {
        // TODO: grafana metrics
        // TODO: headers handling
        return response.json();
      })
      .catch((error) => {
        // TODO: grafana metrics
        // TODO: error handling
        console.error(error);
      });
  }
}

export default DiscordRequest;

export interface DiscordRequestOptions {
  /** The url to send the request to. */
  url: string;
  /** The method to use for this request. */
  method: RequestMethod;
}

export type RequestMethod = "GET" | "POST" | "DELETE" | "PUT";
