import { Component, ElementRef, ViewChild } from '@angular/core';
import { PayeService } from '../Services/paye.service';
import { AvisService } from '../Services/avis.service';

@Component({
  selector: 'app-avis',
  templateUrl: './avis.component.html',
  styleUrls: ['./avis.component.css']
})
export class AvisComponent {
 @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;
    constructor(private myService: AvisService) { }
  avis: any[] = [];
    isLoading: boolean = true;
    responsiveOptions: { breakpoint: string; numVisible: number; numScroll: number }[] = [];
  
  
   
      ngOnInit(): void {
        this.myService.getAvis().subscribe(
          (data) => {
            console.log("avis reçus :", data);
            this.avis = data.avis;
          },
          (error) => {
            console.error("Erreur lors de la récupération des avis :", error);
            this.isLoading = false; // Désactive le chargement une fois les données reçues
          }
        );
  
       
    }
  
  
    scrollLeft() {
      this.scrollContainer.nativeElement.scrollBy({ left: -525, behavior: 'smooth' });
    }
  
    scrollRight() {
      this.scrollContainer.nativeElement.scrollBy({ left: 525, behavior: 'smooth' });
    }
    startAutoScroll() {
      setInterval(() => {
        if (this.scrollContainer) {
          this.scrollContainer.nativeElement.scrollBy({ left: 320, behavior: 'smooth' });
        }
      }, 1000);
    }
  

}
