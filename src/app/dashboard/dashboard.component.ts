import { Component, OnInit } from '@angular/core';
import { UserService } from '../Services/user.service';
import { HotelService } from '../Services/hotel.service';
import { PayeService } from '../Services/paye.service';
import { ReservationService } from '../Services/reservation.service';
import { ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  nbUsers: number = 0;
  nbHotels: number = 0;
  nbReservations: number = 0;
  nbpayes: number = 0;
  constructor(private us:UserService ,private ps :PayeService ,private rs:ReservationService ,private hs:HotelService) { }
ngOnInit(): void {
  this.us.getAllUsers().subscribe(
    (data) => {
      this.nbUsers = data.users.length;
      console.log("nbpayes",data);
    },
    (error) => {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
    }
  );
  this.ps.getAllPaye().subscribe(
    (data) => {
      this.nbpayes = data.payes.length;
      console.log("nbpayes",data);
    },
    (error) => {
      console.error('Erreur lors de la récupération des pays:', error);
    }                 
  );
  this.rs.getAllReservation().subscribe(
    (data) => {
      this.nbReservations = data.reservations.length;
      console.log("nbpayes",data);
    },
    (error) => {
      console.error('Erreur lors de la récupération des pays:', error);
    }                 
  );
  this.hs.GetAllHotel().subscribe(
    (data) => {
      this.nbHotels = data.hotels.length;
      console.log("nbpayes",data);
    },
    (error) => {
      console.error('Erreur lors de la récupération des pays:', error);
    }                 
  );
            
}

chartOptions: ChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    }
  }
};
chartLabels: string[] = ['Tunisia', 'Kingdom of Saudi Arabia', 'France'];
chartData = {
  labels: this.chartLabels,
  datasets: [
    { data: [65, 59, 80], label: 'Réservations' }
  ]
};


}