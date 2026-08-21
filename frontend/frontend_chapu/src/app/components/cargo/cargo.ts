import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Load {
  id: number;
  pickup_location: string;
  dropoff_location: string;
  weight_kg: number;
  description: string;
  created_at: string;
}

@Component({
  selector: 'app-cargo',
  imports: [CommonModule, FormsModule],
  templateUrl: './cargo.html',
  styleUrls: ['./cargo.css'],
})
export class Cargo implements OnInit {
  // Load Posting Data
  loadDetails = {
    pickup_location: '',
    dropoff_location: '',
    weight_kg: null as number | null,
    description: '',
  };
  postMessage = '';
  postError = '';

  // Available Loads Data
  loads: Load[] = [];
  loadingLoads = true;
  loadsError = '';

  userRole: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.userRole = localStorage.getItem('userRole');
    this.fetchLoads();
  }

  async fetchLoads(): Promise<void> {
    this.loadingLoads = true;
    this.loadsError = '';
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      this.loadsError = 'Authentication token not found. Please log in.';
      this.loadingLoads = false;
      return;
    }

    try {
      const response = await this.http.get<Load[]>('/api/loads/', {
        headers: { Authorization: `Bearer ${token}` },
      }).toPromise();
      
      this.loads = response || [];
      this.loadingLoads = false;
    } catch (error) {
      console.error('Error fetching loads:', error);
      this.loadsError = 'Failed to fetch loads. Please try again.';
      this.loadingLoads = false;
    }
  }

  async onPostLoadSubmit(): Promise<void> {
    this.postMessage = '';
    this.postError = '';
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      this.postError = 'Authentication token not found. Please log in.';
      return;
    }

    if (!this.loadDetails.pickup_location || !this.loadDetails.dropoff_location || !this.loadDetails.weight_kg) {
      this.postError = 'Please fill in all required fields.';
      return;
    }

    try {
      await this.http.post('/api/loads/', this.loadDetails, {
        headers: { Authorization: `Bearer ${token}` },
      }).toPromise();
      
      this.postMessage = 'Load posted successfully!';
      this.loadDetails = { pickup_location: '', dropoff_location: '', weight_kg: null, description: '' };
      this.fetchLoads();
    } catch (error) {
      console.error('Error posting load:', error);
      this.postError = 'Failed to post load. Please try again.';
    }
  }
}