import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sticky-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './sticky-header.html',
  styleUrls: ['./sticky-header.css'],
})
export class StickyHeader implements OnInit {
  isScrolled = false;
  menuOpen = false;

  ngOnInit(): void {}

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 20;
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }
}
