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
    const mockConfig = { get: jest.fn().mockImplementation((key: string) => {
      if (key === 'GMAIL_USER') return 'test@gmail.com';
      if (key === 'GMAIL_APP_PASSWORD') return 'fake-pass';
      return undefined;
    }) } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwt },
        { provide: ConfigService, useValue: mockConfig },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    // stub the nodemailer transporter so no real network call
    service['transporter'] = { sendMail: jest.fn().mockResolvedValue({}) } as any;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('signup should return success message', async () => {
    const dto = {
      firstName: 'Test',
      lastName: 'User',
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

  it('login should return message and tokens (using email)', async () => {
    const email = 'a@b.com';
    const password = 'pass';
    const mockUser = { id: '1', email, password: 'hashed', firstName: 'Test', lastName: 'User' };
    jest.spyOn(service['prisma'].user, 'findFirst').mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

    const res = await service.login(email, password);
    expect(res).toHaveProperty('message', 'Login successful');
    expect(res).toHaveProperty('isAdmin', false); // assuming test user is not admin
    expect(res).toHaveProperty('access_token');
    expect(res).toHaveProperty('refresh_token');
    expect(service['transporter'].sendMail).toHaveBeenCalled();
  });

  it('login should accept username and also return tokens', async () => {
    const username = 'tester';
    const password = 'pass';
    const mockUser = { id: '1', email: 'a@b.com', password: 'hashed', firstName: 'Test', lastName: 'User' };
    jest.spyOn(service['prisma'].user, 'findFirst').mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

    const res = await service.login(username, password);
    expect(res.message).toBe('Login successful');
    expect(res).toHaveProperty('isAdmin', false);
    expect(res).toHaveProperty('access_token');
    expect(res).toHaveProperty('refresh_token');
    expect(service['transporter'].sendMail).toHaveBeenCalled();
  });

  it('updateProfile should propagate new tax/profile fields', async () => {
    const dto = {
      firstName: 'Jane',
      lastName: 'Doe',
      ein: '11-2223333',
      numberOfDependents: 3,
    } as any;
    const returned = { id: '1', ...dto };
    jest.spyOn(service['prisma'].user, 'update').mockResolvedValue(returned);
    const res = await service.updateProfile('1', dto);
    expect(res).toEqual(returned);
  });

  it('refreshTokens should verify and return new pair', async () => {
    // generate a real jwt using service helper
    const tokens = service['signTokens']('1', 'a@b.com');
    const spy = jest.spyOn(service['prisma'].user, 'findUnique').mockResolvedValue({ id: '1', email: 'a@b.com' } as any);
    const res = await service.refreshTokens(tokens.refresh_token);
    expect(res).toHaveProperty('access_token');
    expect(res).toHaveProperty('refresh_token');
    expect(spy).toHaveBeenCalledWith({ where: { id: '1' } });
  });
});
