import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AuthEntity } from './entities/auth.entity';
import { LoginDto } from './dto/login.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { verifyPassword } from 'src/core/bcrypt';
import { LogoutDto } from './dto/logout.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  @ApiCreatedResponse({ type: UserEntity })
  async create(@Body() createUserDto: CreateUserDto) {
    const emailExists = await this.usersService.emailExists(
      createUserDto.email,
    );
    if (emailExists) {
      throw new BadRequestException(
        `User with email '${createUserDto.email}' already exists!`,
      );
    }
    return new UserEntity(await this.authService.register(createUserDto));
  }

  @Post('login')
  @ApiCreatedResponse({ type: AuthEntity })
  async login(@Body() { email, password }: LoginDto) {
    const result = await this.authService.login(email, password);
    return result;
  }

  @Post('logout')
  @ApiCreatedResponse()
  async logout(@Body() { userId, refreshToken }: LogoutDto) {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} does not exist.`);
    }
    if (!user.refreshToken) {
      throw new UnauthorizedException(
        `User with id ${userId} is not logged in.`,
      );
    }
    if (!verifyPassword(refreshToken, user.refreshToken)) {
      throw new UnauthorizedException(`Refresh token provided is not valid.`);
    }
    const result = await this.authService.removeRefreshToken(userId);
    return new UserEntity(result);
  }
}
