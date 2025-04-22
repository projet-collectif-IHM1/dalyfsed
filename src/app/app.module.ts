import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatChipsModule} from '@angular/material/chips';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { HeaderComponent } from './shared/header/header.component';
import {MatIconModule} from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { HomeComponent } from './home/home.component';

import { ContactComponent } from './contact/contact.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HotelComponent } from './hotel/hotel.component';
import { HttpClientModule } from '@angular/common/http';
import { KnobModule } from 'primeng/knob';
import { CarouselModule } from 'primeng/carousel';  // Import du module Carousel
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { CarsoulComponent } from './carsoul/carsoul.component';
import { HotelCardComponent } from './hotel-card/hotel-card.component';
import { BackgroundCarouselComponent } from './background-carousel/background-carousel.component';


import { FormsModule } from '@angular/forms';
import { SatisticComponent } from './satistic/satistic.component';
import { AvisComponent } from './avis/avis.component';
import { LoginComponent } from './login/login.component';
import { SingupComponent } from './singup/singup.component';
import { HeaderAdminComponent } from './shared/header-admin/header-admin.component';
import { HotelUserComponent } from './hotel-user/hotel-user.component';
import { CommonModule } from '@angular/common';






import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component'
import {MatDialogModule} from '@angular/material/dialog';

import { PayeFormComponent } from './paye-form/paye-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HotelFormComponent } from './hotel-form/hotel-form.component';
import { ChambreComponent } from './chambre/chambre.component';
import { ChambreFormComponent } from './chambre-form/chambre-form.component';
import { PayeAdminComponent } from './paye-admin/paye-admin.component';
import { ReservationAdminComponent } from './reservation-admin/reservation-admin.component';
import { ButtonRetourComponent } from './button-retour/button-retour.component';
import { DescriptionComponent } from './description/description.component';
import { HotelsRecommandesComponent } from './hotels-recommandes/hotels-recommandes.component';
import { OmraComponent } from './omra/omra.component';
import { AboutComponent } from './about/about.component';
import { CarsoulBgComponent } from './carsoul-bg/carsoul-bg.component';
import { AvisAdminComponent } from './avis-admin/avis-admin.component';
import { UserAdminComponent } from './user-admin/user-admin.component';
import { OffreComponent } from './offre/offre.component';
import { OffreFormComponent } from './offre-form/offre-form.component';
import { ReservationFormComponent } from './reservation-form/reservation-form.component';
import { OptionComponent } from './option/option.component';
import { OptionFormComponent } from './option-form/option-form.component';
import { LogoutComponent } from './logout/logout.component';
@NgModule({
  declarations: [
    AppComponent,
 
    HeaderComponent,
      HomeComponent,
  
      ContactComponent,
      FooterComponent,
      HotelComponent,
      CarsoulComponent,
      HotelCardComponent,
      BackgroundCarouselComponent,
      SatisticComponent,
      AvisComponent,
      LoginComponent,
      SingupComponent,
      HeaderAdminComponent,
      HotelUserComponent,
      ChambreFormComponent,
      ChambreComponent,
      HotelFormComponent,
      PayeFormComponent,
      ConfirmDialogComponent,
      PayeAdminComponent,
      ReservationAdminComponent,
      ButtonRetourComponent,
      DescriptionComponent,
      HotelsRecommandesComponent,
      OmraComponent,
      AboutComponent,
      CarsoulBgComponent,
      AvisAdminComponent,
      UserAdminComponent,
      OffreComponent,
      OffreFormComponent,
      ReservationFormComponent,
      OptionComponent,
      OptionFormComponent,
      LogoutComponent, 
      
      
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatIconModule,
    MatTableModule,
    HttpClientModule ,
    CarouselModule,
    CarouselModule,
    BrowserAnimationsModule,
    ButtonModule,
    KnobModule,
    InputSwitchModule,
    NgScrollbarModule,
    CommonModule,
    FormsModule,
    MatMenuModule,
    BrowserModule,
    BrowserAnimationsModule, // Required for Angular Material
    MatDialogModule,         // Import MatDialogModule
    MatButtonModule  ,  
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatIconModule,
    MatTableModule,
    HttpClientModule ,
    CarouselModule,
    CarouselModule,
    BrowserAnimationsModule,
    ButtonModule,
    KnobModule,
    InputSwitchModule,
    NgScrollbarModule,
    MatMenuModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    CommonModule,
  

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
