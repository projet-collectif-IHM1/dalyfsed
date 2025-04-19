import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ChambreService } from '../Services/chambre.service';
import { HotelService } from '../Services/hotel.service'; // For hotel dropdown
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-chambre-form',
  templateUrl: './chambre-form.component.html',
  styleUrls: ['./chambre-form.component.css']
})
export class ChambreFormComponent implements OnInit {
  chambreForm!: FormGroup;
  isEditMode = false;
  currentId: string | null = null;
  hotels: any[] = []; // For hotel dropdown
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private chambreService: ChambreService,
    private hotelService: HotelService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadHotels(); // Load hotels for dropdown
    
    this.currentId = this.route.snapshot.params['id'];
    this.isEditMode = !!this.currentId;

    if (this.isEditMode) {
      this.loadChambreForEdit();
    }
  }

  private initializeForm(): void {
    this.chambreForm = new FormGroup({
      typeChambre: new FormControl('', Validators.required),
      imageChambre: new FormControl('', Validators.required),
      prixchambre: new FormControl('', [
        Validators.required,
        Validators.min(0)
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

  private loadChambreForEdit(): void {
    this.isLoading = true;
    this.errorMessage = null;
  
    this.chambreService.getChambreById(this.currentId!).subscribe({
      next: (response) => {
        try {
          const chambreData = response;
          if (chambreData) {
            this.chambreForm.patchValue({
              typeChambre: chambreData.typeChambre,
              imageChambre: Array.isArray(chambreData.imageChambre) 
                          ? chambreData.imageChambre.join(', ') 
                          : chambreData.imageChambre || '',
              prixchambre: chambreData.prixchambre || 0,
              hotel_id: chambreData.hotel_id || ''
            });
          } else {
            this.errorMessage = 'Invalid room data received';
            console.error('Invalid room data:', response);
          }
        } catch (error) {
          this.errorMessage = 'Error processing room data';
          console.error('Error processing response:', error);
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load room data';
        console.error('API Error:', err);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.chambreForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    const formData = this.prepareFormData();

    if (this.isEditMode) {
      this.updateChambre(formData);
    } else {
      this.createChambre(formData);
    }
  }

  private prepareFormData(): any {
    const rawData = this.chambreForm.value;
    return {
      ...rawData,
      imageChambre: rawData.imageChambre.split(',').map((url: string) => url.trim())
    };
  }

  private updateChambre(formData: any): void {
    this.isLoading = true;
    this.chambreService.updateChambre(this.currentId!, formData).subscribe({
      next: () => {
        this.router.navigate(['Chambre']);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error updating room:', err);
        this.errorMessage = 'Failed to update room';
        this.isLoading = false;
      }
    });
  }

  private createChambre(formData: any): void {
    this.isLoading = true;
    this.chambreService.createChambre(formData).subscribe({
      next: () => {
        this.router.navigate(['Chambre']);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error creating room:', err);
        this.errorMessage = 'Failed to create room';
        this.isLoading = false;
      }
    });
  }

  private markAllAsTouched(): void {
    Object.values(this.chambreForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  onCancel(): void {
    this.router.navigate(['Chambre']);
  }

  onDelete(): void {
    if (confirm('Are you sure you want to delete this room?')) {
      this.isLoading = true;
      this.chambreService.deleteChambre(this.currentId!).subscribe({
        next: () => {
          this.router.navigate(['Chambre']);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error deleting room:', err);
          this.errorMessage = 'Failed to delete room';
          this.isLoading = false;
        }
      });
    }
  }
}