import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
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

  constructor(private router: Router, private translate: TranslateService) { }

  ngOnInit(): void {
    this.checkAuthenticationStatus();
    setInterval(() => this.checkAuthenticationStatus(), 1000);
  }

  checkAuthenticationStatus(): void {
    this.isAuthenticated = !!localStorage.getItem('accessToken');
    this.userRole = localStorage.getItem('userRole');
  }

  changeLanguage(lang: string): void {
    this.translate.use(lang);
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