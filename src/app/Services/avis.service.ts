import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
const API_URL = 'http://localhost:8000';
@Injectable({
  providedIn: 'root'
})
export class AvisService {
    constructor(private http: HttpClient) { }
      
          // Méthode pour récupérer tous les utilisateurs
          getAvis(): Observable<any> {
            return this.http.get(`${API_URL}/avis/`);
          }
        
          // Méthode pour créer un utilisateur
          createavis(offre: any): Observable<any> {
            return this.http.post(`${API_URL}/avis/`, offre);
          }
}
