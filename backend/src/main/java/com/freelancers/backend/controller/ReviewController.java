package com.freelancers.backend.controller;

import com.freelancers.backend.model.Review;
import com.freelancers.backend.repository.ReviewRepository;
import com.freelancers.backend.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
@RestController
@RequestMapping("/review")
public class ReviewController {
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private ReviewService reviewService;

    @PostMapping("/addReview")
    public void addReview(@RequestBody Review review) {
        reviewRepository.save(review);
    }

    @GetMapping("/getSellerReviews/{sellerId}")
    public List<Review> getSellerReviews(@PathVariable int sellerId) {
        return reviewRepository.findBySellerId(sellerId);
    }

    @GetMapping("/getGigReview/{gigId}")
    public List<Review> getGigReviews(@PathVariable int gigId) {
        return reviewRepository.findByGigId(gigId);
    }

    @GetMapping("/hasReview/{clientId}/{orderId}")
    public ResponseEntity<Map<String, String>> hasReview(@PathVariable int clientId, @PathVariable int orderId) {
        boolean hasReviewed = reviewService.hasClientReviewedOrder(clientId, orderId);
        Map<String, String> response = new HashMap<>();
        if (hasReviewed) {
            response.put("message", "Review already submitted for this order.");
        } else {
            response.put("message", "Client can review this order.");
        }
        return ResponseEntity.ok(response);
    }
}
