import { Component, OnInit } from '@angular/core';
import { ServiceClientService } from '../Services/service-client.service';
import { PayeService } from '../Services/paye.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-omra',
  templateUrl: './omra.component.html',
  styleUrls: ['./omra.component.css']
})
export class OmraComponent implements OnInit {
  constructor(
    private hotelService: ServiceClientService,
    private payeService: PayeService,
    private route: ActivatedRoute
  ) {}

  payes: any[] = [];
  chambres: any[] = [];
  hotels: any[] = [];
  filteredHotels: any[] = [];
  isLoading: boolean = true;
  searchQuery: string = '';

  // Filtres
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
  selectedPrices = new Set<string>();
  allSelected = false;
  selectedRating: any = null;

  dateRange: { start: string | null, end: string | null } = { start: null, end: null };
  roomTypes: string[] = [];
  selectedRoomTypes = new Set<string>();
  allRoomTypesSelected = false;

  accordions = {
    price: false,
    rating: false,
    date: false,
    roomType: false
  };

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.resetFilters();
      if (params['search']) {
        this.searchQuery = params['search'];
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
      this.loadInitialData();
    });
  }

  loadInitialData(): void {
    this.isLoading = true;
  
    this.payeService.getPaye().subscribe({
      next: (data) => {
        this.payes = data.payes;
        this.loadAllHotels(); // Charge les hôtels après avoir reçu les pays
      },
      error: (error) => {
        console.error("Erreur payes:", error);
        this.isLoading = false;
      }
    });
  }

  loadAllHotels(): void {
    this.hotelService.getHotels().subscribe({
      next: (data) => {
        // Récupérez l'ID du pays "Kingdom of Saudi Arabia"
        const saudiArabia = this.payes.find((pays: any) => pays.nompaye == 'Kingdom of Saudi Arabia');
        const saudiArabiaId = saudiArabia ? saudiArabia.id : null;
  
        if (!saudiArabiaId) {
          console.error("Le pays 'Kingdom of Saudi Arabia' n'a pas été trouvé dans les données.");
          this.isLoading = false;
          return;
        }
  
        // Filtrer uniquement les hôtels du Royaume d'Arabie Saoudite
        this.hotels = data.hotels
          .filter((hotel: any) => hotel.paye_id === saudiArabiaId)
          .map((hotel: any) => ({
            ...hotel,
            chambres: this.chambres
              .filter(chambre => chambre.hotel_id === hotel._id)
              .map(chambre => ({
                ...chambre,
                typeChambre: this.capitalizeFirstLetter(chambre.typeChambre?.toLowerCase().trim())
              }))
          }));
  
        this.applyFilters(); // Applique les filtres après le chargement
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Erreur hotels:", error);
        this.isLoading = false;
      },
      complete: () => console.log('Hotel fetch operation completed')
    });
  }

  applyFilters(): void {
    if (!this.hotels.length) {
      this.filteredHotels = [];
      return;
    }
    this.filteredHotels = this.hotels.filter(hotel => {
      // Filtre par nom d'hôtel
      const nameMatch = !this.searchQuery || 
        hotel.nomHotel.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      let priceMatch = true;
      if (this.selectedPrices.size > 0) {
        const hotelPrice = hotel.offre[0]?.prixParNuit || 0;
        priceMatch = Array.from(this.selectedPrices).some(range => {
          if (range === "Under 80 DT") return hotelPrice < 80;
          if (range === "Over 1000 DT") return hotelPrice > 1000;
          const [min, max] = range.replace(/\D+/g, ' ').trim().split(' ').map(Number);
          return hotelPrice >= min && hotelPrice <= max;
        });
      }
      let ratingMatch = true;
      if (this.selectedRating) {
        const hotelRating = hotel.classement || 0;
        ratingMatch = hotelRating === this.selectedRating.value;
      }
      let roomTypeMatch = true;
      if (this.selectedRoomTypes.size > 0 && !this.allRoomTypesSelected) {
        roomTypeMatch = hotel.chambres?.some((chambre: any) => {
          const chambreType = chambre.typeChambre?.toLowerCase().trim();
          return Array.from(this.selectedRoomTypes).some(selectedType => 
            selectedType.toLowerCase().trim() === chambreType
          );
        }) || false;
      }
      let dateMatch = true;
      if (this.dateRange.start || this.dateRange.end) {
        dateMatch = this.checkHotelAvailability(
          hotel,
          this.dateRange.start ? new Date(this.dateRange.start) : null,
          this.dateRange.end ? new Date(this.dateRange.end) : null
        );
      }
      return nameMatch && priceMatch && ratingMatch && roomTypeMatch && dateMatch;
    });
    console.log('Hôtels filtrés:', this.filteredHotels);
    console.log('Critères de filtrage:', {
      search: this.searchQuery,
      price: this.selectedPrices,
      rating: this.selectedRating,
      dateRange: this.dateRange
    });
  }

  resetFilters(): void {
    this.searchQuery = "";
    this.selectedPrices.clear();
    this.allSelected = false;
    this.selectedRating = null;
    this.dateRange = { start: null, end: null };
    this.selectedRoomTypes.clear();
    this.allRoomTypesSelected = false;
  }

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

  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  toggleAccordion(key: keyof typeof this.accordions): void {
    this.accordions[key] = !this.accordions[key];
  }

  togglePriceSelection(price: string): void {
    if (this.selectedPrices.has(price)) {
      this.selectedPrices.delete(price);
    } else {
      this.selectedPrices.add(price);
    }
    this.allSelected = this.selectedPrices.size === this.priceRanges.length;
    this.applyFilters();
  }

  toggleAllPrices(event: any): void {
    this.allSelected = event.target.checked;
    this.selectedPrices.clear();
    if (this.allSelected) {
      this.priceRanges.forEach(price => this.selectedPrices.add(price));
    }
    this.applyFilters();
  }

  onRatingChanged(): void {
    this.applyFilters();
  }

  toggleRoomTypeSelection(type: string): void {
    if (this.selectedRoomTypes.has(type)) {
      this.selectedRoomTypes.delete(type);
    } else {
      this.selectedRoomTypes.add(type);
    }
    this.allRoomTypesSelected = this.selectedRoomTypes.size === this.roomTypes.length;
    this.applyFilters();
  }

  toggleAllRoomTypes(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.allRoomTypesSelected = isChecked;
    this.selectedRoomTypes.clear();
    if (isChecked) {
      this.roomTypes.forEach(type => this.selectedRoomTypes.add(type));
    }
    this.applyFilters();
  }

  onDateChange(): void {
    if (this.validateDateRange()) {
      this.applyFilters();
    }
  }

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
}