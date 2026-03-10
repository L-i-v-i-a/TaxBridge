import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');
    if (!token) return false;

    try {
      const payload: any = this.jwt.verify(token);
      console.log('AdminGuard payload:', payload);
      // first check admin flag in token
      if (payload.isAdmin) {
        console.log('AdminGuard approved by token flag');
        return true;
      }
      // fallback to database in case token lacks flag
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: { isAdmin: true },
      });
      console.log('AdminGuard db user check:', user);
      return user?.isAdmin === true;
    } catch (err) {
      console.error('AdminGuard jwt verify error:', err);
      return false;
    }
  }
}