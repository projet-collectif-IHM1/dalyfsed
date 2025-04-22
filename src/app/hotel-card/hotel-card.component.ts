import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ServiceClientService } from '../Services/service-client.service';
import { PayeService } from '../Services/paye.service';

@Component({
  selector: 'app-hotel-card',
  templateUrl: './hotel-card.component.html',
  styleUrls: ['./hotel-card.component.css']
})
export class HotelCardComponent implements OnInit, AfterViewInit {

  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;

  hotels: any[] = [];
  isLoading: boolean = true;
  tunisiaPayeId: number | null = null; // Pour stocker l'ID de Tunisia

  constructor(private myService: ServiceClientService, private payeService: PayeService) { }

  ngOnInit(): void {
    // Récupérer la liste des pays
    this.payeService.getAllPaye().subscribe(
      (data) => {
        console.log(data.payes)
        console.log("Nombre de pays :", data.payes.length);

        // Extraire le tableau des pays (si nécessaire)
        

        // Rechercher l'ID du pays dont le nom est "Tunisia"
        let tunisia = null; // Initialiser la variable
      for (let i = 0; i < data.payes.length; i++) {
      const pays = data.payes[i];
      console.log("0000000000000"+pays);
        if (pays.nompaye && pays.nompaye.toLowerCase() === 'tunisia') {
          tunisia = pays;
          break; // Arrêter la boucle dès qu'on trouve une correspondance
  }
}
console.log("Résultat de la recherche pour 'Tunisia' :", tunisia);
        if (tunisia) {
          this.tunisiaPayeId = tunisia.id;
          console.log("ID de Tunisia :", this.tunisiaPayeId);
        } else {
          console.error("Le pays 'Tunisia' n'a pas été trouvé.");
        }

        // Appeler le service pour récupérer les hôtels
        this.myService.getHotels().subscribe(
          (data) => {
            console.log("Hôtels reçus :", data);

            // Filtrer les hôtels en fonction de l'ID de Tunisia
            if (this.tunisiaPayeId !== null) {
              this.hotels = data.hotels.filter((hotel: any) => hotel.paye_id === this.tunisiaPayeId);
              console.log("Hôtels en Tunisie :", this.hotels);
            } else {
              console.warn("Impossible de filtrer les hôtels car l'ID de Tunisia n'est pas disponible.");
              this.hotels = [];
            }

            this.isLoading = false;
          },
          (error) => {
            console.error("Erreur lors de la récupération des hôtels :", error);
            this.isLoading = false;
          }
        );
      },
      (error) => {
        console.error("Erreur lors de la récupération des pays :", error);
        this.isLoading = false;
      }
    );
  }

  ngAfterViewInit(): void {
    const container = this.scrollContainer.nativeElement;

    // Défilement horizontal avec la molette de la souris
    container.addEventListener('wheel', (event: WheelEvent) => {
      event.preventDefault(); // Empêche le défilement vertical par défaut
      const scrollAmount = event.deltaY > 0 ? 330 : -330; // Direction du scroll
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' }); // Défile horizontalement
    });
  }
   // Scroll vers la gauche
  scrollLeft() {
    const container = document.getElementById('hotelsContainer');
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }
  
  // Scroll vers la droite
  scrollRight() {
    const container = document.getElementById('hotelsContainer');
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }
  getPrixMinimum(hotel: any): number | null {
    if (!hotel || !Array.isArray(hotel.chambres) || hotel.chambres.length === 0) {
      return null;
    }

    const prixList = hotel.chambres
      .map((ch: any) => ch.prixchambre)
      .filter((prix: any) => typeof prix === 'number');

    if (prixList.length === 0) {
      return null;
    }

    return Math.min(...prixList);
  }

  getStars(count: number): any[] {
    return new Array(count);
  }
}