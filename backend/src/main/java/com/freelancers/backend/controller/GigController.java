package com.freelancers.backend.controller;

import com.freelancers.backend.model.Gig;
import com.freelancers.backend.model.Seller;
import com.freelancers.backend.repository.SellerRepository;
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
    @PostMapping("/addGig/{sellerId}")
    public ResponseEntity<Gig> addGig(@PathVariable int sellerId,@RequestBody Gig gig){
        Optional<Seller> sellerOptional = sellerRepository.findById(sellerId);
        Seller seller = null;
        try {
            seller = sellerOptional.orElseThrow(() -> new NoSuchElementException("Seller not found"));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        if (seller!= null) {
            gig.setOwner(seller);
            gigService.saveGig(gig);
            return ResponseEntity.ok(gig);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
