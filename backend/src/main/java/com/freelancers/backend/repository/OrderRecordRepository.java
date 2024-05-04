package com.freelancers.backend.repository;

import com.freelancers.backend.model.OrderRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRecordRepository extends JpaRepository<OrderRecord, Integer> {
    List<OrderRecord> findBySellerId(int sellerId);
    List<OrderRecord> findByClientId(int clientId);
}
