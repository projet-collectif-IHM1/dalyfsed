import { Component, Inject, OnInit } from '@angular/core';
import { ServiceClientService } from '../Services/service-client.service';
import { HotelService } from '../Services/hotel.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-hotel',
  templateUrl: './hotel.component.html',
  styleUrls: ['./hotel.component.css']
})
export class HotelComponent implements OnInit {

  hotels: any[] = [];
  isLoading: boolean = true;

  newHotel: any = {}; // Declare newHotel property

  constructor(
    @Inject(HotelService) private hotelService: HotelService, // Utilisation de @Inject pour spécifier le token d'injection
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Fetch hotels on component initialization
    this.loadHotels();  // Call loadHotels to avoid duplicate code
  }
  
  loadHotels(): void {
    this.hotelService.GetAllHotel().subscribe(
      (data: any) => {
        console.log('Hotels data:', data); // Log the fetched hotels data
        if (data && data.hotels) {
          this.hotels = data.hotels;  // Correctly assign hotels from response
        } else {
          console.error('No hotels data found in response');
        }
        this.isLoading = false; // Stop loading when data is received
      },
      (error) => {
        console.error('Error fetching hotels:', error);
        this.isLoading = false; // Stop loading even on error
      }
    );
  }
  
  delete(hotelId: string): void {
    console.log('Deleting hotel with ID:', hotelId); // Log the hotelId
    if (!hotelId) {
      console.error('Hotel ID is undefined');
      return;
    }
    this.hotelService.deleteHotel(hotelId).subscribe(
      (response) => {
        console.log('Hotel deleted successfully', response);
        this.loadHotels(); // Reload the hotels list after deletion
      },
      (error) => {
        console.error('Error deleting hotel:', error);
      }
    );
  }
  
}
