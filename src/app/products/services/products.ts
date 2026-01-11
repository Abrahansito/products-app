import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = 'https://products-api-t9hi.onrender.com/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<any[]> {
    console.log('Llamando a:', this.apiUrl);
    return this.http.get<any[]>(this.apiUrl);
  }

  searchProducts(term: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search?q=${term}`);
  }

  createProduct(product: any): Observable<any> {
    return this.http.post(this.apiUrl, product);
  }

  updateProduct(id: number, product: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
