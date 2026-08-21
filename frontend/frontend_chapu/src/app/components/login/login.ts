import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  loginData = {
    email: '',
    password: ''
  };
  loginError = '';

  constructor(private http: HttpClient, private router: Router) {}

  async onLoginSubmit(): Promise<void> {
    this.loginError = '';
    if (!this.loginData.email || !this.loginData.password) {
      this.loginError = 'Please fill in all fields.';
      return;
    }

    try {
      const response: any = await this.http.post('/api/auth/token/', this.loginData).toPromise();
      localStorage.setItem('accessToken', response.access);
      localStorage.setItem('refreshToken', response.refresh);
      localStorage.setItem('userRole', response.user_role);
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Login error:', error);
      this.loginError = 'Invalid email or password.';
    }
  }
}