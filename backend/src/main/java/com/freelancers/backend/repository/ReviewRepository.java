package com.freelancers.backend.repository;

import com.freelancers.backend.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review,Integer> {
    List<Review> findBySellerId(int sellerId);
    List<Review> findByGigId(int gigId);

    boolean existsByClientIdAndOrderId(int clientId, int orderId);
}
