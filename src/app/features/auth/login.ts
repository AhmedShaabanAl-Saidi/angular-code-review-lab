import { ChangeDetectorRef, ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService, DemoAccount, describeAuthError } from './auth-service';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class LoginPage {
  readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly view = inject(ChangeDetectorRef);
  private readonly fb = inject(FormBuilder).nonNullable;
  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });
  currentUser: DemoAccount | null = null;
  loading = false;
  error = '';
  success = '';

  constructor() {
    // TODO 8
    this.auth.sessionChanges.subscribe((account) => (this.currentUser = account));
  }

  submit(): void {
    if (this.loading) return;
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    // TODO 1
    this.loading = true;
    this.error = '';
    this.success = '';
    const values = this.form.getRawValue();
    this.auth
      .login(
        values.email,
        values.password,
        this.route.snapshot.queryParamMap.get('scenario') ?? 'normal',
      )
      .subscribe({
        next: (result) => {
          this.loading = false;
          this.view.markForCheck();
          this.success = result.message;
          this.form.controls.password.reset();
          // TODO 13
          console.log('Account form completed: login');
        },
        error: (error) => {
          this.loading = false;
          this.view.markForCheck();
          this.error = describeAuthError(error);
        },
      });
  }
}
