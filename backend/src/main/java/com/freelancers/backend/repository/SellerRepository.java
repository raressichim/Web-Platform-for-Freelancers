package com.freelancers.backend.repository;

import com.freelancers.backend.model.Seller;
import com.freelancers.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SellerRepository extends JpaRepository<Seller,Integer> {
    Seller findByUser(User user);
}
