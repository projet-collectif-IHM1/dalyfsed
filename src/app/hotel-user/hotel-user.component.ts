import { Component } from '@angular/core';
import { ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ServiceClientService } from '../Services/service-client.service';
import { PayeService } from '../Services/paye.service';
import { OffreService } from '../Services/offre.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-hotel',
  templateUrl: './hotel-user.component.html',
  styleUrls: ['./hotel-user.component.css']
})
export class HotelUserComponent implements OnInit {
  constructor(
    private hotelService: ServiceClientService,
    private payeService: PayeService,
    private route: ActivatedRoute
  ) {}

  // Données des pays et hôtels
  payes: any[] = []; // Liste des pays disponibles
  chambres: any[] = []; // Liste des chambres
  hotels: any[] = []; // Liste complète des hôtels
  filteredHotels: any[] = []; // Hôtels filtrés à afficher
  isLoading: boolean = true; // État de chargement
  searchQuery: string = ''; // Terme de recherche

  // Options de filtrage
  ratings = [
    { display: "★ 1", value: 1 },
    { display: "★★ 2", value: 2 },
    { display: "★★★ 3", value: 3 },
    { display: "★★★★ 4", value: 4 },
    { display: "★★★★★ 5", value: 5 }
  ];
  
  priceRanges = [
    "Under 80 DT", 
    "100 to 200 DT", 
    "200 to 300 DT", 
    "300 to 400 DT", 
    "400 to 500 DT",
    "500 to 600 DT", 
    "600 to 700 DT", 
    "700 to 800 DT", 
    "800 to 900 DT", 
    "Over 1000 DT"
  ];

  // Filtres sélectionnés
  selectedPrices = new Set<string>(); // Prix sélectionnés
  allSelected = false; // Si tous les prix sont sélectionnés
  selectedRatings = new Set<number>(); // Ratings sélectionnés (modifié pour fonctionner comme les prix)
  allRatingsSelected = false; // Si tous les ratings sont sélectionnés
  selectedCountry: string = ""; // Pays sélectionné

  // Plage de dates
  dateRange: { start: string | null, end: string | null } = { start: null, end: null };
  
  // Types de chambre
  roomTypes: string[] = [];
  selectedRoomTypes = new Set<string>();
  allRoomTypesSelected = false;

  // État des accordéons/filtres dépliés
  accordions = {
    country: true,
    price: false,
    rating: false,
    date: false,
    roomType: false
  };

  ngOnInit(): void {
    // S'abonner aux paramètres de l'URL
    this.route.queryParams.subscribe(params => {
      // Réinitialiser les filtres mais conserver le pays si présent
      this.resetFilters(params['pays'] ? true : false);
      
      // Appliquer les filtres depuis l'URL
      if (params['search']) {
        this.searchQuery = params['search'];
      }
      if (params['pays']) {
        this.selectedCountry = params['pays'];
        this.accordions.country = true;
      }
      if (params['start'] || params['end']) {
        this.dateRange = {
          start: params['start'] || null,
          end: params['end'] || null
        };
      }
      if (params['price']) {
        const price = parseInt(params['price']);
        const matchingRange = this.priceRanges.find(range => {
          if (range === "Under 80 DT") return price < 80;
          if (range === "Over 1000 DT") return price > 1000;
          const [min, max] = range.split(' to ').map(s => parseInt(s.replace(' DT', '')));
          return price >= min && price <= max;
        });
        if (matchingRange) {
          this.selectedPrices.add(matchingRange);
        }
      }
      
      // Charger les données initiales
      this.loadInitialData();
    });
  }

  /**
   * Charge les données initiales (pays puis hôtels)
   */
  loadInitialData(): void {
    this.isLoading = true;
  
    this.route.queryParams.subscribe(params => {
      if (params['pays']) {
        this.selectedCountry = params['pays'];
      }
  
      // Charger d'abord les pays
      this.payeService.getPaye().subscribe({
        next: (data) => {
          this.payes = data.payes;
          // Puis charger les hôtels
          this.loadAllHotels();
        },
        error: (error) => {
          console.error("Erreur payes:", error);
          this.isLoading = false;
        }
      });
    });
  }

