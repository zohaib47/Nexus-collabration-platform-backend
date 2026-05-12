import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' }, // Production mein isay restrict karein
})
export class VideoGateway {
  @WebSocketServer()
  server!: Server;

  // Jab user room join kare (Meeting ID ke base par)
  @SubscribeMessage('join-room')
  handleJoinRoom(
    @MessageBody() data: { roomId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.roomId);
    console.log(`User ${data.userId} joined room ${data.roomId}`);
    
    // Doosre users ko batana ke naya banda aa gaya hai
    client.to(data.roomId).emit('user-connected', data.userId);
  }

  // WebRTC Signaling: Offer/Answer/Ice-Candidate transfer
  @SubscribeMessage('signal')
  handleSignal(@MessageBody() data: { roomId: string; signal: any }) {
    // Room mein maujood doosre bande ko signal bhej dena
    this.server.to(data.roomId).emit('signal', data.signal);
  }

  // Meeting khatam karna
  @SubscribeMessage('end-call')
  handleEndCall(@MessageBody() data: { roomId: string }) {
    this.server.to(data.roomId).emit('call-ended');
  }
}