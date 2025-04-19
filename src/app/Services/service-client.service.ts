import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// L'URL de base de votre API FastAPI
const API_URL = 'http://localhost:8000';

@Injectable({
  providedIn: 'root'
})
export class ServiceClientService{

  constructor(private http: HttpClient) { }

  // Méthode pour récupérer tous les utilisateurs
  getUsers(): Observable<any> {
    return this.http.get(`${API_URL}/users/`);
  }

  // Méthode pour créer un utilisateur
  createUser(user: any): Observable<any> {
    return this.http.post(`${API_URL}/users/`, user);
  }

  // Méthode pour récupérer tous les hôtels
  getHotels(): Observable<any> {
    return this.http.get(`${API_URL}/hotels/`);
  }

  // Méthode pour ajouter un hôtel
  createHotel(hotel: any): Observable<any> {
    return this.http.post(`${API_URL}/hotels/`, hotel);
  }

  // Méthode pour ajouter un avis
  createAvis(avis: any): Observable<any> {
    return this.http.post(`${API_URL}/avis/`, avis);
  }

  // Autres méthodes similaires pour les chambres, offres, etc...
}
