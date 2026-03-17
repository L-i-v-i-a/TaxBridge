/**
 * @file google.strategy.ts
 * @description Passport Strategy for Google OAuth 2.0 authentication.
 * Handles the exchange of authorization codes for user profiles.
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private authService: AuthService,
    private config: ConfigService,
  ) {
    // Retrieve credentials securely from ConfigService
    const clientID = config.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = config.get<string>('GOOGLE_CLIENT_SECRET');

    if (!clientID || !clientSecret) {
      // Throw error at startup if keys are missing
      throw new Error('Missing Google OAuth credentials in environment variables');
    }

    super({
      clientID,
      clientSecret,
      callbackURL:
        config.get<string>('GOOGLE_CALLBACK_URL') ||
        'https://backend-production-c062.up.railway.app/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    const email = profile.emails?.[0]?.value;
    const firstName = profile.name?.givenName;
    const lastName = profile.name?.familyName;
    
    // Extract Profile Picture (if available)
    const picture = profile.photos?.[0]?.value;

    if (!email) {
      // Use UnauthorizedException for auth failures
      return done(new UnauthorizedException('Google profile missing email'), undefined);
    }

    try {
      // Pass the picture to the service
      const user = await this.authService.validateGoogleUser({
        googleId: profile.id,
        email,
        firstName,
        lastName,
        picture, // <--- Added picture field
      });

      done(null, user);
    } catch (err) {
      done(err, undefined);
    }
  }
}