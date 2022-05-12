import DiscordRequest from "./DiscordRequest";
import Endpoints from "./Endpoints";

export class RestManager {
  /** The options used to create the manager. */
  options: RestManagerOptions;
  /** The endpoints for the api to send requests to. */
  endpoints: Endpoints;

  constructor(options: RestManagerOptions) {
    this.options = options;
    this.endpoints = new Endpoints(this);
  }

  /** The base url for the api */
  get baseURL(): string {
    return this.options.baseURL || "https://discord.com/api";
  }

  /** The api version to use to make requests. */
  get version(): number {
    return this.options.version || 10;
  }

  /** The bot token to use */
  get token(): string {
    return this.options.token;
  }

  /** Whether or not to enable debug mode. */
  get debugEnabled() {
    return this.options.debug ?? false;
  }

  /** Logs stuff to console when debug mode is enabled. */
  debug(text: string) {
    if (this.debugEnabled) console.log(text);
  }

  /** Create a channel */
  async createChannel(
    guildId: Snowflake,
    options: CreateChannelOptions,
    reason?: string
  ) {
    const { parentId, permissionOverwrites, ...rest } = options;
    return await this.post(
      this.endpoints.guildChannels(guildId),
      {
        ...rest,
        parent_id: options.parentId,
        permission_overwrites: options.permissionOverwrites,
      },
      reason
    );
  }

  /** Delete a channel */
  async deleteChannel(channelId: Snowflake, reason?: string) {
    return await this.delete(this.endpoints.channelsBase(channelId), reason);
  }

  /** Send a POST request to the api. */
  async post(url: string, options: Record<string, unknown>, reason?: string) {
    const request = new DiscordRequest(
      this,
      { url, method: "POST" },
      options,
      reason
    );

    return await request.execute();
  }

  /** Send a DELETE request to the api */
  async delete(url: string, reason?: string) {
    const request = new DiscordRequest(
      this,
      { url, method: "DELETE" },
      // DELETE SHOULD NOT HAVE A BODY
      undefined,
      reason
    );

    return await request.execute();
  }
}

export default RestManager;

export type Snowflake = string | bigint;

export interface RestManagerOptions {
  /** The api version you wish to use. */
  version?: 10;
  /** The bot token */
  token: string;
  /** Whether or not to enable debug mode. */
  debug?: boolean;
  /** The base url to sent the requests to */
  baseURL?: string;
}

export interface CreateChannelOptions {
  name: string;
  type?: ChannelTypeNames;
  topic?: string;
  permissionOverwrites?: OverwriteReadable[];
  parentId?: bigint;
  nsfw?: boolean;
}

export interface OverwriteReadable {
  /** Role or user id */
  id: string;
  /** Either 0 (role) or 1 (member) */
  type: OverwriteType;
  /** Permission bit set */
  allow?: Permissions[];
  /** Permission bit set */
  deny?: Permissions[];
}

/** https://discord.com/developers/docs/resources/channel#channel-object-channel-types */
export const channelTypes = {
  /** A text channel within a server */
  text: 0,
  /** A direct message between users */
  dm: 1,
  /** A voice channel within a server */
  voice: 2,
  /** An organizational category that contains up to 50 channels */
  category: 4,
  /** A channel that users can follow and crosspost into their own server */
  news: 5,
  /** A temporary sub-channel within a GUILD_NEWS channel */
  newsThread: 10,
  /** A temporary sub-channel within a GUILD_TEXT channel */
  publicThread: 11,
  /** A temporary sub-channel within a GUILD_TEXT channel that is only viewable by those invited and those with the MANAGE_THREADS permission */
  privateThread: 12,
  /** A voice channel for hosting events with an audience */
  stage: 13,
};

export type ChannelTypeNames = keyof typeof channelTypes;

export enum OverwriteType {
  role,
  member,
}

