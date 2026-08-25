import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

interface PublicLoad {
  id: number;
  pickup_location: string;
  dropoff_location: string;
  weight_kg: string;
  description: string;
  status: string;
  created_at: string;
}

interface PublicTruck {
  id: number;
  vehicle_type: string;
  capacity_kg: string;
  current_location: string;
  is_available: boolean;
  created_at: string;
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home implements OnInit, OnDestroy {
  userRole: string | null = null;
  username: string | null = null;

  // Hero carousel
  heroImages: string[] = ['/image11.png', '/image12.png', '/image13.png'];
  currentHeroImage: string = this.heroImages[0];
  heroImageIndex: number = 0;
  private carouselInterval: any;

  // Public data
  publicLoads: PublicLoad[] = [];
  publicTrucks: PublicTruck[] = [];
  loadingData = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.userRole = localStorage.getItem('userRole');
    this.username = localStorage.getItem('username');
    this.fetchPublicData();
    this.startCarousel();
  }

  ngOnDestroy(): void {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }

  startCarousel(): void {
    this.carouselInterval = setInterval(() => {
      this.heroImageIndex = (this.heroImageIndex + 1) % this.heroImages.length;
      this.currentHeroImage = this.heroImages[this.heroImageIndex];
    }, 2000);
  }

  async fetchPublicData(): Promise<void> {
    try {
      const [loadsRes, trucksRes] = await Promise.all([
        fetch('/api/loads/public/loads/'),
        fetch('/api/loads/public/trucks/')
      ]);
      this.publicLoads = loadsRes.ok ? await loadsRes.json() : [];
      this.publicTrucks = trucksRes.ok ? await trucksRes.json() : [];
    } catch (e) {
      console.error('Failed to fetch public data', e);
    } finally {
      this.loadingData = false;
    }
  }

  logout(): void {
    localStorage.clear();
    this.userRole = null;
    this.router.navigate(['/']);
  }

  getRoleDisplay(): string {
    if (!this.userRole) return '';
    return this.userRole.replace(/_/g, ' ');
  }
}