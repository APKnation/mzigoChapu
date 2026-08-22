import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Load {
  id: number;
  pickup_location: string;
  dropoff_location: string;
  weight_kg: number;
  description: string;
  created_at: string;
  status: string;
}

// Tanzania regions and their towns
const TZ_LOCATIONS: Record<string, string[]> = {
  'Dar es Salaam': ['Kinondoni', 'Ilala', 'Temeke', 'Ubungo', 'Kigamboni'],
  'Dodoma': ['Dodoma City', 'Kondoa', 'Kongwa', 'Chamwino'],
  'Mwanza': ['Mwanza City', 'Ilemela', 'Nyamagana', 'Misungwi', 'Kwimba'],
  'Arusha': ['Arusha City', 'Moshi', 'Karatu', 'Ngorongoro', 'Monduli'],
  'Mbeya': ['Mbeya City', 'Chunya', 'Kyela', 'Rungwe', 'Mbarali'],
  'Tanga': ['Tanga City', 'Pangani', 'Mkinga', 'Kilindi'],
  'Morogoro': ['Morogoro City', 'Kilosa', 'Mvomero', 'Ulanga'],
  'Iringa': ['Iringa City', 'Kilolo', 'Mufindi', 'Ludewa'],
  'Mara': ['Musoma', 'Tarime', 'Rorya', 'Bunda'],
  'Kagera': ['Bukoba', 'Karagwe', 'Muleba', 'Ngara'],
  'Ruvuma': ['Songea', 'Tunduru', 'Nyasa', 'Namtumbo'],
  'Lindi': ['Lindi City', 'Kilwa', 'Nachingwea', 'Ruangwa'],
  'Mtwara': ['Mtwara City', 'Masasi', 'Nanyumbu', 'Newala'],
  'Singida': ['Singida City', 'Manyoni', 'Ikungi'],
  'Tabora': ['Tabora City', 'Igunga', 'Nzega', 'Sikonge'],
  'Rukwa': ['Sumbawanga', 'Nkasi', 'Kalambo'],
  'Kigoma': ['Kigoma City', 'Kasulu', 'Kibondo', 'Buhigwe'],
};

const WEIGHT_RANGES = [
  { label: 'Small (up to 500 kg)', value: 250 },
  { label: 'Medium (500 – 2,000 kg)', value: 1250 },
  { label: 'Large (2,000 – 5,000 kg)', value: 3500 },
  { label: 'Heavy (5,000 – 15,000 kg)', value: 10000 },
  { label: 'Extra Heavy (15,000+ kg)', value: 20000 },
];

const CARGO_TYPES = [
  'Agricultural produce (grains, maize, rice)',
  'Fresh produce (fruits, vegetables)',
  'Livestock / animals',
  'Building materials (cement, bricks, sand)',
  'Fuel / petroleum products',
  'Electronics / appliances',
  'Household goods / furniture',
  'Industrial equipment / machinery',
  'Textiles / clothing',
  'Beverages / bottled goods',
  'Other general goods',
];

const BID_AMOUNTS = [
  { label: 'TSh 50,000', value: 50000 },
  { label: 'TSh 100,000', value: 100000 },
  { label: 'TSh 150,000', value: 150000 },
  { label: 'TSh 200,000', value: 200000 },
  { label: 'TSh 300,000', value: 300000 },
  { label: 'TSh 500,000', value: 500000 },
  { label: 'TSh 750,000', value: 750000 },
  { label: 'TSh 1,000,000', value: 1000000 },
  { label: 'TSh 1,500,000', value: 1500000 },
  { label: 'TSh 2,000,000', value: 2000000 },
];

@Component({
  selector: 'app-cargo',
  imports: [CommonModule, FormsModule],
  templateUrl: './cargo.html',
  styleUrls: ['./cargo.css'],
})
export class Cargo implements OnInit {
  // ── Region / Town selection ──────────────────────────────────
  regions = Object.keys(TZ_LOCATIONS);
  weightRanges = WEIGHT_RANGES;
  cargoTypes = CARGO_TYPES;
  bidAmounts = BID_AMOUNTS;

