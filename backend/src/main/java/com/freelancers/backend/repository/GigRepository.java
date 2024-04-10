package com.freelancers.backend.repository;

import com.freelancers.backend.model.Gig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GigRepository extends JpaRepository<Gig,Integer> {
}