  /**
   * Charge tous les hôtels depuis le service
   */
  loadAllHotels(): void {
    this.hotelService.getHotels().subscribe({
      next: (data) => {
        this.hotels = data.hotels.map((hotel: any) => ({
          ...hotel,
          chambres: this.chambres
            .filter(chambre => chambre.hotel_id === hotel._id)
            .map(chambre => ({
              ...chambre,
              typeChambre: this.capitalizeFirstLetter(chambre.typeChambre?.toLowerCase().trim())
            }))
        }));
  
        this.applyFilters(); // Appliquer les filtres après chargement
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Erreur hotels:", error);
        this.isLoading = false;
      }
    });
  }

  /**
   * Applique tous les filtres sélectionnés
   */
  applyFilters(): void {
    if (!this.hotels.length) {
      this.filteredHotels = [];
      return;
    }
    
    this.filteredHotels = this.hotels.filter(hotel => {
      // Filtre par nom d'hôtel
      const nameMatch = !this.searchQuery || 
        hotel.nomHotel.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      // Filtre par pays
      const countryMatch = !this.selectedCountry || 
                         hotel.paye_id === this.selectedCountry;
      
      // Filtre par prix
      let priceMatch = true;
      if (this.selectedPrices.size > 0) {
        const hotelPrice = hotel.chambres[0]?.prixchambre || 0;
        priceMatch = Array.from(this.selectedPrices).some(range => {
          if (range === "Under 80 DT") return hotelPrice < 80;
          if (range === "Over 1000 DT") return hotelPrice > 1000;
          const [min, max] = range.replace(/\D+/g, ' ').trim().split(' ').map(Number);
          return hotelPrice >= min && hotelPrice <= max;
        });
      }
      
      // Filtre par rating (modifié pour fonctionner comme les prix)
      let ratingMatch = true;
      if (this.selectedRatings.size > 0) {
        const hotelRating = hotel.classement || 0;
        ratingMatch = Array.from(this.selectedRatings).some(r => hotelRating === r);
      }
      
      // Filtre par type de chambre
      let roomTypeMatch = true;
      if (this.selectedRoomTypes.size > 0 && !this.allRoomTypesSelected) {
        roomTypeMatch = hotel.chambres?.some((chambre: any) => {
          const chambreType = chambre.typeChambre?.toLowerCase().trim();
          return Array.from(this.selectedRoomTypes).some(selectedType => 
            selectedType.toLowerCase().trim() === chambreType
          );
        }) || false;
      }
      
      // Filtre par date
      let dateMatch = true;
      if (this.dateRange.start || this.dateRange.end) {
        dateMatch = this.checkHotelAvailability(
          hotel,
          this.dateRange.start ? new Date(this.dateRange.start) : null,
          this.dateRange.end ? new Date(this.dateRange.end) : null
        );
      }
      
      return nameMatch && countryMatch && priceMatch && ratingMatch && roomTypeMatch && dateMatch;
    });
  }

  /**
   * Réinitialise tous les filtres
   * @param keepCountry Si vrai, conserve le filtre de pays
   */
  resetFilters(keepCountry: boolean = false): void {
    this.searchQuery = "";
    if (!keepCountry) {
      this.selectedCountry = "";
    }
    this.selectedPrices.clear();
    this.allSelected = false;
    this.selectedRatings.clear(); // Modifié pour vider les ratings sélectionnés
    this.allRatingsSelected = false;
    this.dateRange = { start: null, end: null };
    this.selectedRoomTypes.clear();
    this.allRoomTypesSelected = false;
  }

  /**
   * Extrait les types de chambre uniques
   */
  extractRoomTypes(): void {
    const typesSet = new Set<string>();
    this.chambres.forEach((chambre: any) => {
      if (chambre.typeChambre) {
        const normalizedType = chambre.typeChambre.toLowerCase().trim();
        typesSet.add(this.capitalizeFirstLetter(normalizedType));
      }
    });
    this.roomTypes = Array.from(typesSet);
  }

  /**
   * Met en majuscule la première lettre d'une chaîne
   */
  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  /**
   * Gère la sélection d'un pays
   */
  onCountrySelected(payeId: string): void {
    this.selectedCountry = payeId;
    this.applyFilters();
  }

