import { Component } from '@angular/core';

@Component({
  selector: 'app-carsoul-bg',
  templateUrl: './carsoul-bg.component.html',
  styleUrls: ['./carsoul-bg.component.css']
})
export class CarsoulBgComponent {
  currentIndex: number = 0;
  images: string[] = [

    'assets/images/bg_6.jpg',
    'assets/images/bg_5.jpg'
  ];

  next() {
    if (this.currentIndex < this.images.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0; // Retourne à la première image
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.images.length - 1; // Retourne à la dernière image
    }
  }

}
