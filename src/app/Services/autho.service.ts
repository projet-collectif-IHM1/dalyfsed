import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
const API_URL = 'http://localhost:8000';
@Injectable({
  providedIn: 'root'
})
export class AuthoService {
  constructor(private http: HttpClient) { }
         // Méthode pour créer un utilisateur
         signInWithEmailAndPassword(email: string, password: string): Observable<any> {
                  return this.http.post(`${API_URL}/login/`, { email, password });
                }
                signUp(email: string, password: string,name: string): Observable<any> {
                  return this.http.post(`${API_URL}/register/`, { email, password ,name });
                }
          
//   constructor(private afAuth: AngularFireAuth) {
      
//   }

// signInWithEmailAndPassword(email: string, password: string) {
// return this.afAuth.signInWithEmailAndPassword(email, password);
// }

// signOut() {
// return this.afAuth.signOut();
// }
}
