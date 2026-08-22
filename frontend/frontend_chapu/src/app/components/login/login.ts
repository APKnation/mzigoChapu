import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  loginData = {
    phone_number: '',
    password: ''
  };
  loginError = '';

  constructor(private http: HttpClient, private router: Router) {}

  async onLoginSubmit(): Promise<void> {
    this.loginError = '';
    
    if (!this.loginData.phone_number || !this.loginData.password) {
      this.loginError = 'Please fill in all fields.';
      return;
    }

    const phoneRegex = /^(\+255|0)[67]\d{8}$/;
    if (!phoneRegex.test(this.loginData.phone_number)) {
      this.loginError = 'Please enter a valid Tanzanian phone number (e.g., 0712345678)';
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/auth/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: this.loginData.phone_number,
          password: this.loginData.password
        })
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      localStorage.setItem('userRole', data.user_role);
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Login error:', error);
      this.loginError = 'Invalid phone number or password. Please try again.';
    }
  }
}