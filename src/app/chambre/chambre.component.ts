import { Component, OnInit } from '@angular/core';
import { ChambreService } from '../Services/chambre.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-chambre',
  templateUrl: './chambre.component.html',
  styleUrls: ['./chambre.component.css']
})
export class ChambreComponent implements OnInit {
  chambers: any[] = [];
  filteredChambres: any[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;
  searchControl = new FormControl('');
  
  // Pagination variables
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;

  constructor(
    private chambreService: ChambreService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadChambres();
    
    // Setup search with debounce
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.filterChambres();
        this.currentPage = 1; // Reset to first page when searching
      });
  }

  loadChambres(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.chambreService.getAllChambre().subscribe({
      next: (response) => {
        if (response?.chambres) {
          this.chambers = response.chambres;
          this.filteredChambres = [...this.chambers];
          this.totalItems = this.chambers.length;
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

  filterChambres(): void {
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    this.filteredChambres = this.chambers.filter(c => 
      c.typeChambre.toLowerCase().includes(searchTerm) ||
      c.prixchambre.toString().includes(searchTerm)
    );
    this.totalItems = this.filteredChambres.length;
  }

  // Pagination methods
  get paginatedChambres(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredChambres.slice(startIndex, startIndex + this.itemsPerPage);
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

  delete(chambreId: string): void {
    if (!chambreId) {
      console.error('Invalid chamber ID');
      return;
    }

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