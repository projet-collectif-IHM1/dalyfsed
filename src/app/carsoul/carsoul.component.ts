import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PayeService } from '../Services/paye.service';

@Component({
  selector: 'app-carsoul',
  templateUrl: './carsoul.component.html',
  styleUrls: ['./carsoul.component.css']
})
export class CarsoulComponent implements OnInit {
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;
  
  constructor(
    private router: Router,
    private payeService: PayeService
  ) { }

  payes: any[] = [];
  isLoading: boolean = true;
  responsiveOptions: { breakpoint: string; numVisible: number; numScroll: number }[] = [];

  ngOnInit(): void {
    this.loadPays();
  }

  loadPays(): void {
    this.payeService.getPaye().subscribe({
      next: (data) => {
        console.log("Pays reçus :", data);
        this.payes = data.payes;
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Erreur lors du chargement des pays:", error);
        this.isLoading = false;
      }
    });
  }

  selectDestination(paysId: string): void {
    this.router.navigate(['/Hotel_User'], { queryParams: { pays: paysId } });
  }

  scrollLeft() {
    this.scrollContainer.nativeElement.scrollBy({ left: -355, behavior: 'smooth' });
  }

  scrollRight() {
    this.scrollContainer.nativeElement.scrollBy({ left: 355, behavior: 'smooth' });
  }
}