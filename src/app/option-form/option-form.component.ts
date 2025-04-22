import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OptionService } from '../Services/option.service';
import { ChambreService } from '../Services/chambre.service';
import { HotelService } from '../Services/hotel.service';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';

interface ChambreWithHotel {
  id: string;
  typeChambre: string;
  prixchambre: number;
  hotel_id: string;
  hotel?: {
    id: string;
    nomHotel: string;
  };
}

@Component({
  selector: 'app-option-form',
  templateUrl: './option-form.component.html',
  styleUrls: ['./option-form.component.css']
})
export class OptionFormComponent implements OnInit {
  optionForm!: FormGroup;
  isEditMode = false;
  currentId: string | null = null;
  chambres: ChambreWithHotel[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private optionService: OptionService,
    private chambreService: ChambreService,
    private hotelService: HotelService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadChambresWithHotels();
    
    this.currentId = this.route.snapshot.params['id'];
    this.isEditMode = !!this.currentId;

    if (this.isEditMode) {
      this.loadOptionForEdit();
    }
  }

  private initializeForm(): void {
    this.optionForm = new FormGroup({
      typeOption: new FormControl('', Validators.required),
      percent: new FormControl('', [
        Validators.required,
        Validators.min(0),
        Validators.max(100)
      ]),
      chambre_id: new FormControl('', Validators.required)
    });
  }

  private loadChambresWithHotels(): void {
    this.isLoading = true;
    
    forkJoin([
      this.chambreService.getAllChambre(),
      this.hotelService.GetAllHotel()
    ]).subscribe({
      next: ([chambresResponse, hotelsResponse]) => {
        const chambres = chambresResponse.chambres || chambresResponse;
        const hotels = hotelsResponse.hotels || hotelsResponse;
        
        this.chambres = chambres.map((chambre: ChambreWithHotel) => {
          const hotel = hotels.find((h: { id: string }) => h.id === chambre.hotel_id);
          return {
            ...chambre,
            hotel: hotel || undefined
          };
        });
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading data:', err);
        this.errorMessage = 'Failed to load data. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  private loadOptionForEdit(): void {
    this.isLoading = true;
    this.errorMessage = null;
  
    this.optionService.getOptionById(this.currentId!).subscribe({
      next: (response) => {
        try {
          const optionData = response;
          if (optionData) {
            this.optionForm.patchValue({
              typeOption: optionData.typeOption,
              percent: optionData.percent || 0,
              chambre_id: optionData.chambre_id || ''
            });
          } else {
            this.errorMessage = 'Invalid option data received';
            console.error('Invalid option data:', response);
          }
        } catch (error) {
          this.errorMessage = 'Error processing option data';
          console.error('Error processing response:', error);
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load option data';
        console.error('API Error:', err);
        this.isLoading = false;
      }
    });
  }

  getCurrentChambreHotel(): string {
    const chambreId = this.optionForm.get('chambre_id')?.value;
    if (!chambreId) return 'Not selected';
    
    const chambre = this.chambres.find(c => c.id === chambreId);
    return chambre?.hotel?.nomHotel || 'No hotel information';
  }

  onSubmit(): void {
    if (this.optionForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    const formData = this.optionForm.value;

    if (this.isEditMode) {
      this.updateOption(formData);
    } else {
      this.createOption(formData);
    }
  }

  private updateOption(formData: any): void {
    this.isLoading = true;
    this.optionService.updateOption(this.currentId!, formData).subscribe({
      next: () => {
        this.router.navigate(['Option']);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error updating option:', err);
        this.errorMessage = 'Failed to update option';
        this.isLoading = false;
      }
    });
  }

  private createOption(formData: any): void {
    this.isLoading = true;
    this.optionService.createOption(formData).subscribe({
      next: () => {
        this.router.navigate(['Option']);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error creating option:', err);
        this.errorMessage = 'Failed to create option';
        this.isLoading = false;
      }
    });
  }

  private markAllAsTouched(): void {
    Object.values(this.optionForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  onCancel(): void {
    this.router.navigate(['Option']);
  }

  onDelete(): void {
    if (confirm('Are you sure you want to delete this option?')) {
      this.isLoading = true;
      this.optionService.deleteOption(this.currentId!).subscribe({
        next: () => {
          this.router.navigate(['Option']);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error deleting option:', err);
          this.errorMessage = 'Failed to delete option';
          this.isLoading = false;
        }
      });
    }
  }
}