import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-button-retour',
  templateUrl: './button-retour.component.html',
  styleUrls: ['./button-retour.component.css']
})
export class ButtonRetourComponent {
  showScrollButton = false;

  @HostListener("window:scroll", [])
  onWindowScroll() {
    this.showScrollButton = window.scrollY > 300; // Affiche le bouton après 300px de scroll
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
