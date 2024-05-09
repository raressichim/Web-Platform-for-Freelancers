package com.freelancers.backend.controller;

import com.freelancers.backend.model.Seller;
import com.freelancers.backend.model.User;
import com.freelancers.backend.repository.SellerRepository;
import com.freelancers.backend.repository.UserRepository;
import com.freelancers.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SellerRepository sellerRepository;

    @PostMapping("/addUser")
    public void addUser(@RequestBody User user) {
        userService.saveUser(user);
    }

    @GetMapping("/getUsers")
    public List<User> getAll() {
        return userService.getUsers();
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody Map<String, String> req) {
        User u = userService.login(req.get("email"), req.get("password"));
        if (u != null) {
            return ResponseEntity.ok(u);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("getUser/{sellerId}")
    public ResponseEntity<User> getUser(@PathVariable int sellerId) {
        Optional<Seller> sellerOptional = sellerRepository.findById(sellerId);
        if (sellerOptional.isPresent()) {
            Seller seller = sellerOptional.get();
            User user = userRepository.findBySeller(seller);
            if (user != null) {
                return ResponseEntity.ok(user);
            } else {
                return ResponseEntity.notFound().build();
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/changePassword")
    public ResponseEntity<User> changePassword(@RequestBody Map<String, String> newData) {
        String email = newData.get("email");
        String newPassword = newData.get("newPassword");
        Optional<User> userOptional = Optional.ofNullable(userRepository.findByEmail(email));
        if (userOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            User user = userOptional.get();
            user.setPassword(newPassword);
            userService.saveUser(user);
            return ResponseEntity.ok(user);
        }
    }
}
