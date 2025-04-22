// home.component.ts
import { Component, OnInit } from '@angular/core';
import { PayeService } from '../Services/paye.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-home',
  templateUrl: './paye-admin.component.html',
  styleUrls: ['./paye-admin.component.css']
})
export class PayeAdminComponent implements OnInit {
  paye: any[] = [];
  filteredPaye: any[] = [];
  isLoading: boolean = true;
  newPaye: any = {};
  searchControl = new FormControl('');
  
  // Pagination variables
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;

  constructor(
    private payeService: PayeService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadPaye();
    
    // Setup search with debounce
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.filterPaye();
        this.currentPage = 1; // Reset to first page when searching
      });
  }

  loadPaye(): void {
    this.isLoading = true;
    this.payeService.getAllPaye().subscribe(
      (response) => {
        this.paye = response.payes;
        this.filteredPaye = [...this.paye];
        this.totalItems = this.paye.length;
        this.isLoading = false;
      },
      (error) => {
        console.error("Error loading payes:", error);
        this.isLoading = false;
      }
    );
  }

  filterPaye(): void {
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    this.filteredPaye = this.paye.filter(p => 
      p.nompaye.toLowerCase().includes(searchTerm)
    );
    this.totalItems = this.filteredPaye.length;
  }

  // Pagination methods
  get paginatedPaye(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredPaye.slice(startIndex, startIndex + this.itemsPerPage);
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
  // In your component class
getDisplayedRange(): string {
  const start = (this.currentPage - 1) * this.itemsPerPage + 1;
  const end = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
  return `${start}-${end}`;
}

  delete(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      height: '400px',
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.payeService.deletePaye(id).subscribe(
          () => {
            this.loadPaye();
          },
          (error) => {
            console.error('Error deleting paye:', error);
          }
        );
      }
    });
  }
}