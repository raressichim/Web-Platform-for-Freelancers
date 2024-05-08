package com.freelancers.backend.controller;

import com.freelancers.backend.model.User;
import com.freelancers.backend.repository.UserRepository;
import com.freelancers.backend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.Random;
@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
@RestController
@RequestMapping("/email")
public class EmailController {
    @Autowired
    private EmailService emailService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/send")
    public ResponseEntity<String> sendEmail(@RequestBody Map<String,String> emailData){
        String email = emailData.get("email");
        String subject = "Remember password";
        String body="Hello! This is your token: ";
        Optional<User> userOptional = Optional.ofNullable(userRepository.findByEmail(email));
        if(userOptional.isEmpty()){
            return ResponseEntity.notFound().build();
        } else{
            User user = userOptional.get();
            Random random = new Random();
            int randomNumber = random.nextInt(900000) + 100000;
            body+=randomNumber;
        }
        emailService.sendEmail(email, subject, body);

        return ResponseEntity.ok("Email sent successfully");
    }
}
