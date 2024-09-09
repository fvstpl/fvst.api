import { Controller, Post, Body, Put, Param, Get, Req, Res, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResetRequestDto } from './dto/reset-request.dto';

import { Request, Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('new')
  async createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const { email, password } = createUserDto;
    if (!email || !password) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: true,
        code: 400,
        message: 'Invalid form body',
      });
    }

    const result = await this.userService.createUser(email, password);
    if (result.error) {
      return res.status(result.code).json(result);
    }

    res.status(HttpStatus.OK).json(result);
  }

  @Post('reset')
  async resetRequest(@Body() resetRequestDto: ResetRequestDto, @Res() res: Response) {
    const { email } = resetRequestDto;
    if (!email) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: true,
        code: 400,
        message: 'Invalid form body',
      });
    }

    const result = await this.userService.requestPasswordReset(email);
    res.status(result.code).json(result);
  }

  @Put('reset')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto, @Res() res: Response) {
    const { token, password } = resetPasswordDto;
    if (!token || !password) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: true,
        code: 400,
        message: 'Invalid form body',
      });
    }

    const result = await this.userService.resetPassword(token, password);
    res.status(result.code).json(result);
  }

  @Post('token')
  async login(@Body() body: { email: string; password: string; ip?: string }, @Res() res: Response) {
    const { email, password, ip } = body;
    if (!email || !password) {
      return res.status(HttpStatus.FORBIDDEN).json({
        error: true,
        code: 403,
        message: 'Missing credentials',
      });
    }

    const result = await this.userService.login(email, password, ip);
    res.status(result.code).json(result);
  }

  @Get('update/:id')
  async updateUser(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    if (id !== '@me' && req.user.role !== 'admin') {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        error: true,
        code: 401,
        message: 'You only have permission to fetch @me',
      });
    }

    const userId = id === '@me' ? req.user.id : id;
    const result = await this.userService.updateUserCache(userId);
    res.status(200).json(result);
  }

  @Get('info/:id')
  async getUserInfo(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    if (id !== '@me' && req.user.role !== 'admin') {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        error: true,
        code: 401,
        message: 'You only have permission to fetch @me',
      });
    }

    const userId = id === '@me' ? req.user.id : id;
    const result = await this.userService.getUserInfo(userId);
    res.status(200).json(result);
  }
}
