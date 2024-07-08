import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard, RoleGuard } from 'src/guards';
import { Access, ROLE } from 'src/decorators';
import { ProfileAuth } from 'src/decorators/ProfileAtuh.decorator';

@UseGuards(AuthGuard, RoleGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Access()
  @Get()
  findAll(@ProfileAuth() profile: { id: string, role: ROLE }){
    return this.userService.findAll(profile);
  }
  
  @Access()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
  
  @Access()
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateUserDto, @ProfileAuth() profile: { id: string, role: ROLE, email: string }) {
    return this.userService.update(id, data, profile);
  }

}
