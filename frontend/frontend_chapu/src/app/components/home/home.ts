import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

interface Booking {
  id?: number;
  truck: number;
  truck_owner_name?: string;
  truck_type?: string;
  truck_capacity?: string;
  pickup_location: string;
  dropoff_location: string;
  weight_kg: number;
  cargo_description: string;
  notes: string;
  status: string;
  price?: number;
  created_at?: string;
  local_id?: string;
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, RouterModule],
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

  // Booking state
  showBookingModal = false;
  selectedTruck: PublicTruck | null = null;
  bookingForm = {
    pickup_location: '',
    dropoff_location: '',
    weight_kg: 1,
    cargo_description: '',
    notes: '',
  };
  bookingMessage = '';
  bookingError = '';
  myBookings: Booking[] = [];
  showMyBookings = false;

  // Available locations for booking form
  tzLocations: Record<string, string[]> = {
    'Dar es Salaam': ['Kinondoni', 'Ilala', 'Temeke', 'Ubungo', 'Kigamboni'],
    'Dodoma': ['Dodoma City', 'Kondoa', 'Kongwa', 'Chamwino'],
    'Mwanza': ['Mwanza City', 'Ilemela', 'Nyamagana', 'Misungwi'],
    'Arusha': ['Arusha City', 'Moshi', 'Karatu', 'Ngorongoro'],
    'Mbeya': ['Mbeya City', 'Chunya', 'Kyela', 'Rungwe'],
    'Tanga': ['Tanga City', 'Pangani', 'Mkinga'],
    'Morogoro': ['Morogoro City', 'Kilosa', 'Mvomero'],
    'Iringa': ['Iringa City', 'Kilolo', 'Mufindi'],
    'Kigoma': ['Kigoma City', 'Kasulu', 'Kibondo'],
  };
  bookingPickupRegion = '';
  bookingDropoffRegion = '';
  bookingPickupTowns: string[] = [];
  bookingDropoffTowns: string[] = [];
  bookingRegions: string[] = [];

  constructor(private router: Router, private cdr: ChangeDetectorRef, private ngZone: NgZone) {
    this.bookingRegions = Object.keys(this.tzLocations);
  }

  ngOnInit(): void {
    this.userRole = localStorage.getItem('userRole');
    this.username = localStorage.getItem('username');
    this.fetchPublicData();
    this.loadBookingsFromStorage();
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
      const loads = loadsRes.ok ? await loadsRes.json() : [];
      const trucks = trucksRes.ok ? await trucksRes.json() : [];
      this.ngZone.run(() => {
        this.publicLoads = loads;
        this.publicTrucks = trucks;
        this.loadingData = false;
        this.cdr.detectChanges();
      });
    } catch (e) {
      console.error('Failed to fetch public data', e);
      this.ngZone.run(() => {
        this.loadingData = false;
        this.cdr.detectChanges();
      });
    }
  }

  // ── Booking: open modal ───────────────────────────────────
  openBookingModal(truck: PublicTruck): void {
    if (!this.userRole) {
      this.router.navigate(['/login']);
      return;
    }
    this.selectedTruck = truck;
    this.bookingForm = {
      pickup_location: '',
      dropoff_location: '',
      weight_kg: 1,
      cargo_description: '',
      notes: '',
    };
    this.bookingPickupRegion = '';
    this.bookingDropoffRegion = '';
    this.bookingPickupTowns = [];
    this.bookingDropoffTowns = [];
    this.bookingMessage = '';
    this.bookingError = '';
    this.showBookingModal = true;
  }

  closeBookingModal(): void {
    this.showBookingModal = false;
    this.selectedTruck = null;
  }

  onBookingPickupRegionChange(): void {
    this.bookingPickupTowns = this.tzLocations[this.bookingPickupRegion] || [];
    this.bookingForm.pickup_location = '';
  }

  onBookingDropoffRegionChange(): void {
    this.bookingDropoffTowns = this.tzLocations[this.bookingDropoffRegion] || [];
    this.bookingForm.dropoff_location = '';
  }

  // ── Booking: save to localStorage ──────────────────────────
  private loadBookingsFromStorage(): void {
    try {
      const raw = localStorage.getItem('myBookings');
      this.myBookings = raw ? JSON.parse(raw) : [];
    } catch {
      this.myBookings = [];
    }
  }

  private saveBookingToStorage(booking: Booking): void {
    this.myBookings.unshift(booking);
    localStorage.setItem('myBookings', JSON.stringify(this.myBookings));
  }

  private updateBookingInStorage(booking: Booking): void {
    const idx = this.myBookings.findIndex(b => b.local_id === booking.local_id || b.id === booking.id);
    if (idx !== -1) {
      this.myBookings[idx] = booking;
      localStorage.setItem('myBookings', JSON.stringify(this.myBookings));
    }
  }

  // ── Booking: submit ────────────────────────────────────────
  async submitBooking(): Promise<void> {
    this.bookingMessage = '';
    this.bookingError = '';

    if (!this.selectedTruck) return;
    if (!this.bookingForm.pickup_location || !this.bookingForm.dropoff_location) {
      this.bookingError = 'Please select pickup and dropoff locations.';
      return;
    }

    const token = localStorage.getItem('accessToken');
    const localId = `local_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // Build local booking object
    const localBooking: Booking = {
      truck: this.selectedTruck.id,
      pickup_location: this.bookingForm.pickup_location,
      dropoff_location: this.bookingForm.dropoff_location,
      weight_kg: this.bookingForm.weight_kg,
      cargo_description: this.bookingForm.cargo_description,
      notes: this.bookingForm.notes,
      status: 'pending',
      local_id: localId,
      truck_type: this.selectedTruck.vehicle_type,
      truck_capacity: this.selectedTruck.capacity_kg,
    };

    // Always save to localStorage first
    this.saveBookingToStorage(localBooking);

    // Try to save to backend
    if (token) {
      try {
        const res = await fetch('/api/loads/bookings/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            truck: this.selectedTruck.id,
            pickup_location: this.bookingForm.pickup_location,
            dropoff_location: this.bookingForm.dropoff_location,
            weight_kg: this.bookingForm.weight_kg,
            cargo_description: this.bookingForm.cargo_description,
            notes: this.bookingForm.notes,
          }),
        });

        if (res.ok) {
          const serverBooking = await res.json();
          // Update local record with server ID
          localBooking.id = serverBooking.id;
          localBooking.status = serverBooking.status;
          this.updateBookingInStorage(localBooking);
          this.ngZone.run(() => {
            this.bookingMessage = 'Booking confirmed! The truck has been reserved for you.';
            this.cdr.detectChanges();
          });
        } else {
          const err = await res.json().catch(() => ({}));
          this.ngZone.run(() => {
            this.bookingMessage = 'Booking saved locally. Server confirmation pending.';
            this.cdr.detectChanges();
          });
        }
      } catch {
        this.ngZone.run(() => {
          this.bookingMessage = 'Booking saved locally. Will sync when online.';
          this.cdr.detectChanges();
        });
      }
    } else {
      this.ngZone.run(() => {
        this.bookingMessage = 'Booking saved locally. Log in to sync with server.';
        this.cdr.detectChanges();
      });
    }

    // Refresh truck availability
    this.fetchPublicData();

    this.ngZone.run(() => {
      this.showBookingModal = false;
      this.selectedTruck = null;
      this.cdr.detectChanges();
    });
  }

  // ── Booking: cancel ────────────────────────────────────────
  async cancelBooking(booking: Booking): Promise<void> {
    const token = localStorage.getItem('accessToken');

    // Update status locally
    booking.status = 'cancelled';
    this.updateBookingInStorage(booking);

    // Try to cancel on backend
    if (token && booking.id) {
      try {
        await fetch(`/api/loads/bookings/${booking.id}/`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
      } catch {
        // local update is enough
      }
    }

    // Refresh truck availability
    this.fetchPublicData();
  }

  // ── Bookings list ──────────────────────────────────────────
  toggleMyBookings(): void {
    this.showMyBookings = !this.showMyBookings;
  }

  get activeBookings(): Booking[] {
    return this.myBookings.filter(b => b.status !== 'cancelled' && b.status !== 'completed');
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