  pickupRegion = '';
  dropoffRegion = '';
  pickupTowns: string[] = [];
  dropoffTowns: string[] = [];

  loadDetails = {
    pickup_location: '',
    dropoff_location: '',
    weight_kg: null as number | null,
    description: '',
  };

  postMessage = '';
  postError = '';

  // ── Available Loads ──────────────────────────────────────────
  loads: Load[] = [];
  loadingLoads = true;
  loadsError = '';

  // ── Bid ──────────────────────────────────────────────────────
  selectedLoadId: number | null = null;
  bidAmount: number | null = null;
  bidMessage = '';
  bidError = '';

  userRole: string | null = null;

  constructor() {}

  ngOnInit(): void {
    this.userRole = localStorage.getItem('userRole');
    this.fetchLoads();
  }

  // ── Region → Town cascade ────────────────────────────────────
  onPickupRegionChange(): void {
    this.pickupTowns = TZ_LOCATIONS[this.pickupRegion] || [];
    this.loadDetails.pickup_location = '';
  }

  onDropoffRegionChange(): void {
    this.dropoffTowns = TZ_LOCATIONS[this.dropoffRegion] || [];
    this.loadDetails.dropoff_location = '';
  }

  // ── Fetch loads ──────────────────────────────────────────────
  async fetchLoads(): Promise<void> {
    this.loadingLoads = true;
    this.loadsError = '';
    const token = localStorage.getItem('accessToken');
    if (!token) {
      this.loadsError = 'Please log in to view loads.';
      this.loadingLoads = false;
      return;
    }
    try {
      const res = await fetch('http://localhost:8000/api/loads/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed');
      this.loads = await res.json() || [];
    } catch {
      this.loadsError = 'Failed to fetch loads. Please try again.';
    } finally {
      this.loadingLoads = false;
    }
  }

  // ── Post load ────────────────────────────────────────────────
  async onPostLoadSubmit(): Promise<void> {
    this.postMessage = '';
    this.postError = '';
    const token = localStorage.getItem('accessToken');
    if (!token) { this.postError = 'Please log in first.'; return; }
    if (!this.loadDetails.pickup_location || !this.loadDetails.dropoff_location || !this.loadDetails.weight_kg) {
      this.postError = 'Please complete all required fields.';
      return;
    }
    try {
      const res = await fetch('http://localhost:8000/api/loads/', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(this.loadDetails)
      });
      if (!res.ok) throw new Error('Failed');
      this.postMessage = 'Load posted successfully!';
      this.loadDetails = { pickup_location: '', dropoff_location: '', weight_kg: null, description: '' };
      this.pickupRegion = '';
      this.dropoffRegion = '';
      this.pickupTowns = [];
      this.dropoffTowns = [];
      this.fetchLoads();
    } catch {
      this.postError = 'Failed to post load. Please try again.';
    }
  }

  // ── Place bid ────────────────────────────────────────────────
  async onPlaceBid(loadId: number): Promise<void> {
    this.bidMessage = '';
    this.bidError = '';
    this.selectedLoadId = loadId;
  }

  async onBidSubmit(): Promise<void> {
    this.bidMessage = '';
    this.bidError = '';
    const token = localStorage.getItem('accessToken');
    if (!token) { this.bidError = 'Please log in first.'; return; }
    if (!this.selectedLoadId || !this.bidAmount) { this.bidError = 'Select a load and bid amount.'; return; }
    try {
      const res = await fetch(`http://localhost:8000/api/loads/${this.selectedLoadId}/bid/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: this.bidAmount })
      });
      if (!res.ok) throw new Error('Failed');
      this.bidMessage = 'Bid placed successfully!';
      this.selectedLoadId = null;
      this.bidAmount = null;
    } catch {
      this.bidError = 'Failed to place bid. Please try again.';
    }
  }

  cancelBid(): void {
    this.selectedLoadId = null;
    this.bidAmount = null;
    this.bidError = '';
  }

  getSelectedLoad(): Load | undefined {
    return this.loads.find(l => l.id === this.selectedLoadId);
  }
}