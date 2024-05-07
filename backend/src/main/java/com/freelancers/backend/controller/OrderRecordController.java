package com.freelancers.backend.controller;

import com.freelancers.backend.model.OrderRecord;
import com.freelancers.backend.repository.OrderRecordRepository;
import com.freelancers.backend.service.OrderRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
@RestController
@RequestMapping("/order")
public class OrderRecordController {
    @Autowired
    private OrderRecordService orderRecordService;
    @Autowired
    private OrderRecordRepository orderRecordRepository;

    @PostMapping("/addOrder")
    public void addOrderRecord(@RequestBody OrderRecord orderRecord) {
        orderRecord.setStatus("Pending");
        orderRecordService.saveOrderRecord(orderRecord);
    }

    @GetMapping("/getOrders/{sellerId}")
    public List<OrderRecord> getMyOrders(@PathVariable int sellerId) {
        return orderRecordRepository.findBySellerId(sellerId);
    }

    @GetMapping("/getMyProducts/{clientId}")
    public List<OrderRecord> getMyProducts(@PathVariable int clientId) {
        return orderRecordRepository.findByClientId(clientId);
    }

    @PutMapping("/updateStatus/{orderId}")
    public ResponseEntity<OrderRecord> updateStatus(@PathVariable int orderId, @RequestBody Map<String, String> status) {
        Optional<OrderRecord> orderRecordOptional = orderRecordRepository.findById(orderId);
        if (orderRecordOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            OrderRecord orderRecord = orderRecordOptional.get();
            orderRecord.setStatus(status.get("status"));
            orderRecordRepository.save(orderRecord);
            return ResponseEntity.ok(orderRecord);
        }
    }

    @PutMapping("/updateFile/{orderId}")
    public ResponseEntity<OrderRecord> updatesFile(@PathVariable int orderId,
                                                   @RequestPart("file") MultipartFile file,
                                                   @RequestPart("fileName") String fileName) {
        Optional<OrderRecord> orderRecordOptional = orderRecordRepository.findById(orderId);
        if (orderRecordOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            OrderRecord orderRecord = orderRecordOptional.get();
            try {
                orderRecord.setFile(file.getBytes());
                orderRecord.setFileName(fileName);
            } catch (IOException e) {
                return null;
            }
            orderRecordRepository.save(orderRecord);
            return ResponseEntity.ok(orderRecord);
        }
    }

    @GetMapping("/hasFile/{orderId}")
    public ResponseEntity<Boolean> hasFile(@PathVariable int orderId) {
        Optional<OrderRecord> order = orderRecordRepository.findById(orderId);
        if (!order.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        OrderRecord orderRecord = order.get();
        boolean hasFile = orderRecord.getFile() != null;
        return ResponseEntity.ok(hasFile);
    }

    @GetMapping("/getFile/{orderId}")
    public ResponseEntity<Object> getFile(@PathVariable int orderId){
        Optional<OrderRecord> order = orderRecordRepository.findById(orderId);
        if (order.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        OrderRecord orderRecord = order.get();
        return ResponseEntity.ok(orderRecord.getFile());
    }

}
