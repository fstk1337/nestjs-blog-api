import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from 'src/database/database.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import configuration from '../core/config/configuration';

const config = configuration();

@Module({
  imports: [
    DatabaseModule,
    PassportModule,
    JwtModule.register({
      secret: config['JWT_SECRET'],
      signOptions: { expiresIn: config['JWT_EXPIRES_IN'] },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
