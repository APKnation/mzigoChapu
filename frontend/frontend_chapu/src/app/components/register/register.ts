import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register {
  registerData = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    user_role: 'cargo_owner'
  };
  registerError = '';
  registerSuccess = '';

  constructor(private http: HttpClient, private router: Router) {}

  async onRegisterSubmit(): Promise<void> {
    this.registerError = '';
    this.registerSuccess = '';
    
    if (!this.registerData.username || !this.registerData.email || !this.registerData.password || !this.registerData.confirmPassword) {
      this.registerError = 'Please fill in all fields.';
      return;
    }

    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.registerError = 'Passwords do not match.';
      return;
    }

    if (this.registerData.password.length < 8) {
      this.registerError = 'Password must be at least 8 characters long.';
      return;
    }

    try {
      const payload = {
        username: this.registerData.username,
        email: this.registerData.email,
        password: this.registerData.password,
        user_role: this.registerData.user_role
      };
      
      await this.http.post('/api/auth/register/', payload).toPromise();
      this.registerSuccess = 'Registration successful! Redirecting to login...';
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error);
      this.registerError = 'Registration failed. Please try again.';
    }
  }
}