import { Component } from '@angular/core';

import { AvisService } from '../Services/avis.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UserService } from '../Services/user.service';

@Component({
  selector: 'app-avis-admin',
  templateUrl: './avis-admin.component.html',
  styleUrls: ['./avis-admin.component.css']
})
export class AvisAdminComponent {
  avisList: any[] = [];
  filteredAvis: any[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;
  userMap: Map<string, string> = new Map();
  searchControl = new FormControl('');

  // Pagination variables
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;

  constructor(
    private avisService: AvisService,
    private userService: UserService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers().then(() => {
      this.loadAvis();
    });

    // Setup search with debounce
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.filterAvis();
        this.currentPage = 1; // Reset to first page when searching
      });
  }

  loadUsers(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.userService.getAllUsers().subscribe({
        next: (response: any) => {
          const users = response?.data || response?.users || response;

          if (Array.isArray(users)) {
            users.forEach((user: any) => {
              this.userMap.set(user.id, user.name || user.username || user.email || `User ${user.id}`);
            });
          }
          resolve();
        },
        error: (err) => {
          console.error('Failed to load users', err);
          resolve();
        }
      });
    });
  }

  loadAvis(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.avisService.getAllAvis().subscribe({
      next: (response: any) => {
        const avisData = response?.data || response?.avis || response;

        if (Array.isArray(avisData)) {
          this.avisList = avisData.map((avis: any) => ({
            ...avis,
            userName: this.userMap.get(avis.user_id) || `User ${avis.user_id}`
          }));
          this.filteredAvis = [...this.avisList];
          this.totalItems = this.avisList.length;
        } else {
          this.errorMessage = 'No reviews found';
          console.warn('Unexpected response format:', response);
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load reviews. Please try again.';
        console.error('Error fetching reviews:', error);
        this.isLoading = false;
      }
    });
  }

  filterAvis(): void {
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    this.filteredAvis = this.avisList.filter(avis => {
      const commentaire = avis.commentaire?.toLowerCase() || '';
      const userName = avis.userName?.toLowerCase() || '';
      const reservationId = avis.reservation_id?.toString() || '';
      const note = avis.note?.toString() || '';

      return (
        commentaire.includes(searchTerm) ||
        userName.includes(searchTerm) ||
        reservationId.includes(searchTerm) ||
        note.includes(searchTerm)
      );
    });
    this.totalItems = this.filteredAvis.length;
  }

  // Pagination methods
  get paginatedAvis(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredAvis.slice(startIndex, startIndex + this.itemsPerPage);
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

  delete(avisId: string): void {
    if (!avisId) {
      console.error('Invalid review ID');
      return;
    }

    const confirmDelete = confirm('Are you sure you want to delete this review?');
    if (!confirmDelete) return;

    this.isLoading = true;
    this.avisService.deleteAvis(avisId).subscribe({
      next: () => {
        this.loadAvis();
      },
      error: (error) => {
        this.errorMessage = 'Failed to delete review';
        console.error('Delete error:', error);
        this.isLoading = false;
      }
    });
  }

  getDisplayedRange(): string {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
    return `${start}-${end}`;
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

}
