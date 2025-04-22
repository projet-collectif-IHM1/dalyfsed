import { Component } from '@angular/core';
import { ReservationService } from '../Services/reservation.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';


import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
@Component({
  selector: 'app-reservation-admin',
  templateUrl: './reservation-admin.component.html',
  styleUrls: ['./reservation-admin.component.css']
})
export class ReservationAdminComponent {
  reservations: any[] = [];
  filteredReservations: any[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;
  searchControl = new FormControl('');
  
  // Pagination variables
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;

  constructor(
    private reservationService: ReservationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadReservations();
    
    // Setup search with debounce
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.filterReservations();
        this.currentPage = 1; // Reset to first page when searching
      });
  }

  loadReservations(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.reservationService.getAllReservation().subscribe({
      next: (data) => {
        if (data && data.reservations) {
          this.reservations = data.reservations;
          this.filteredReservations = [...this.reservations];
          this.totalItems = this.reservations.length;
        } else {
          this.errorMessage = 'No reservations found';
          console.error('Unexpected response format:', data);
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load reservations';
        console.error('Error fetching reservations:', error);
        this.isLoading = false;
      }
    });
  }

  filterReservations(): void {
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    this.filteredReservations = this.reservations.filter(reservation => 
      reservation.dateReservation.toLowerCase().includes(searchTerm) ||
      reservation.placesDisponibles.toString().includes(searchTerm) ||
      reservation.dateDepart.toLowerCase().includes(searchTerm) ||
      reservation.dateRetour.toLowerCase().includes(searchTerm) ||
      reservation.typeReservation.toLowerCase().includes(searchTerm)
    );
    this.totalItems = this.filteredReservations.length;
  }

  // Pagination methods
  get paginatedReservations(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredReservations.slice(startIndex, startIndex + this.itemsPerPage);
  }
  getDisplayedRange(): string {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
    return `${start}-${end}`;
  }
  

  changePage(page: number): void {
    this.currentPage = page;
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get pages(): number[] {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = 1;
    let endPage = this.totalPages;
    
    if (this.totalPages > maxVisiblePages) {
      const half = Math.floor(maxVisiblePages / 2);
      startPage = Math.max(1, this.currentPage - half);
      endPage = startPage + maxVisiblePages - 1;
      
      if (endPage > this.totalPages) {
        endPage = this.totalPages;
        startPage = endPage - maxVisiblePages + 1;
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  delete(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      height: '400px',
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.reservationService.deleteReservation(id).subscribe({
          next: () => {
            // Remove from local arrays
            this.reservations = this.reservations.filter(r => r.id !== id);
            this.filteredReservations = this.filteredReservations.filter(r => r.id !== id);
            this.totalItems = this.filteredReservations.length;
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error deleting reservation:', error);
            this.isLoading = false;
          }
        });
      }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  }
}




