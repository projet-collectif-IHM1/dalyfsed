// home.component.ts
import { Component, OnInit } from '@angular/core';
import { PayeService } from '../Services/paye.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent  {



  searchQuery: string = '';
  checkInDate: string = '';
  checkOutDate: string = '';
  priceLimit: string = '';

  constructor(private router: Router) {}
  

  searchHotels(): void {
    const queryParams: any = {};
    
    if (this.searchQuery) {
      queryParams.search = this.searchQuery;
    }
    
    if (this.checkInDate) {
      queryParams.start = this.checkInDate;
    }
    
    if (this.checkOutDate) {
      queryParams.end = this.checkOutDate;
    }
    
    if (this.priceLimit) {
      queryParams.price = this.priceLimit;
    }

    this.router.navigate(['/Hotel_User'], { queryParams });
  }

}