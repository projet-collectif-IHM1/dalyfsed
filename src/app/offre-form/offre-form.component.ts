import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { HotelService } from '../Services/hotel.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OffreService } from '../Services/offre.service';
@Component({
  selector: 'app-offre-form',
  templateUrl: './offre-form.component.html',
  styleUrls: ['./offre-form.component.css']
})
export class OffreFormComponent {
  offerForm!: FormGroup;
  isEditMode = false;
  currentId: string | null = null;
  hotels: any[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private offerService: OffreService,
    private hotelService: HotelService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadHotels();
    
    this.currentId = this.route.snapshot.params['id'];
    this.isEditMode = !!this.currentId;

    if (this.isEditMode) {
      this.loadOfferForEdit();
    }
  }

  private initializeForm(): void {
    this.offerForm = new FormGroup({
      prixParNuit: new FormControl('', [
        Validators.required,
        Validators.min(0)
      ]),
      promotion: new FormControl('', [
        Validators.required,
        Validators.min(0),
        Validators.max(100)
      ]),
      hotel_id: new FormControl('', Validators.required)
    });
  }

  private loadHotels(): void {
    this.isLoading = true;
    this.hotelService.GetAllHotel().subscribe({
      next: (response) => {
        this.hotels = response.hotels || response;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading hotels:', err);
        this.errorMessage = 'Failed to load hotels. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  private loadOfferForEdit(): void {
    this.isLoading = true;
    this.errorMessage = null;
  
    this.offerService.getOfferById(this.currentId!).subscribe({
      next: (response) => {
        try {
          const offerData = response;
          if (offerData) {
            this.offerForm.patchValue({
              prixParNuit: offerData.prixParNuit || 0,
              promotion: offerData.promotion || 0,
              hotel_id: offerData.hotel_id || ''
            });
          } else {
            this.errorMessage = 'Invalid offer data received';
            console.error('Invalid offer data:', response);
          }
        } catch (error) {
          this.errorMessage = 'Error processing offer data';
          console.error('Error processing response:', error);
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load offer data';
        console.error('API Error:', err);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.offerForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    const formData = this.offerForm.value;

    if (this.isEditMode) {
      this.updateOffer(formData);
    } else {
      this.createOffer(formData);
    }
  }

  private updateOffer(formData: any): void {
    this.isLoading = true;
    this.offerService.updateOffer(this.currentId!, formData).subscribe({
      next: () => {
        this.router.navigate(['Offer']);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error updating offer:', err);
        this.errorMessage = 'Failed to update offer';
        this.isLoading = false;
      }
    });
  }

  private createOffer(formData: any): void {
    this.isLoading = true;
    this.offerService.createOffer(formData).subscribe({
      next: () => {
        this.router.navigate(['Offer']);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error creating offer:', err);
        this.errorMessage = 'Failed to create offer';
        this.isLoading = false;
      }
    });
  }

  private markAllAsTouched(): void {
    Object.values(this.offerForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  onCancel(): void {
    this.router.navigate(['Offer']);
  }

  onDelete(): void {
    if (confirm('Are you sure you want to delete this offer?')) {
      this.isLoading = true;
      this.offerService.deleateOffer(this.currentId!).subscribe({
        next: () => {
          this.router.navigate(['Offer']);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error deleting offer:', err);
          this.errorMessage = 'Failed to delete offer';
          this.isLoading = false;
        }
      });
    }
  }
}
