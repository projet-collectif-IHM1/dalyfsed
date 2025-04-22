import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChambreService {

  constructor(private http:HttpClient) { }
  getAllChambre():Observable<any>{
    return this.http.get<void>("http://127.0.0.1:8000/chambres/")}
  getChambreById(id:string):Observable<any>{
    return this.http.get<void>(`http://127.0.0.1:8000/chambres/${id}`)}
    deleteChambre(id: string): Observable<any> {
      return this.http.delete(`http://127.0.0.1:8000/chambres/${id}`)}
      updateChambre(id:string,chambre:any):Observable<any>{
        return this.http.put<void>(`http://127.0.0.1:8000/chambres/${id}`,chambre)}
        createChambre(chambre: any): Observable<any> {
          return this.http.post("http://127.0.0.1:8000/chambres/", chambre);}
          getChambreByHotelId(id:string):Observable<any>{
            return this.http.get(`http://127.0.0.1:8000/chambres/hotel/${id}`)}

}
