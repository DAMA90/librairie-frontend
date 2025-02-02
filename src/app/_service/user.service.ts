import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Users } from '../_models/users';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: "root",
})
export class UserService {
  private baseURL = environment.apiUrl + "/utilisateurs";

  constructor(private httpClient: HttpClient) {}

  getUserList(): Observable<Users[]> {
    return this.httpClient.get<Users[]>(`${this.baseURL}`);
  }

  createUser(user: Users): Observable<Object> {
    return this.httpClient.post(`${this.baseURL}`, user);
  }

  getUserById(id: number): Observable<Users> {
    return this.httpClient.get<Users>(`${this.baseURL}/${id}`);
  }

  updateUser(id: number, user: Users): Observable<Object> {
    return this.httpClient.put(`${this.baseURL}/${id}`, user);
  }

  deleteUser(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.baseURL}/${id}`);
  }
}