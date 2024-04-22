package com.freelancers.backend.controller;

import com.freelancers.backend.model.Gig;
import com.freelancers.backend.model.Seller;
import com.freelancers.backend.model.User;
import com.freelancers.backend.repository.GigRepository;
import com.freelancers.backend.repository.SellerRepository;
import com.freelancers.backend.repository.UserRepository;
import com.freelancers.backend.service.GigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
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
    @Autowired
    private GigRepository gigRepository;

    @PostMapping(value = "/addGig/{userId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Gig> addGig(@PathVariable int userId, @RequestPart("title") String title,
                                      @RequestPart("tags") String tags,
                                      @RequestPart("price") String price,
                                      @RequestPart("description") String description,
                                      @RequestPart("photo") MultipartFile photo) throws IOException {

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
                float priceF = Float.parseFloat(price);
                Gig gig = new Gig(title, tags, priceF, description, photo.getBytes(), seller);
                gig.setOwner(seller);
                gigService.saveGig(gig);
                return ResponseEntity.ok(gig);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @GetMapping(value = "/getGigs")
    public List<Gig> getGigs() {
        return gigService.getGigs();
    }

    @GetMapping("/getYourGigs/{userId}")
    public List<Gig> getYourGigs(@PathVariable int userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        User user = null;
        try {
            user = userOptional.orElseThrow(() -> new NoSuchElementException("User not found"));
        } catch (NoSuchElementException e) {
            return null;
        }
        Seller owner = sellerRepository.findByUser(user);
        return gigService.getYourGigs(owner);
    }

    @GetMapping("/getGig/{gigId}")
    public Optional<Gig> getGigById(@PathVariable int gigId) {
        return gigRepository.findById(gigId);
    }
}
