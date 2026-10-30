import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { AuthService, mockAuthInterceptor } from './auth-service';

describe('Local account API', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([mockAuthInterceptor])),
        provideHttpClientTesting(),
      ],
    });
  });

  afterEach(() => TestBed.inject(HttpTestingController).verify());

  it('creates an in-memory demo session without contacting a backend', async () => {
    const auth = TestBed.inject(AuthService);
    const result = await firstValueFrom(auth.login('member@example.test', 'fictional-password'));
    expect(result.account?.email).toBe('member@example.test');
    expect(await firstValueFrom(auth.sessionChanges)).toEqual(result.account);
    TestBed.inject(HttpTestingController).expectNone('/mock-api/auth/login?scenario=normal');
    auth.signOut();
    expect(await firstValueFrom(auth.sessionChanges)).toBeNull();
  });

  it('reports an invalid demo code through the HTTP error channel', async () => {
    await expect(
      firstValueFrom(TestBed.inject(AuthService).verifyCode('member@example.test', '000000')),
    ).rejects.toMatchObject({ status: 422 });
  });

  it('supports a reproducible local service-failure scenario', async () => {
    await expect(
      firstValueFrom(TestBed.inject(AuthService).requestCode('member@example.test', 'error')),
    ).rejects.toMatchObject({ status: 503 });
  });
});
