import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { AuthGuard, RoleGuard } from 'src/guards';
import { Access, ROLE } from 'src/decorators';
import { ProfileAuth } from 'src/decorators/ProfileAtuh.decorator';

@UseGuards(AuthGuard, RoleGuard)
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Access(ROLE.ADMIN)
  @Get()
  findAll() {
    return this.messagesService.findAll();
  }

  @Access(ROLE.ADMIN)
  @Get('received-by-user/:id')
  receivedByUser(@Param('id') id: string) {
    return this.messagesService.receivedByUser(id);
  }

  @Access(ROLE.ADMIN)
  @Get('sended-by-user/:id')
  sendByUser(@Param('id') id: string) {
    return this.messagesService.sendedUser(id);
  }

  @Access()
  @Get('my-chat/:user')
  myChat(
    @Param('user') user: string,
    @ProfileAuth() profile: { id: string },
  ) {
    return this.messagesService.myChat(user, profile);
  }
  
  @Access()
  @Get('chat/:sender/:receiver')
  chatUser(
    @Param('sender') sender: string,
    @Param('receiver') receiver: string,
    @ProfileAuth() profile: { id: string, role: ROLE },
  ) {
    return this.messagesService.chat(sender, receiver, profile);
  }

  @Access()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(id);
  }
}
