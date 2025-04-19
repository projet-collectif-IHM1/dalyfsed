import { Component, OnInit } from '@angular/core';
import { ChambreService } from '../Services/chambre.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chambre',
  templateUrl: './chambre.component.html',
  styleUrls: ['./chambre.component.css']
})
export class ChambreComponent implements OnInit {
  chambers: any[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(
    private chambreService: ChambreService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadChambres();  // Renamed from loadHotels to be more specific
  }

  loadChambres(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.chambreService.getAllChambre().subscribe({
      next: (response) => {
        if (response?.chambres) {  // Corrected property name from 'chabers' to 'chambres'
          this.chambers = response.chambres;
        } else {
          this.errorMessage = 'No chambers found';
          console.warn('Unexpected response format:', response);
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load chambers. Please try again.';
        console.error('Error fetching chambers:', error);
        this.isLoading = false;
      }
    });
  }

  delete(chambreId: string): void {
    if (!chambreId) {
      console.error('Invalid chamber ID');
      return;
    }

    // Optional: Add confirmation dialog
    const confirmDelete = confirm('Are you sure you want to delete this chamber?');
    if (!confirmDelete) return;

    this.isLoading = true;
    this.chambreService.deleteChambre(chambreId).subscribe({
      next: () => {
        this.loadChambres(); // Refresh the list
      },
      error: (error) => {
        this.errorMessage = 'Failed to delete chamber';
        console.error('Delete error:', error);
        this.isLoading = false;
      }
    });
  }
}