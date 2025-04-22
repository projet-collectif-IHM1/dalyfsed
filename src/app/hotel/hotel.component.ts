import { Component, Inject, OnInit } from '@angular/core';
import { ServiceClientService } from '../Services/service-client.service';
import { HotelService } from '../Services/hotel.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-hotel',
  templateUrl: './hotel.component.html',
  styleUrls: ['./hotel.component.css']
})
export class HotelComponent implements OnInit {

  hotels: any[] = [];
  filteredHotels: any[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;
  searchControl = new FormControl('');
  
  // Pagination variables
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;

  constructor(
    private hotelService: HotelService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadHotels();
    
    // Setup search with debounce
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.filterHotels();
        this.currentPage = 1; // Reset to first page when searching
      });
  }

  loadHotels(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.hotelService.GetAllHotel().subscribe({
      next: (data: any) => {
        if (data && data.hotels) {
          this.hotels = data.hotels;
          this.filteredHotels = [...this.hotels];
          this.totalItems = this.hotels.length;
        } else {
          this.errorMessage = 'No hotels found';
          console.error('No hotels data found in response');
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load hotels. Please try again.';
        console.error('Error fetching hotels:', error);
        this.isLoading = false;
      }
    });
  }

  filterHotels(): void {
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    this.filteredHotels = this.hotels.filter(hotel => 
      hotel.nomHotel.toLowerCase().includes(searchTerm) ||
      hotel.adresse.toLowerCase().includes(searchTerm) ||
      hotel.classement.toString().includes(searchTerm) ||
      hotel.hebergement.toLowerCase().includes(searchTerm) ||
      hotel.restauration.toLowerCase().includes(searchTerm) ||
      hotel.activites.toLowerCase().includes(searchTerm)
    );
    this.totalItems = this.filteredHotels.length;
  }

  // Pagination methods
  get paginatedHotels(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredHotels.slice(startIndex, startIndex + this.itemsPerPage);
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
  getDisplayedRange(): string {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
    return `${start}-${end}`;
  }

  delete(hotelId: string): void {
    if (!hotelId) {
      console.error('Hotel ID is undefined');
      return;
    }

    const confirmDelete = confirm('Are you sure you want to delete this hotel?');
    if (!confirmDelete) return;

    this.isLoading = true;
    this.hotelService.deleteHotel(hotelId).subscribe({
      next: () => {
        this.loadHotels();
      },
      error: (error) => {
        this.errorMessage = 'Failed to delete hotel';
        console.error('Error deleting hotel:', error);
        this.isLoading = false;
      }
    });
  }
  
}