// FROM DISCORDENO
/** https://discord.com/developers/docs/topics/permissions#permissions-bitwise-permission-flags */
export enum BitwisePermissionFlags {
  /** Allows creation of instant invites */
  CREATE_INSTANT_INVITE = 0x0000000000000001,
  /** Allows kicking members */
  KICK_MEMBERS = 0x0000000000000002,
  /** Allows banning members */
  BAN_MEMBERS = 0x0000000000000004,
  /** Allows all permissions and bypasses channel permission overwrites */
  ADMINISTRATOR = 0x0000000000000008,
  /** Allows management and editing of channels */
  MANAGE_CHANNELS = 0x0000000000000010,
  /** Allows management and editing of the guild */
  MANAGE_GUILD = 0x0000000000000020,
  /** Allows for the addition of reactions to messages */
  ADD_REACTIONS = 0x0000000000000040,
  /** Allows for viewing of audit logs */
  VIEW_AUDIT_LOG = 0x0000000000000080,
  /** Allows for using priority speaker in a voice channel */
  PRIORITY_SPEAKER = 0x0000000000000100,
  /** Allows the user to go live */
  STREAM = 0x0000000000000200,
  /** Allows guild members to view a channel, which includes reading messages in text channels and joining voice channels */
  VIEW_CHANNEL = 0x0000000000000400,
  /** Allows for sending messages in a channel. (does not allow sending messages in threads) */
  SEND_MESSAGES = 0x0000000000000800,
  /** Allows for sending of /tts messages */
  SEND_TTS_MESSAGES = 0x0000000000001000,
  /** Allows for deletion of other users messages */
  MANAGE_MESSAGES = 0x0000000000002000,
  /** Links sent by users with this permission will be auto-embedded */
  EMBED_LINKS = 0x0000000000004000,
  /** Allows for uploading images and files */
  ATTACH_FILES = 0x0000000000008000,
  /** Allows for reading of message history */
  READ_MESSAGE_HISTORY = 0x0000000000010000,
  /** Allows for using the @everyone tag to notify all users in a channel, and the @here tag to notify all online users in a channel */
  MENTION_EVERYONE = 0x0000000000020000,
  /** Allows the usage of custom emojis from other servers */
  USE_EXTERNAL_EMOJIS = 0x0000000000040000,
  /** Allows for viewing guild insights */
  VIEW_GUILD_INSIGHTS = 0x0000000000080000,
  /** Allows for joining of a voice channel */
  CONNECT = 0x0000000000100000,
  /** Allows for speaking in a voice channel */
  SPEAK = 0x0000000000200000,
  /** Allows for muting members in a voice channel */
  MUTE_MEMBERS = 0x0000000000400000,
  /** Allows for deafening of members in a voice channel */
  DEAFEN_MEMBERS = 0x0000000000800000,
  /** Allows for moving of members between voice channels */
  MOVE_MEMBERS = 0x0000000001000000,
  /** Allows for using voice-activity-detection in a voice channel */
  USE_VAD = 0x0000000002000000,
  /** Allows for modification of own nickname */
  CHANGE_NICKNAME = 0x0000000004000000,
  /** Allows for modification of other users nicknames */
  MANAGE_NICKNAMES = 0x0000000008000000,
  /** Allows management and editing of roles */
  MANAGE_ROLES = 0x0000000010000000,
  /** Allows management and editing of webhooks */
  MANAGE_WEBHOOKS = 0x0000000020000000,
  /** Allows management and editing of emojis */
  MANAGE_EMOJIS = 0x0000000040000000,
  /** Allows members to use application commands in text channels */
  USE_SLASH_COMMANDS = 0x0000000080000000,
  /** Allows for requesting to speak in stage channels. */
  REQUEST_TO_SPEAK = 0x0000000100000000,
  /** Allows for creating, editing, and deleting scheduled events */
  MANAGE_EVENTS = 0x0000000200000000,
  /** Allows for deleting and archiving threads, and viewing all private threads */
  MANAGE_THREADS = 0x0000000400000000,
  /** Allows for creating public and announcement threads */
  CREATE_PUBLIC_THREADS = 0x0000000800000000,
  /** Allows for creating private threads */
  CREATE_PRIVATE_THREADS = 0x0000001000000000,
  /** Allows the usage of custom stickers from other servers */
  USE_EXTERNAL_STICKERS = 0x0000002000000000,
  /** Allows for sending messages in threads */
  SEND_MESSAGES_IN_THREADS = 0x0000004000000000,
  /** Allows for launching activities (applications with the `EMBEDDED` flag) in a voice channel. */
  USE_EMBEDDED_ACTIVITIES = 0x0000008000000000,
  /** Allows for timing out users to prevent them from sending or reacting to messages in chat and threads, and from speaking in voice and stage channels */
  MODERATE_MEMBERS = 0x0000010000000000,
}

export type Permissions = keyof typeof BitwisePermissionFlags;
