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
          getAllAvis():Observable<any>{
            return this.http.get<void>("http://127.0.0.1:8000/avis/")}
         getAvisById(id:string):Observable<any>{
           return this.http.get<void>(`http://127.0.0.1:8000/avis/${id}`)}
         deleteAvis(id: string): Observable<any> {
           return this.http.delete(`http://127.0.0.1:8000/avis/${id}`)} 
           getUserById(id:string):Observable<any>{
            return this.http.get<void>(`http://127.0.0.1:8000/users/${id}`)}
}
