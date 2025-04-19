import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HotelService } from '../Services/hotel.service';
import { PayeService } from '../Services/paye.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-hotel-form',
  templateUrl: './hotel-form.component.html',
  styleUrls: ['./hotel-form.component.css']
})
export class HotelFormComponent implements OnInit {
  hotelForm!: FormGroup;
  isEditMode = false;
  currentId: string | null = null;
  countries: any[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private hotelService: HotelService,
    private payeService: PayeService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadCountries();
    
    this.currentId = this.route.snapshot.params['id'];
    this.isEditMode = !!this.currentId;

    if (this.isEditMode) {
      this.loadHotelForEdit();
    }
  }

  private initializeForm(): void {
    this.hotelForm = new FormGroup({
      nomHotel: new FormControl('', Validators.required),
      imageHotel: new FormControl('', Validators.required),
      adresse: new FormControl('', Validators.required),
      classement: new FormControl('', [
        Validators.required, 
        Validators.min(1), 
        Validators.max(5)
      ]),
      hebergement: new FormControl('', Validators.required),
      restauration: new FormControl('', Validators.required),
      activites: new FormControl('', Validators.required),
      paye_id: new FormControl('', Validators.required)
    });
  }

  private loadCountries(): void {
    this.isLoading = true;
    this.payeService.getAllPaye().subscribe({
      next: (response) => {
        this.countries = response.payes || response;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading countries:', err);
        this.errorMessage = 'Failed to load countries. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  private loadHotelForEdit(): void {
    this.isLoading = true;
    this.errorMessage = null;
  
    this.hotelService.getHotelById(this.currentId!).subscribe({
      next: (response) => {
        try {
          const hotelData = response; // Direct response or response.hotel depending on your API
          if (hotelData) {
            this.hotelForm.patchValue({
              nomHotel: hotelData.nomHotel,
              imageHotel: Array.isArray(hotelData.imageHotel) 
                        ? hotelData.imageHotel.join(', ') 
                        : hotelData.imageHotel || '',
              adresse: hotelData.adresse || '',
              classement: hotelData.classement || 1,
              hebergement: hotelData.hebergement || '',
              restauration: hotelData.restauration || '',
              activites: hotelData.activites || '',
              paye_id: hotelData.paye_id || ''
            });
          } else {
            this.errorMessage = 'Invalid hotel data received';
            console.error('Invalid hotel data:', response);
          }
        } catch (error) {
          this.errorMessage = 'Error processing hotel data';
          console.error('Error processing response:', error);
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load hotel data';
        console.error('API Error:', err);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.hotelForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    const formData = this.prepareFormData();

    if (this.isEditMode) {
      this.updateHotel(formData);
    } else {
      this.createHotel(formData);
    }
  }

  private prepareFormData(): any {
    const rawData = this.hotelForm.value;
    return {
      ...rawData,
      imageHotel: rawData.imageHotel.split(',').map((url: string) => url.trim()),
      
    };
  }

  private updateHotel(formData: any): void {
    this.isLoading = true;
    this.hotelService.updateHotel(this.currentId!, formData).subscribe({
      next: () => {
        this.router.navigate(['Hotel']); // Changed from 'Hotel'
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error updating hotel:', err);
        this.errorMessage = 'Failed to update hotel';
        this.isLoading = false;
      }
    });
  }

  private createHotel(formData: any): void {
    this.isLoading = true;
    this.hotelService.createHotel(formData).subscribe({
      next: () => {
        this.router.navigate(['Hotel']); // Changed from 'Hotel'
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error creating hotel:', err);
        this.errorMessage = 'Failed to create hotel';
        this.isLoading = false;
      }
    });
  }

  private markAllAsTouched(): void {
    Object.values(this.hotelForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  onCancel(): void {
    this.router.navigate(['Hotel']); // Changed from '/hotels'
  }

  onDelete(): void {
    if (confirm('Are you sure you want to delete this hotel?')) {
      this.isLoading = true;
      this.hotelService.deleteHotel(this.currentId!).subscribe({
        next: () => {
          this.router.navigate(['Hotel']); // Changed from '/hotels'
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error deleting hotel:', err);
          this.errorMessage = 'Failed to delete hotel';
          this.isLoading = false;
        }
      });
    }
  }
}