import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReservationService } from '../Services/reservation.service';
import { HotelService } from '../Services/hotel.service';
import { ChambreService } from '../Services/chambre.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.css']
})
export class ReservationFormComponent implements OnInit {
  reservationForm!: FormGroup;
  isEditMode = false;
  currentId: string | null = null;
  hotels: any[] = [];
  rooms: any[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private reservationService: ReservationService,
    private hotelService: HotelService,
    private chambreService: ChambreService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadHotels();
    this.loadRooms();
    
    this.currentId = this.route.snapshot.params['id'];
    this.isEditMode = !!this.currentId;

    if (this.isEditMode) {
      this.loadReservationForEdit();
    }

    // Load rooms when hotel selection changes
    this.reservationForm.get('hotel_id')?.valueChanges.subscribe(hotelId => {
      if (hotelId) {
        this.loadRoomsByHotel(hotelId);
      } else {
        this.loadRooms();
      }
    });
  }

  private initializeForm(): void {
    this.reservationForm = new FormGroup({
      dateReservation: new FormControl('', Validators.required),
      placesDisponibles: new FormControl('', [
        Validators.required,
        Validators.min(1)
      ]),
      dateDepart: new FormControl('', Validators.required),
      dateRetour: new FormControl('', Validators.required),
      typeReservation: new FormControl('', Validators.required),
      hotel_id: new FormControl('', Validators.required),
      chambre_id: new FormControl('', Validators.required)
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

  private loadRooms(): void {
    this.isLoading = true;
    this.chambreService.getAllChambre().subscribe({
      next: (response) => {
        this.rooms = response.chambres || response;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading rooms:', err);
        this.errorMessage = 'Failed to load rooms. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  private loadRoomsByHotel(hotelId: string): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.chambreService.getChambreByHotelId(hotelId).subscribe({
      next: (response) => {
        try {
          // Handle the response structure from your FastAPI endpoint
          if (response && response.chambres) {
            this.rooms = response.chambres;
          } else if (Array.isArray(response)) {
            // Fallback in case the response is just an array
            this.rooms = response;
          } else {
            this.rooms = [];
            console.warn('Unexpected response format:', response);
          }
          
          // Reset room selection when hotel changes
          this.reservationForm.patchValue({ chambre_id: '' });
        } catch (error) {
          console.error('Error processing response:', error);
          this.errorMessage = 'Error processing room data';
          this.rooms = [];
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('API Error:', err);
        if (err.status === 404) {
          this.errorMessage = 'No rooms found for this hotel';
        } else {
          this.errorMessage = 'Failed to load rooms. Please try again.';
        }
        this.rooms = [];
        this.reservationForm.patchValue({ chambre_id: '' });
        this.isLoading = false;
      }
    });
  }
  private loadReservationForEdit(): void {
    this.isLoading = true;
    this.errorMessage = null;
  
    this.reservationService.getReservationById(this.currentId!).subscribe({
      next: (response) => {
        try {
          const reservationData = response;
          if (reservationData) {
            this.reservationForm.patchValue({
              dateReservation: reservationData.dateReservation,
              placesDisponibles: reservationData.placesDisponibles || 1,
              dateDepart: reservationData.dateDepart,
              dateRetour: reservationData.dateRetour,
              typeReservation: reservationData.typeReservation || '',
              hotel_id: reservationData.hotel_id || '',
              chambre_id: reservationData.chambre_id || ''
            });

            // Load rooms for the selected hotel
            if (reservationData.hotel_id) {
              this.loadRoomsByHotel(reservationData.hotel_id);
            }
          } else {
            this.errorMessage = 'Invalid reservation data received';
            console.error('Invalid reservation data:', response);
          }
        } catch (error) {
          this.errorMessage = 'Error processing reservation data';
          console.error('Error processing response:', error);
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load reservation data';
        console.error('API Error:', err);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.reservationForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    const formData = this.reservationForm.value;

    if (this.isEditMode) {
      this.updateReservation(formData);
    } else {
      this.createReservation(formData);
    }
  }

  private updateReservation(formData: any): void {
    this.isLoading = true;
    this.reservationService.upadateReservation(this.currentId!, formData).subscribe({
      next: () => {
        this.router.navigate(['Reservation']);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error updating reservation:', err);
        this.errorMessage = 'Failed to update reservation';
        this.isLoading = false;
      }
    });
  }

  private createReservation(formData: any): void {
    this.isLoading = true;
    this.reservationService.createReservation(formData).subscribe({
      next: () => {
        this.router.navigate(['Reservation']);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error creating reservation:', err);
        this.errorMessage = 'Failed to create reservation';
        this.isLoading = false;
      }
    });
  }

  private markAllAsTouched(): void {
    Object.values(this.reservationForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  onCancel(): void {
    this.router.navigate(['Reservation']);
  }

  onDelete(): void {
    if (confirm('Are you sure you want to delete this reservation?')) {
      this.isLoading = true;
      this.reservationService.deleteReservation(this.currentId!).subscribe({
        next: () => {
          this.router.navigate(['Reservation']);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error deleting reservation:', err);
          this.errorMessage = 'Failed to delete reservation';
          this.isLoading = false;
        }
      });
    }
  }
}