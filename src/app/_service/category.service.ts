import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../_models/category';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private baseURL = environment.apiUrl + "/categories";

  constructor(private httpClient: HttpClient) { }
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/ld+json',
      'Accept': 'application/ld+json'
    });
  }

  getCategoryList(): Observable<Category[]> {
    return this.httpClient.get<Category[]>(this.baseURL);
  }

  createCategory(category: Category): Observable<Object> {
    return this.httpClient.post(this.baseURL, category,{
      headers: this.getHeaders()
    });
  }

  getCategoryById(id: number): Observable<Category> {
    return this.httpClient.get<Category>(`${this.baseURL}/${id}`);
  }

  updateCategory(id: number, category: Category): Observable<Object> {
    return this.httpClient.put(`${this.baseURL}/${id}`, category,{
      headers: this.getHeaders()
    });
  }

  deleteCategory(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.baseURL}/${id}`,{
      headers: this.getHeaders()
    });
  }
}