import { Controller, HttpCode, HttpStatus, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/users/dto/login-user.dto';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() loginUserDto: LoginUserDto) {
        return this.authService.signIn(loginUserDto.email, loginUserDto.password);
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout(@Body() body: { token: string }) {
        return {
            statusCode: HttpStatus.OK,
            message: 'User logged out successfully',
        };
    }
}
