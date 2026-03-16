import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    const clientID = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    if (!clientID || !clientSecret) {
      throw new Error('GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set');
    }
    super({
      clientID,
      clientSecret,
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        'http://localhost:3001/auth/google/callback',
      scope: ['email', 'profile'],
      passReqToCallback: false,
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
    if (!email) {
      done(new Error('Google profile missing email'), undefined);
      return;
    }
    const user = await this.authService.validateGoogleUser({
      googleId: profile.id,
      email,
      firstName,
      lastName,
    });
    done(null, user);
  }
}
