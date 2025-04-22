import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HotelService } from '../Services/hotel.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ChambreService } from '../Services/chambre.service';
import { ServiceClientService } from '../Services/service-client.service';
import { OptionService } from '../Services/option.service';

interface Chambre {
  id: string;
  typeChambre: string;
  imageChambre: string[];
  prixchambre: number;
  description?: string;
  capacite?: number;
  options?: string[];
}

interface Option {
  id: string;
  typeOption: string;
  percent: number;
}

interface Offre {
  prixParNuit: number;
  promotion: number;
  hotel_id: string;
}

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.css']
})
export class DescriptionComponent implements OnInit {
  isLoading: boolean = true;
  hotel: any = null;
  chambres: Chambre[] = [];
  options: Option[] = [];
  selectedRoom: { chambre: Chambre, option: Option | null } | null = null;
  errorMessage: string = '';
  currentId: string | null = null;
  searchQuery: string = '';
  checkInDate: string = '';
  checkOutDate: string = '';
  priceLimit: string = '';


  constructor(
    private hotelService: HotelService,
    private chambreService: ChambreService,
    private serviceClientService: ServiceClientService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private optionService: OptionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentId = this.route.snapshot.paramMap.get('id');
    if (this.currentId) {
      this.loadHotelData();
      this.loadOptions();
    } else {
      this.errorMessage = "Hotel ID not provided.";
      this.isLoading = false;
    }
  }

  private loadHotelData(): void {
    this.hotelService.getHotelById(this.currentId!).subscribe({
      next: (hotelData) => {
        this.hotel = hotelData;
        this.loadChambres();
      },
      error: (error) => {
        this.handleError("Error loading hotel data", error);
      }
    });
  }

  private loadChambres(): void {
    this.chambreService.getChambreById(this.currentId!).subscribe({
      next: (chambresData) => {
        this.chambres = chambresData;
        this.isLoading = false;
      },
      error: (error) => {
        this.handleError("Error loading rooms", error);
      }
    });
  }

  private loadOptions(): void {
    this.optionService.getAllOptions().subscribe({
      next: (data) => {
        this.options = data.options;
      },
      error: (error) => {
        console.error("Erreur lors du chargement des options:", error);
      }
    });
  }

  private handleError(message: string, error?: any): void {
    console.error(message, error);
    this.errorMessage = message;
    this.isLoading = false;
  }

  getMaxPromotion(): number {
    if (!this.hotel?.offre) return 0;
    return this.hotel.offre.reduce((max: number, offre: Offre) => {
      return Math.max(max, offre.promotion || 0);
    }, 0);
  }

  calculateOptionPrice(prixBase: number, optionPercent: number = 0): number {
    const maxPromotion = this.getMaxPromotion();
    // Appliquer d'abord la promotion de l'offre, puis celle de l'option
    const prixPromo = prixBase+(prixBase * optionPercent/100 );
    return prixPromo
    
  }

  getOriginalPrice(): number {
    return this.selectedRoom?.chambre.prixchambre || 0;
  }
  calculateFinalPrice(prixBase: number, optionPercent: number = 0): number {
    const finalPromotion = this.calculateOptionPrice(prixBase, optionPercent);
    const maxPromotion = this.getMaxPromotion();
    // Appliquer d'abord la promotion de l'offre, puis celle de l'option
    return finalPromotion-(finalPromotion * maxPromotion/100 );
  
    
  }

  getFinalPrice(): number {
    if (!this.selectedRoom) return 0;
    
    const basePrice = this.selectedRoom.chambre.prixchambre;
    const optionPercent = this.selectedRoom.option?.percent || 0;
    return this.calculateOptionPrice(basePrice, optionPercent);
  }
  getFinalPriceAfetrPromo(): number {
    if (!this.selectedRoom) return 0;
    
    const basePrice = this.selectedRoom.chambre.prixchambre;
    const optionPercent = this.selectedRoom.option?.percent || 0;
    return this.calculateFinalPrice(basePrice, optionPercent);
  }
  getDiscountPercent(): number {
    if (!this.selectedRoom) return this.getMaxPromotion();
    
    const maxPromotion = this.getMaxPromotion();
   
   
    return maxPromotion
  }

  toggleRoomSelection(chambre: Chambre, option: Option | null = null): void {
    this.selectedRoom = {
      chambre: chambre,
      option: option
    };
  }

  getStars(count: number): any[] {
    return new Array(count);
  }

  getSafeMapUrl(address: string): SafeUrl {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodedAddress}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  isOptionSelected(chambre: Chambre, option: Option | null): boolean {
    if (!this.selectedRoom) return false;
    return this.selectedRoom.chambre.id === chambre.id && 
           ((!this.selectedRoom.option && !option) || 
           (this.selectedRoom.option?.id === option?.id));
  }
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