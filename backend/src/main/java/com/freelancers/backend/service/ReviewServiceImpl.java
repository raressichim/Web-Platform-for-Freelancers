package com.freelancers.backend.service;

import com.freelancers.backend.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReviewServiceImpl implements ReviewService{
    @Autowired
    private ReviewRepository reviewRepository;

    @Override
    public boolean hasClientReviewedOrder(int clientId, int orderId) {
        return reviewRepository.existsByClientIdAndOrderId(clientId, orderId);
    }
}
