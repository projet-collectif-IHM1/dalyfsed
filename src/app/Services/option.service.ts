import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OptionService {

  constructor(private http:HttpClient) { }
  getAllOptions():Observable<any>{
    return this.http.get<void>("http://127.0.0.1:8000/options/")}
  getOptionById(id:string):Observable<any>{
    return this.http.get<void>(`http://127.0.0.1:8000/options/${id}`)}
  deleteOption(id: string): Observable<any> {
    return this.http.delete(`http://127.0.0.1:8000/options/${id}`)}
  updateOption(id:string,option:any):Observable<any>{
    return this.http.put<void>(`http://127.0.0.1:8000/options/${id}`,option)}
    createOption(option: any): Observable<any> {
      return this.http.post("http://127.0.0.1:8000/options/", option);}
  getOptionByChambreId(id:string):Observable<any>{
    return this.http.get(`http://127.0.0.1:8000/options/chambre/${id}`)}
 

}