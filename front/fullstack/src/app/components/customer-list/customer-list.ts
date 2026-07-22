import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../../customer';
import { CustomerService } from '../../service/customer.service';

@Component({
  selector: 'app-customer-list',
  standalone: false,
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.css',
})
export class CustomerListComponent implements OnInit{

  customers$! : Observable<Customer[]>;

  constructor(private customerService : CustomerService){}
  ngOnInit(): void {
    this.listCustomers();
  }

  listCustomers(){
    this.customers$ = this.customerService.getCustomerList();
  }

  deleteCustomer(id: number | null){
    if (id === null) return;
    this.customerService.deleteCustomerById(id).subscribe(
      ()=> this.listCustomers()
    );
  }

}
