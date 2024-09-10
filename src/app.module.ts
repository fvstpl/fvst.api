import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './users/user.module';

@Module({
  imports: [UserModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
