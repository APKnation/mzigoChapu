import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit {
  isAuthenticated: boolean = false;
  userRole: string | null = null;
  currentLang: string = 'en';

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.checkAuthenticationStatus();
    setInterval(() => this.checkAuthenticationStatus(), 1000);
  }

  checkAuthenticationStatus(): void {
    this.isAuthenticated = !!localStorage.getItem('accessToken');
    this.userRole = localStorage.getItem('userRole');
  }

  changeLanguage(lang: string): void {
    this.currentLang = lang;
    // Simple language toggle for now - full i18n can be added later
    console.log('Language changed to:', lang);
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    this.isAuthenticated = false;
    this.userRole = null;
    this.router.navigate(['/login']);
  }
}