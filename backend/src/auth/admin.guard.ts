/**
 * @file admin.guard.ts
 * @description Guard responsible for protecting routes that require administrative privileges.
 * It verifies the JWT token and ensures the user has the 'isAdmin' flag.
 */

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Request } from 'express';

import { PrismaService } from '../prisma.service';

// Standard interface for JWT payload
interface JwtPayload {
  sub: string; // User ID
  email?: string;
  isAdmin?: boolean;
  iat?: number;
  exp?: number;
}

// Extend Express Request to include the 'user' property
declare module 'express' {
  interface Request {
    user?: JwtPayload;
  }
}

@Injectable()
export class AdminGuard implements CanActivate {
  private readonly logger = new Logger(AdminGuard.name);

  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    // 1. Extract Token
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      this.logger.warn('Access denied: No token provided');
      throw new UnauthorizedException('Authentication token is missing.');
    }

    let payload: JwtPayload;
    // 2. Verify Token
    try {
      payload = this.jwt.verify<JwtPayload>(token);
    } catch (err) {
      this.logger.error(`Token verification failed: ${err.message}`);
      throw new UnauthorizedException('Invalid or expired token.');
    }

    // 3. Attach User to Request (Crucial for downstream access)
    request.user = payload;

    // 4. Check Admin Status (Fast Path: Token Claim)
    if (payload.isAdmin === true) {
      this.logger.verbose(`
        Admin access granted via token for user ${payload.sub}`);
      return true;
    }

    // 5. Fallback Check (Database)
    // Useful if the token was issued before the user was promoted to admin
    this.logger.verbose(`Checking database for admin status: ${payload.sub}`);
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { isAdmin: true },
    });

    if (user?.isAdmin) {
      return true;
    }

    this.logger.warn(`Access denied for user ${payload.sub}: Not an admin.`);
    throw new ForbiddenException('You do not have administrative privileges.');
  }

  /**
   * Helper to extract Bearer token from Authorization header.
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
