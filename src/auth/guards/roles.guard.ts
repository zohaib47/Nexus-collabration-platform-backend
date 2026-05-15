import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

// roles.guard.ts
canActivate(context: ExecutionContext): boolean {
  const roles = this.reflector.getAllAndOverride<string[]>('roles', [
    context.getHandler(),
    context.getClass(),
  ]);
  
  if (!roles) return true;

  const request = context.switchToHttp().getRequest();
  const user = request.user; 

  // Debugging ke liye ye line terminal mein check karein
  console.log('ROLES GUARD DEBUG:', { 
    requiredRoles: roles, 
    userObject: user,
    userRole: user?.role 
  });

  if (!user) {
    // Agar user undefined hai, iska matlab JwtAuthGuard abhi execute nahi hua ya fail ho gaya
    throw new UnauthorizedException('User authentication data missing in Guard!');
  }

  const hasRole = roles.includes(user.role);

  if (!hasRole) {
    throw new ForbiddenException(`Aapka role (${user.role}) is action ki ijazat nahi deta!`);
  }
  
  return true;
}
}