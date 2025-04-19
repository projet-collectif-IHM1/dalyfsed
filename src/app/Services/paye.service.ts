import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// L'URL de base de votre API FastAPI
const API_URL = 'http://localhost:8000';

@Injectable({
  providedIn: 'root'
})
export class PayeService {
  // Define the apiUrl property
  private apiUrl = 'http://127.0.0.1:8000/payes';

  constructor(private http: HttpClient) { }

    // Méthode pour récupérer tous les utilisateurs
    getPaye(): Observable<any> {
      return this.http.get(`${API_URL}/payes/`);
    }
  
    // Méthode pour créer un utilisateur
    createpaye(paye: any): Observable<any> {
      return this.http.post(`${API_URL}/payes/`, paye);
    }
    getAllPaye():Observable<any>{
      return this.http.get<void>("http://127.0.0.1:8000/payes/")}
    getPayeById(id:string):Observable<any>{
      return this.http.get<void>(`http://127.0.0.1:8000/payes/${id}`)}
      deletePaye(id: string): Observable<any> {
        const url = `${this.apiUrl}/${id}`; // URL for deleting a specific Paye
        return this.http.delete(url);
      }
    updatePaye(id:string,paye:any):Observable<any>{
      return this.http.put<void>(`http://127.0.0.1:8000/payes/${id}`,paye)}
      addPaye(paye: any): Observable<any> {
        return this.http.post("http://127.0.0.1:8000/payes/", paye);}
    
    }
