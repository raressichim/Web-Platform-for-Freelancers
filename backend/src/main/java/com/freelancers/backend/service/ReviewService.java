package com.freelancers.backend.service;

public interface ReviewService {

    boolean hasClientReviewedOrder(int clientId, int orderId);
}
