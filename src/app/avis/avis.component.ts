import { Component, ElementRef, ViewChild } from '@angular/core';
import { AvisService } from '../Services/avis.service';

@Component({
  selector: 'app-avis',
  templateUrl: './avis.component.html',
  styleUrls: ['./avis.component.css']
})
export class AvisComponent {
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;

  avis: any[] = [];
  isLoading: boolean = true;

  constructor(private myService: AvisService) {}

  ngOnInit(): void {
    this.myService.getAvis().subscribe(
      async (data) => {
        const avisList = data.avis;

        // Récupérer les noms d'utilisateur pour chaque avis
        const avisAvecNoms = await Promise.all(
          avisList.map(async (avis: any) => {
            try {
              const user = await this.myService.getUserById(avis.user_id).toPromise();
              console.log(user.name );
             
              return { ...avis, nomUtilisateur: user.name };
            } catch (error) {
              console.error('Erreur lors de la récupération du nom utilisateur :', error);
              
              return { ...avis, nomUtilisateur: 'Utilisateur inconnu' };
            }
          })
        );

        this.avis = avisAvecNoms;
        this.isLoading = false;
      },
      (error) => {
        console.error("Erreur lors de la récupération des avis :", error);
        this.isLoading = false;
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
  getStars(count: number): any[] {
    return new Array(count);
  }
}
