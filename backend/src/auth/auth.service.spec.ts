import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const mockPrisma = {
      user: {
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    } as any;
    const mockJwt = { sign: jest.fn().mockReturnValue('token') } as any;
    const mockConfig = { get: jest.fn().mockReturnValue(undefined) } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwt },
        { provide: ConfigService, useValue: mockConfig },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('signup should return success message', async () => {
    const dto = {
      name: 'Test',
      username: 'tester',
      phone: '123',
      email: 'a@b.com',
      dateOfBirth: '2000-01-01',
      password: 'pass',
      ssn: '000-00-0000',
    } as any;

    // the mock prisma.create will simply return the data
    (module as any); // nothing
    const result = await service.signup(dto);
    expect(result).toEqual({ message: 'Signup successful' });
  });

  it('login should return token', async () => {
    const email = 'a@b.com';
    const password = 'pass';
    // configure mock user and bcrypt compare
    const mockUser = { id: '1', email, password: 'hashed', name: 'Test' };
    jest.spyOn(service['prisma'].user, 'findUnique').mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

    const res = await service.login(email, password);
    expect(res).toEqual({ access_token: 'token' });
  });
});
