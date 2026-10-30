import { ChangeDetectorRef, ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService, describeAuthError } from './auth-service';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class RegisterPage {
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly view = inject(ChangeDetectorRef);
  private readonly fb = inject(FormBuilder).nonNullable;
  readonly form = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    {
      // TODO 10
      validators: (group: AbstractControl): ValidationErrors | null =>
        group.get('password')?.value === group.get('confirmPassword')?.value
          ? null
          : { passwordMismatch: true },
    },
  );
  loading = false;
  error = '';
  success = '';

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
      .register(
        values.name,
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
          this.form.controls.confirmPassword.reset();
          // TODO 13
          console.log('Account form completed: registration');
        },
        error: (error) => {
          this.loading = false;
          this.view.markForCheck();
          this.error = describeAuthError(error);
        },
      });
  }
}
