import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Server } from './schemas/server.schema';

import { ServerService } from './server.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'server', schema: Server }])],
  providers: [ServerService],
  exports: [ServerService],
})
export class ServerModule {}
