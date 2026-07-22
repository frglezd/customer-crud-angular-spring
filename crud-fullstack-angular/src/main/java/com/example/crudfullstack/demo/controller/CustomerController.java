package com.example.crudfullstack.demo.controller;

import com.example.crudfullstack.demo.entity.Customer;
import com.example.crudfullstack.demo.service.CustomerService;
import org.springframework.web.bind.annotation.*;

import java.util.List;



@RestController
//localhost:8080/api/customers
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @PostMapping
    public Customer save(@RequestBody Customer customer){
        return customerService.save(customer);
    }

    @GetMapping
    public List<Customer> findAll(){
        return customerService.findAll();
    }

    @GetMapping("/{id}")
    public Customer findById(@PathVariable("id") Integer id){
        return customerService.findById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable("id") Integer id){
        customerService.deleteById(id);
    }

    @PutMapping
    public Customer updateCustomer(@RequestBody Customer customer){
        Customer customerDb = customerService.findById(customer.getId());
        customerDb.setFirstName(customer.getFirstName());
        customerDb.setLastName(customer.getLastName());
        customerDb.setEmail(customer.getEmail());
        return customerService.update(customerDb);
    }
}
