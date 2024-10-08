package com.freelancers.backend.repository;

import com.freelancers.backend.model.Seller;
import com.freelancers.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User,Integer> {
    User findByEmail(String email);
    User findBySeller(Seller seller);
}
