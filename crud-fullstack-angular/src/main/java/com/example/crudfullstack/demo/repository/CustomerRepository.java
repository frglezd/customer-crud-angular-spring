package com.example.crudfullstack.demo.repository;

import com.example.crudfullstack.demo.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

//what the interface does is to inherit all crud methods to work on the Customer entity
@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {
}
