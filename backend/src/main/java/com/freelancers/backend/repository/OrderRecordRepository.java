package com.freelancers.backend.repository;

import com.freelancers.backend.model.OrderRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRecordRepository extends JpaRepository<OrderRecord, Integer> {
}
