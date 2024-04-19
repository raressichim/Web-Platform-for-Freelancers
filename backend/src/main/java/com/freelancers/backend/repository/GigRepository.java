package com.freelancers.backend.repository;

import com.freelancers.backend.model.Gig;
import com.freelancers.backend.model.Seller;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GigRepository extends JpaRepository<Gig,Integer> {
    List<Gig> findByOwner(Seller owner);
}
