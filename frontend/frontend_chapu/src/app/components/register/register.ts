import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register {
  registerData = {
    username: '',
    phone_number: '',
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
    
    if (!this.registerData.username || !this.registerData.phone_number || !this.registerData.password || !this.registerData.confirmPassword) {
      this.registerError = 'Please fill in all fields.';
      return;
    }

    // Validate Tanzanian phone number format (supports +255, 07, 06)
    const phoneRegex = /^(\+255|0)[67]\d{8}$/;
    if (!phoneRegex.test(this.registerData.phone_number)) {
      this.registerError = 'Please enter a valid Tanzanian phone number (e.g., 0712345678 or +255712345678)';
      return;
    }

    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.registerError = 'Passwords do not match.';
      return;
    }

    if (this.registerData.password.length < 6) {
      this.registerError = 'Password must be at least 6 characters long.';
      return;
    }

    try {
      const payload = {
        username: this.registerData.username,
        phone_number: this.registerData.phone_number,
        password: this.registerData.password,
        user_role: this.registerData.user_role
      };
      
      await this.http.post('http://localhost:8000/api/auth/register/', payload).toPromise();
      this.registerSuccess = 'Registration successful! Redirecting to login...';
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error);
      this.registerError = 'Registration failed. This phone number may already be registered.';
    }
  }
}