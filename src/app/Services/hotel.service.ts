import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HotelComponent } from '../hotel/hotel.component';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  private baseUrl = 'http://127.0.0.1:8000/hotels';

  constructor(private http:HttpClient) { }
   
  deleteHotel(hotelId: string): Observable<any> {
    return this.http.delete(`http://127.0.0.1:8000/hotels/${hotelId}`)
  }

  
      GetAllHotel():Observable<any>{
        return this.http.get<void>("http://127.0.0.1:8000/hotels/")}
      getHotelById(id:string):Observable<any>{
        return this.http.get<void>(`http://127.0.0.1:8000/hotels/${id}`)}
      createHotel(hotel: any): Observable<any> {
        return this.http.post("http://127.0.0.1:8000/hotels/", hotel);}
        updateHotel(id:string,hotel:any):Observable<any>{
          return this.http.put<void>(`http://127.0.0.1:8000/hotels/${id}`,hotel)}


}
