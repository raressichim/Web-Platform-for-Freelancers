package com.freelancers.backend.controller;

import com.freelancers.backend.model.User;
import com.freelancers.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/addUser")
    public void addUser(@RequestBody User user) {
        userService.saveUser(user);
    }

    @GetMapping("/getUsers")
    public List<User> getAll() {
        return userService.getUsers();
    }

    @PostMapping("/login")
    public ResponseEntity<Boolean> login(@RequestBody Map<String,String> req) {
        boolean u = userService.login(req.get("email"),req.get("password"));
        if (u) {
            return ResponseEntity.ok(true);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
