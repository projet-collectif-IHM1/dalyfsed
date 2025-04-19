import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// L'URL de base de votre API FastAPI
const API_URL = 'http://localhost:8000';


@Injectable({
  providedIn: 'root'
})
export class OffreService {

  constructor(private http: HttpClient) { }
    
        // Méthode pour récupérer tous les utilisateurs
        getOffre(): Observable<any> {
          return this.http.get(`${API_URL}/offres/`);
        }
      
        // Méthode pour créer un utilisateur
        createpaye(offre: any): Observable<any> {
          return this.http.post(`${API_URL}/offres/`, offre);
        }
  }

