import { Component, OnInit } from '@angular/core';
import { Customer } from '../../customer';
import { CustomerService } from '../../service/customer.service';

@Component({
  selector: 'app-customer-add',
  standalone: false,
  templateUrl: './customer-add.html',
  styleUrl: './customer-add.css',
})
export class CustomerAdd implements OnInit{

  firstName : string = '';
  lastName : string = '';
  email : string = '';

  constructor(private customerService: CustomerService){

  }

  ngOnInit(): void {
    
  }

  addCustomer(){
    let customer = new Customer(null, this.firstName, this.lastName, this.email);
    console.log(customer);
    this.customerService.createCustomer(customer).subscribe(
      res => console.log(res)
    );
  }

}
