import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Guild, Permissions, Channel } from 'discord.js';

import { IServer } from './schemas/server.schema';

@Injectable()
export class ServerService {
  constructor(@InjectModel('server') private serverModel: Model<IServer>) {}

  async getServer(serverId: string): Promise<IServer> {
    let server = await this.serverModel.findById(serverId);
    if (!server) {
      return this.serverModel.create({
        _id: serverId,
        channelsSubscribedToPolls: [],
      });
    }
    return server;
  }

  userHasAdministratorPermissions(guild: Guild, requesterId: string): boolean {
    const requester = guild.members.resolve(requesterId);

    return requester.hasPermission(Permissions.FLAGS.ADMINISTRATOR);
  }

  async isChannelSubscribedToPolls(
    guild: Guild,
    channel: Channel,
  ): Promise<boolean> {
    return (await this.getServer(guild.id)).channelsSubscribedToPolls.includes(
      channel.id,
    );
  }

  async subscribeChannelToPolls(
    guild: Guild,
    channel: Channel,
  ): Promise<IServer> {
    const server = await this.getServer(guild.id);

    if (!server.channelsSubscribedToPolls) {
      server.channelsSubscribedToPolls = [channel.id];
    } else {
      if (!server.channelsSubscribedToPolls.includes(channel.id)) {
        server.channelsSubscribedToPolls.push(channel.id);
      }
    }

    await server.save();

    return server;
  }

  async unsubscribeChannelToPolls(
    guild: Guild,
    channel: Channel,
  ): Promise<IServer> {
    const server = await this.getServer(guild.id);

    if (!server.channelsSubscribedToPolls) {
      server.channelsSubscribedToPolls = [];
    } else {
      if (server.channelsSubscribedToPolls.includes(channel.id)) {
        server.channelsSubscribedToPolls = server.channelsSubscribedToPolls.filter(
          (id) => id !== channel.id,
        );
      }
    }

    await server.save();

    return server;
  }

  async getAllServers(): Promise<IServer[]> {
    return this.serverModel.find();
  }
}
