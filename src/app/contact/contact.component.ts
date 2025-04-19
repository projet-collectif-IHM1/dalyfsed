import { Component } from '@angular/core';
import { ReservationService } from '../Services/reservation.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  Resevation: any[] = [];
      isLoading: boolean = true;
    
      newpaye: any = {}; // Declare newHotel property
    
      constructor(
        
        private MS: ReservationService,      // Service for handling delete operation
        private dialog: MatDialog
      ) {}
    
      ngOnInit(): void {
        // Fetch hotels on component initialization
        this.MS.getAllReservation().subscribe(
          (data) => {
            console.log("resarvation reçus :", data);
            this.Resevation = data.reservations; // Ensure that 'hotels' is correctly set
            this.isLoading = false; // Stop loading when data is received
          },
          (error) => {
            console.error("Erreur lors de la récupération des hôtels :", error);
            this.isLoading = false; // Stop loading even on error
          }
        );
      }
      delete(id: string): void {
        // Open the confirmation dialog
        let dialogRef = this.dialog.open(ConfirmDialogComponent, {
          height: '400px',
          width: '600px',
        });
      
        // After the dialog is closed, check if the user confirmed the action
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            // Proceed to delete if the user confirmed
            this.MS.deleteReservation(id).subscribe(
              () => {
                console.log('Hôtel supprimé avec succès');
                // Reload the list of hotels after deletion
                this.MS.getAllReservation().subscribe(
                  (data) => {
                    console.log("Hôtels reçus :", data);
                    this.Resevation = data.reservations; // Ensure that 'hotels' is correctly set
                    this.isLoading = false; // Stop loading when data is received
                  },
                  (error) => {
                    console.error("Erreur lors de la récupération des hôtels :", error);
                    this.isLoading = false; // Stop loading even on error
                  }
                );
              },
              (error) => {
                console.error("Erreur lors de la suppression de l'hôtel :", error);
              }
            );
          }
        });}


}
