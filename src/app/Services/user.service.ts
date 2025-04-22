import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }
  getAllUsers():Observable<any>{
    return this.http.get<void>("http://127.0.0.1:8000/users/")}
    getUserById(id:string):Observable<any>{
      return this.http.get<void>(`http://127.0.0.1:8000/users/${id}`)}
    deleateUser(id:string):Observable<any>{
      return this.http.delete<void>(`http://127.0.0.1:8000/users/${id}`)}
}
