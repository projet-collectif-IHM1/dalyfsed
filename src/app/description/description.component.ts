import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HotelService } from '../Services/hotel.service';
import { ActivatedRoute } from '@angular/router';
import { ChambreService } from '../Services/chambre.service';

interface Chambre {
  id: string;
  typeChambre: string;
  imageChambre: string[];
  prixchambre: number;
  description?: string;
  capacite?: number;
  options?: string[];
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
  selectedChambre: Chambre | null = null;
  errorMessage: string = '';
  currentId: string | null = null;

  selectedChambres: Set<number> = new Set<number>();
  somme: number = 0;

  constructor(
    private hotelService: HotelService,
    private chambreService: ChambreService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.currentId = this.route.snapshot.paramMap.get('id');
    if (this.currentId) {
      this.loadHotelData();
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
        if (this.chambres.length > 0) {
          this.selectedChambre = this.chambres[0];
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.handleError("Error loading rooms", error);
      }
    });
  }

  private handleError(message: string, error?: any): void {
    console.error(message, error);
    this.errorMessage = message;
    this.isLoading = false;
  }

  toggleSelection(index: number): void {
    if (this.selectedChambres.has(index)) {
      this.selectedChambres.delete(index);
    } else {
      this.selectedChambres.add(index);
    }
    this.calculateTotal();
  }

  calculateTotal(): void {
    this.somme = 0;
    this.selectedChambres.forEach(index => {
      this.somme += this.chambres[index].prixchambre;
    });
  }

  getStars(count: number): any[] {
    return new Array(count);
  }

  getSafeMapUrl(address: string): SafeUrl {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodedAddress}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
