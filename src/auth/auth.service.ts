import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';
import { AuthEntity } from './entity/auth.entity';
import { verifyPassword } from 'src/core/bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<AuthEntity> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('User credentials mismatch.');
    }

    const isPasswordValid = verifyPassword(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('User credentials mismatch.');
    }

    return {
      accessToken: this.jwtService.sign({ userId: user.id }),
    };
  }
}
