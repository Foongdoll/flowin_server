import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.guard';
import { IsEmail, IsString, MinLength } from 'class-validator';

class RegisterDto {
  @IsEmail()
  email!: string;
  @IsString()
  name!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}

class LoginDto {
  @IsEmail()
  email!: string;
  @IsString()
  @MinLength(6)
  password!: string;
}

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto.email, dto.name, dto.password);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: any) {
    return this.auth.me(req.user.sub);
  }
}
