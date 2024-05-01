package com.freelancers.backend.controller;

import com.freelancers.backend.model.OrderRecord;
import com.freelancers.backend.service.OrderRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
@RestController
@RequestMapping("/order")
public class OrderRecordController {
    @Autowired
    private OrderRecordService orderRecordService;
    @PostMapping("/addOrder")
    public void addOrderRecord(@RequestBody OrderRecord orderRecord){
        orderRecordService.saveOrderRecord(orderRecord);
    }

}
