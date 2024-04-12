package com.freelancers.backend.controller;

import com.freelancers.backend.model.Gig;
import com.freelancers.backend.model.Seller;
import com.freelancers.backend.model.User;
import com.freelancers.backend.repository.SellerRepository;
import com.freelancers.backend.repository.UserRepository;
import com.freelancers.backend.service.GigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.NoSuchElementException;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
@RestController
@RequestMapping("/gig")
public class GigController {
    @Autowired
    private GigService gigService;
    @Autowired
    private SellerRepository sellerRepository;
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/addGig/{userId}")
    public ResponseEntity<Gig> addGig(@PathVariable int userId, @RequestBody Gig gig) {
        Optional<User> userOptional = userRepository.findById(userId);
        User user = null;
        try {
            user = userOptional.orElseThrow(() -> new NoSuchElementException("User not found"));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        if (user != null) {
            Seller seller = sellerRepository.findByUser(user);
            if (seller != null) {
                gig.setOwner(seller);
                gigService.saveGig(gig);
                return ResponseEntity.ok(gig);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}
