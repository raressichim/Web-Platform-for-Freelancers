package com.freelancers.backend.controller;

import com.freelancers.backend.model.Seller;
import com.freelancers.backend.model.User;
import com.freelancers.backend.repository.UserRepository;
import com.freelancers.backend.service.SellerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.NoSuchElementException;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
@RestController
@RequestMapping("/seller")
public class SellerController {
    @Autowired
    private SellerService sellerService;
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/addSeller/{userId}")
    public ResponseEntity<Seller> addSeller(@PathVariable int userId, @RequestBody Seller seller) {
        Optional<User> userOptional = userRepository.findById(userId);
        User user = null;
        try {
            user = userOptional.orElseThrow(() -> new NoSuchElementException("User not found"));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        if (user != null) {
            seller.setUser(user);
            sellerService.saveSeller(seller);
            return ResponseEntity.ok(seller);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
