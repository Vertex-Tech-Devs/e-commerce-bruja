import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  authErrorMessage = '';
  isAlreadyLogged = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.authService.isAuthenticated().pipe(take(1)).subscribe((isAuth) => {
      this.isAlreadyLogged = isAuth;
    });

    this.route.queryParams.subscribe(params => {
      if (params['authError']) {
        this.authErrorMessage = 'Debes iniciar sesión para acceder al panel de administración.';
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).pipe(take(1)).subscribe({
        next: () => {
          this.router.navigate(['/admin']);
        },
        error: () => {
          this.authErrorMessage = 'Error al iniciar sesión. Verifica tus credenciales.';
        }
      });
    }
  }

  logout(): void {
    this.authService.logout().pipe(take(1)).subscribe(() => {
      this.router.navigate(['/admin/login']);
    });
  }
}