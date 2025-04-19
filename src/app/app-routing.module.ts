import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

import { ContactComponent } from './contact/contact.component';
import { HotelComponent } from './hotel/hotel.component';
import { LoginComponent } from './login/login.component';
import { SingupComponent } from './singup/singup.component';
import { PayeFormComponent } from './paye-form/paye-form.component';
import { HotelFormComponent } from './hotel-form/hotel-form.component';
import { ChambreComponent } from './chambre/chambre.component';
import { ChambreFormComponent } from './chambre-form/chambre-form.component';
import { HotelUserComponent } from './hotel-user/hotel-user.component';
import { PayeAdminComponent } from './paye-admin/paye-admin.component';
import { ReservationAdminComponent } from './reservation-admin/reservation-admin.component';
import { DescriptionComponent } from './description/description.component';
import { OmraComponent } from './omra/omra.component';

const routes: Routes = [
  {path:'',
    pathMatch:'full',
    component:HomeComponent
  },
  {path:'Omra',
    pathMatch:'full',
    component:OmraComponent
  },
  {path:'Contact',
    pathMatch:'full',
    component:ContactComponent
  },
  {path:'Hotel',
    pathMatch:'full',
    component:HotelComponent
  },
  {path:'Hotel_User',
    pathMatch:'full',
    component:HotelUserComponent
  },
  {path:'Login',
    pathMatch:'full',
    component:LoginComponent
  },
  {path:'Signup',
    pathMatch:'full',
    component:SingupComponent
  },
  {path:'Paye',
    pathMatch:'full',
    component:PayeAdminComponent
  },

  {path:'Reservation',
    pathMatch:'full',
    component:ReservationAdminComponent
  },
 
  {
    path: 'create',
    pathMatch: 'full',
    component:PayeFormComponent
  },
  {
    path: 'Paye/edit/:id',
    pathMatch: 'full',
    component:PayeFormComponent
  },
  {
    path: 'createHotel',
    pathMatch: 'full',
    component:HotelFormComponent
  }
  ,{
    path: 'Hotel/edit/:id',
    pathMatch: 'full',
    component:HotelFormComponent
  },
  {
    path: 'Chambre',
    pathMatch: 'full',
    component:ChambreComponent
  },
  {
    path: 'createChambre',
    pathMatch: 'full',
    component:ChambreFormComponent
  },
  {
    path: 'Chambre/edit/:id',
    pathMatch: 'full',
    component:ChambreFormComponent
  },
  {
    path: 'Hotel_User/description/:id',
    pathMatch: 'full',
    component:DescriptionComponent  }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
