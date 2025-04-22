import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { OptionService } from '../Services/option.service';

@Component({
  selector: 'app-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.css']
})
export class OptionComponent implements OnInit {
  options: any[] = [];
  filteredOptions: any[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;
  searchControl = new FormControl('');
  
  // Pagination variables
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;

  constructor(
    private optionService: OptionService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOptions();
    
    // Setup search with debounce
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.filterOptions();
        this.currentPage = 1; // Reset to first page when searching
      });
  }

  loadOptions(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.optionService.getAllOptions().subscribe({
      next: (response) => {
        if (response) {
          this.options = Array.isArray(response) ? response : response.options || [];
          this.filteredOptions = [...this.options];
          this.totalItems = this.options.length;
        } else {
          this.errorMessage = 'No options found';
          console.warn('Unexpected response format:', response);
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load options. Please try again.';
        console.error('Error fetching options:', error);
        this.isLoading = false;
      }
    });
  }

  filterOptions(): void {
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    this.filteredOptions = this.options.filter(o => 
      o.typeOption.toLowerCase().includes(searchTerm) ||
      o.percent.toString().includes(searchTerm) ||
      o.chambre_id.toLowerCase().includes(searchTerm)
    );
    this.totalItems = this.filteredOptions.length;
  }

  // Pagination methods
  get paginatedOptions(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredOptions.slice(startIndex, startIndex + this.itemsPerPage);
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

  delete(optionId: string): void {
    if (!optionId) {
      console.error('Invalid option ID');
      return;
    }

    const confirmDelete = confirm('Are you sure you want to delete this option?');
    if (!confirmDelete) return;

    this.isLoading = true;
    this.optionService.deleteOption(optionId).subscribe({
      next: () => {
        this.loadOptions(); // Refresh the list
      },
      error: (error) => {
        this.errorMessage = 'Failed to delete option';
        console.error('Delete error:', error);
        this.isLoading = false;
      }
    });
  }
}