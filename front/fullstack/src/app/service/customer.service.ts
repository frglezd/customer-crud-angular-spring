import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Observable } from 'rxjs';
import { Customer } from '../customer';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private api : string;

  constructor(private http : HttpClient, @Inject(PLATFORM_ID) platformId: object){
    // Server-side rendering calls the backend directly (API_URL_SERVER: the Docker
    // service name or the Cloud Run URL). The browser calls /api on this same server,
    // which forwards it to the backend (see server.ts).
    this.api = isPlatformServer(platformId) && typeof process !== 'undefined'
      ? process.env['API_URL_SERVER'] ?? 'http://localhost:8080/api/customers'
      : '/api/customers';
  }
  
  getCustomerList(): Observable<Customer []>{
      return this.http.get<Customer[]>(this.api);
    
  }

  createCustomer(customer: Customer):Observable<Customer>{
    return this.http.post<Customer>(this.api, customer);
  }

  deleteCustomerById(id:number):Observable<any>{
    return this.http.delete(this.api+'/'+id);
  }
}
