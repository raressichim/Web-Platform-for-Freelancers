package com.freelancers.backend.service;

import com.freelancers.backend.model.OrderRecord;
import com.freelancers.backend.repository.OrderRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrderRecordServiceImpl implements OrderRecordService{
    @Autowired
    OrderRecordRepository orderRecordRepository;
    @Override
    public OrderRecord saveOrderRecord(OrderRecord orderRecord) {
        return orderRecordRepository.save(orderRecord);
    }
}
