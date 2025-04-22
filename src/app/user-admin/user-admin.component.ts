import { Component } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UserService } from '../Services/user.service';
@Component({
  selector: 'app-user-admin',
  templateUrl: './user-admin.component.html',
  styleUrls: ['./user-admin.component.css']
})
export class UserAdminComponent {
  users: any[] = [];
  filteredUsers: any[] = [];
  isLoading: boolean = true;
  newUser: any = {};
  searchControl = new FormControl('');

  // Pagination variables
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;

  constructor(
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUsers();

    // Setup search with debounce
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.filterUsers();
        this.currentPage = 1; // Reset to first page when searching
      });
  }
  getDisplayedRange(): string {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
    return `${start}-${end}`;
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe(
      (response) => {
        this.users = response.users || []; // Access the 'users' array from response
        this.filteredUsers = [...this.users]; // Initialize filtered users
        this.totalItems = this.users.length;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading users:', error);
        this.isLoading = false;
      }
    );
  }

  filterUsers(): void {
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    this.filteredUsers = this.users.filter((user) =>
      user.name?.toLowerCase().includes(searchTerm) ||
      user.email?.toLowerCase().includes(searchTerm) ||
      user.role?.toLowerCase().includes(searchTerm)
    );
    this.totalItems = this.filteredUsers.length;
    this.currentPage = 1; // Reset to first page after filtering
  }

  get paginatedUsers(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredUsers.slice(startIndex, startIndex + this.itemsPerPage);
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

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.deleateUser(id).subscribe(
          () => {
            this.loadUsers(); // Refresh the list
          },
          (error) => {
            console.error('Error deleting user:', error);
          }
        );
      }
    });
  }
}
