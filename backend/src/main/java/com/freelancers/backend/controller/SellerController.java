package com.freelancers.backend.controller;

import com.freelancers.backend.model.Seller;
import com.freelancers.backend.model.User;
import com.freelancers.backend.repository.SellerRepository;
import com.freelancers.backend.repository.UserRepository;
import com.freelancers.backend.service.SellerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
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

    @Autowired
    private SellerRepository sellerRepository;

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
            System.out.println(seller.toString());
            return ResponseEntity.ok(seller);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("/check/{userId}")
    public ResponseEntity<Boolean> checkIfSeller(@PathVariable int userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            Seller seller = sellerRepository.findByUser(user);
            if (seller != null) {
                return ResponseEntity.ok(true);
            } else {
                return ResponseEntity.ok(false);
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/getSeller/{userId}")
    public ResponseEntity<Seller> getSeller(@PathVariable int userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            Seller seller = sellerRepository.findByUser(user);
            if (seller != null) {
                return ResponseEntity.ok(seller);
            } else {
                return ResponseEntity.notFound().build();
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/update/{userId}")
    public ResponseEntity<Seller> updateSeller(@PathVariable int userId, @RequestBody Map<String,String> sellerData) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            Seller seller = sellerRepository.findByUser(user);
            if (seller != null) {
                seller.setDescription(sellerData.get("description"));
                seller.setEducation(sellerData.get("education"));
                seller.setSkills(sellerData.get("skills"));
                sellerRepository.save(seller);
                return ResponseEntity.ok(seller);
            } else {
                return ResponseEntity.notFound().build();
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