  /**
   * Ouvre/ferme un accordéon de filtre
   */
  toggleAccordion(key: keyof typeof this.accordions): void {
    this.accordions[key] = !this.accordions[key];
  }

  /**
   * Sélectionne/désélectionne une fourchette de prix
   */
  togglePriceSelection(price: string): void {
    if (this.selectedPrices.has(price)) {
      this.selectedPrices.delete(price);
    } else {
      this.selectedPrices.add(price);
    }
    this.allSelected = this.selectedPrices.size === this.priceRanges.length;
    this.applyFilters();
  }

  /**
   * Sélectionne/désélectionne tous les prix
   */
  toggleAllPrices(event: any): void {
    this.allSelected = event.target.checked;
    this.selectedPrices.clear();
    if (this.allSelected) {
      this.priceRanges.forEach(price => this.selectedPrices.add(price));
    }
    this.applyFilters();
  }

  /**
   * Sélectionne/désélectionne un rating
   */
  toggleRatingSelection(ratingValue: number): void {
    if (this.selectedRatings.has(ratingValue)) {
      this.selectedRatings.delete(ratingValue);
    } else {
      this.selectedRatings.add(ratingValue);
    }
    this.allRatingsSelected = this.selectedRatings.size === this.ratings.length;
    this.applyFilters();
  }

  /**
   * Sélectionne/désélectionne tous les ratings
   */
  toggleAllRatings(event: any): void {
    this.allRatingsSelected = event.target.checked;
    this.selectedRatings.clear();
    if (this.allRatingsSelected) {
      this.ratings.forEach(r => this.selectedRatings.add(r.value));
    }
    this.applyFilters();
  }

  /**
   * Sélectionne/désélectionne un type de chambre
   */
  toggleRoomTypeSelection(type: string): void {
    if (this.selectedRoomTypes.has(type)) {
      this.selectedRoomTypes.delete(type);
    } else {
      this.selectedRoomTypes.add(type);
    }
    this.allRoomTypesSelected = this.selectedRoomTypes.size === this.roomTypes.length;
    this.applyFilters();
  }

  /**
   * Sélectionne/désélectionne tous les types de chambre
   */
  toggleAllRoomTypes(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.allRoomTypesSelected = isChecked;
    this.selectedRoomTypes.clear();
    if (isChecked) {
      this.roomTypes.forEach(type => this.selectedRoomTypes.add(type));
    }
    this.applyFilters();
  }

  /**
   * Gère le changement de date
   */
  onDateChange(): void {
    if (this.validateDateRange()) {
      this.applyFilters();
    }
  }

  /**
   * Vérifie que la plage de dates est valide
   */
  validateDateRange(): boolean {
    if (this.dateRange.start && this.dateRange.end) {
      const start = new Date(this.dateRange.start);
      const end = new Date(this.dateRange.end);
      if (start > end) {
        console.error("La date de fin doit être après la date de début");
        return false;
      }
    }
    return true;
  }

  /**
   * Vérifie la disponibilité d'un hôtel sur une plage de dates
   */
  checkHotelAvailability(hotel: any, startDate: Date | null, endDate: Date | null): boolean {
    const hotelStartDate = new Date(hotel.datedabut);
    const hotelEndDate = new Date(hotel.datefin);

    if (!startDate && !endDate) return true;

    if (startDate && !endDate) {
      return startDate >= hotelStartDate && startDate <= hotelEndDate;
    }

    if (!startDate && endDate) {
      return endDate >= hotelStartDate && endDate <= hotelEndDate;
    }

    if (startDate && endDate) {
      return startDate <= hotelEndDate && endDate >= hotelStartDate;
    }

    return true;
  }

  /**
   * Retourne le nom du pays sélectionné
   */
  getSelectedCountryName(): string {
    if (!this.selectedCountry) return "Tous les pays";
    const selected = this.payes.find(p => p._id === this.selectedCountry);
    return selected ? selected.nompaye : "";
  }

  /**
   * Génère un tableau d'étoiles pour l'affichage
   */
  getStars(count: number): any[] {
    return new Array(count);
  }
}