import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PollModule } from './poll/poll.module';

@Module({
  imports: [
    PollModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
