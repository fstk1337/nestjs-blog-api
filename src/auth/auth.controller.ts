import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AuthEntity } from './entities/auth.entity';
import { LoginDto } from './dto/login.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { LogoutDto } from './dto/logout.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse()
  async logout(@Body() { userId }: LogoutDto) {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} does not exist.`);
    }
    return new UserEntity(user);
  }
}
