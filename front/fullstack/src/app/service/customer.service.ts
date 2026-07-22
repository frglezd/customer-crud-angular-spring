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
    // Server-side rendering runs inside the frontend container, so 'localhost' won't
    // reach the backend container - it needs the Docker network service name instead.
    // The browser always uses the published host port.
    const serverApiUrl = isPlatformServer(platformId) && typeof process !== 'undefined'
      ? process.env['API_URL_SERVER']
      : undefined;
    this.api = serverApiUrl ?? 'http://localhost:8080/api/customers';
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
