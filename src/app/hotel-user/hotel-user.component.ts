import { Component, OnInit } from '@angular/core';
import { ServiceClientService } from '../Services/service-client.service';
import { PayeService } from '../Services/paye.service';
import { ActivatedRoute } from '@angular/router';

interface Hotel {
  id: string;
  nomHotel: string;
  paye_id: string;
  classement: number;
  adresse: string;
  imageHotel: string[];
  datedabut: string;
  datefin: string;
  chambres?: Chambre[];
  startingPrice?: number;
}

interface Chambre {
  id: string;
  hotel_id: string;
  typeChambre?: string;
  prixchambre?: number;
}

interface Paye {
  id: string;
  nompaye: string;
}

interface RatingOption {
  display: string;
  value: number;
}

@Component({
  selector: 'app-hotel-user',
  templateUrl: './hotel-user.component.html',
  styleUrls: ['./hotel-user.component.css']
})
export class HotelUserComponent implements OnInit {
  // Data properties
  payes: Paye[] = [];
  hotels: Hotel[] = [];
  filteredHotels: Hotel[] = [];
  isLoading: boolean = true;
  searchQuery: string = '';

  // Filter options
  ratings: RatingOption[] = [
    { display: "★ 1", value: 1 },
    { display: "★★ 2", value: 2 },
    { display: "★★★ 3", value: 3 },
    { display: "★★★★ 4", value: 4 },
    { display: "★★★★★ 5", value: 5 }
  ];
  priceRanges: string[] = [
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

  // Selected filters
  selectedPrices = new Set<string>();
  allSelected = false;
  selectedRatings = new Set<number>();
  allRatingsSelected = false;
  selectedCountry: string = "";
  dateRange: { start: string | null, end: string | null } = { start: null, end: null };
  roomTypes: string[] = [];
  selectedRoomTypes = new Set<string>();
  allRoomTypesSelected = false;

  // UI state
  accordions = {
    country: true,
    price: false,
    rating: false,
    date: false,
    roomType: false
  };

  constructor(
    private hotelService: ServiceClientService,
    private payeService: PayeService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.resetFilters(!!params['pays']);
      this.applyUrlFilters(params);
      this.loadInitialData();
    });
  }

  private applyUrlFilters(params: any): void {
    if (params['search']) this.searchQuery = params['search'];
    if (params['pays']) {
      this.selectedCountry = params['pays'];
      this.accordions.country = true;
    }
    this.dateRange = {
      start: params['start'] || null,
      end: params['end'] || null
    };
    if (params['price']) {
      this.applyPriceFilterFromUrl(params['price']);
    }
  }

  private applyPriceFilterFromUrl(priceParam: string): void {
    const price = parseInt(priceParam);
    const matchingRange = this.priceRanges.find(range => {
      if (range === "Under 80 DT") return price < 80;
      if (range === "Over 1000 DT") return price > 1000;
      const [min, max] = range.split(' to ').map(s => parseInt(s.replace(' DT', '')));
      return price >= min && price <= max;
    });
    if (matchingRange) this.selectedPrices.add(matchingRange);
  }

  loadInitialData(): void {
    this.isLoading = true;
    this.payeService.getPaye().subscribe({
      next: (data) => {
        this.payes = data.payes;
        this.loadAllHotels();
      },
      error: (error) => {
        console.error("Error loading countries:", error);
        this.isLoading = false;
      }
    });
  }

  loadAllHotels(): void {
    this.hotelService.getHotels().subscribe({
      next: (data) => {
        this.hotels = this.processHotelData(data.hotels);
        this.extractRoomTypes();
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Error loading hotels:", error);
        this.isLoading = false;
      }
    });
  }

  private processHotelData(hotels: any[]): Hotel[] {
    return hotels.map(hotel => ({
      ...hotel,
      chambres: hotel.chambres || [],
      startingPrice: this.getStartingPrice(hotel)
    }));
  }

  private getStartingPrice(hotel: any): number {
    if (!hotel.chambres || !hotel.chambres.length) return 0;
    const prices = hotel.chambres
      .filter((c: any) => c.prixchambre !== undefined)
      .map((c: any) => c.prixchambre);
    return prices.length ? Math.min(...prices) : 0;
  }

  getHotelPrice(hotel: any): string | number {
    if (hotel.startingPrice !== undefined && hotel.startingPrice !== null) {
      return hotel.startingPrice;
    }
    if (hotel.chambres && hotel.chambres.length > 0 && hotel.chambres[0].prixchambre !== undefined) {
      return hotel.chambres[0].prixchambre;
    }
    return 'N/A';
  }

  applyFilters(): void {
    if (!this.hotels.length) {
      this.filteredHotels = [];
      return;
    }
    this.filteredHotels = this.hotels.filter(hotel =>
      this.matchesSearch(hotel) &&
      this.matchesCountry(hotel) &&
      this.matchesPrice(hotel) &&
      this.matchesRating(hotel) &&
      this.matchesRoomType(hotel) &&
      this.matchesDateRange(hotel)
    );
  }

  private matchesSearch(hotel: Hotel): boolean {
    return !this.searchQuery ||
           hotel.nomHotel.toLowerCase().includes(this.searchQuery.toLowerCase());
  }

  private matchesCountry(hotel: Hotel): boolean {
    return !this.selectedCountry || hotel.paye_id === this.selectedCountry;
  }

  private matchesPrice(hotel: Hotel): boolean {
    if (this.selectedPrices.size === 0) return true;
    const price = hotel.startingPrice || 0;
    return Array.from(this.selectedPrices).some(range => {
      if (range === "Under 80 DT") return price < 80;
      if (range === "Over 1000 DT") return price > 1000;
      const [min, max] = range.replace(/\D+/g, ' ').trim().split(' ').map(Number);
      return price >= min && price <= max;
    });
  }

  private matchesRating(hotel: Hotel): boolean {
    return this.selectedRatings.size === 0 ||
           this.selectedRatings.has(hotel.classement || 0);
  }

  private matchesRoomType(hotel: Hotel): boolean {
    if (this.selectedRoomTypes.size === 0 || this.allRoomTypesSelected) return true;
    return hotel.chambres?.some(chambre =>
      chambre.typeChambre &&
      Array.from(this.selectedRoomTypes).some(selectedType =>
        selectedType.toLowerCase().trim() === (chambre.typeChambre ?? '').toLowerCase().trim()
      )
    ) || false;
  }

  private matchesDateRange(hotel: Hotel): boolean {
    if (!this.dateRange.start && !this.dateRange.end) return true;
    const hotelStart = new Date(hotel.datedabut);
    const hotelEnd = new Date(hotel.datefin);
    const filterStart = this.dateRange.start ? new Date(this.dateRange.start) : null;
    const filterEnd = this.dateRange.end ? new Date(this.dateRange.end) : null;
    if (filterStart && !filterEnd) return filterStart >= hotelStart && filterStart <= hotelEnd;
    if (!filterStart && filterEnd) return filterEnd >= hotelStart && filterEnd <= hotelEnd;
    if (filterStart && filterEnd) return filterStart <= hotelEnd && filterEnd >= hotelStart;
    return true;
  }

  resetFilters(keepCountry: boolean = false): void {
    this.searchQuery = "";
    if (!keepCountry) this.selectedCountry = "";
    this.selectedPrices.clear();
    this.allSelected = false;
    this.selectedRatings.clear();
    this.allRatingsSelected = false;
    this.dateRange = { start: null, end: null };
    this.selectedRoomTypes.clear();
    this.allRoomTypesSelected = false;
    this.accordions = {
      country: true,
      price: false,
      rating: false,
      date: false,
      roomType: false
    };
    this.applyFilters();
  }

  extractRoomTypes(): void {
    const types = new Set<string>();
    this.hotels.forEach(hotel => {
      hotel.chambres?.forEach(chambre => {
        if (chambre.typeChambre) {
          types.add(this.capitalizeFirstLetter(chambre.typeChambre.toLowerCase().trim()));
        }
      });
    });
    this.roomTypes = Array.from(types);
  }

  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  // Filter toggle methods
  onCountrySelected(payeId: string): void {
    this.selectedCountry = payeId;
    this.applyFilters();
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

  toggleAllPrices(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.allSelected = target.checked;
    this.selectedPrices.clear();
    if (this.allSelected) {
      this.priceRanges.forEach(price => this.selectedPrices.add(price));
    }
    this.applyFilters();
  }

  toggleRatingSelection(ratingValue: number): void {
    if (this.selectedRatings.has(ratingValue)) {
      this.selectedRatings.delete(ratingValue);
    } else {
      this.selectedRatings.add(ratingValue);
    }
    this.allRatingsSelected = this.selectedRatings.size === this.ratings.length;
    this.applyFilters();
  }

  toggleAllRatings(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.allRatingsSelected = target.checked;
    this.selectedRatings.clear();
    if (this.allRatingsSelected) {
      this.ratings.forEach(r => this.selectedRatings.add(r.value));
    }
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
    const target = event.target as HTMLInputElement;
    this.allRoomTypesSelected = target.checked;
    this.selectedRoomTypes.clear();
    if (this.allRoomTypesSelected) {
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
        console.error("End date must be after start date");
        return false;
      }
    }
    return true;
  }

  getSelectedCountryName(): string {
    if (!this.selectedCountry) return "All countries";
    const selected = this.payes.find(p => p.id === this.selectedCountry);
    return selected ? selected.nompaye : "";
  }

  getStars(count: number): any[] {
    return Array(count).fill(0);
  }
}