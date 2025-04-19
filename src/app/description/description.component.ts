import { Component, OnInit } from '@angular/core';
import { HotelService } from '../Services/hotel.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.css']
})
export class DescriptionComponent  {
  isLoading: boolean = true;
  hotel: any = null;  // PAS hotels: any[], car ici tu affiches UN SEUL hotel
  errorMessage: string = '';
  currentId: string | null = null;

  constructor(
    private myService: HotelService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.currentId = this.route.snapshot.paramMap.get('id');
    if (this.currentId) {
      this.myService.getHotelById(this.currentId).subscribe({
        next: (data) => {
          console.log("Hôtel reçu :", data);
          this.hotel = data; // pas data.hotel
          this.isLoading = false;
        },
        error: (error) => {
          console.error("Erreur lors de la récupération de l'hôtel :", error);
          this.errorMessage = "Erreur lors de la récupération de l'hôtel.";
          this.isLoading = false;
        }
      });
    } else {
      this.errorMessage = "ID de l'hôtel non fourni.";
      this.isLoading = false;
    }
  }
  getStars(count: number): any[] {
  return new Array(count);
}

  
}
