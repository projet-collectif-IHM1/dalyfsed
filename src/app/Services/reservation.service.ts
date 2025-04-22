import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor(private http:HttpClient) { }
  getAllReservation():Observable<any>{
    return this.http.get<void>("http://127.0.0.1:8000/reservations/")}
  deleteReservation(id: string): Observable<any> {
    return this.http.delete(`http://127.0.0.1:8000/reservations/${id}`)}
    getReservationById(id:string):Observable<any>{
      return this.http.get(`http://127.0.0.1:8000/reservations/${id}`)}
      createReservation(reservation: any): Observable<any> {
        return this.http.post("http://127.0.0.1:8000/reservations/", reservation);}
        upadateReservation(id:string,reservation:any):Observable<any>{
          return this.http.put<void>(`http://127.0.0.1:8000/reservations/${id}`,reservation)}
}
