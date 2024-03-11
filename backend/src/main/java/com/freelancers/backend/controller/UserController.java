package com.freelancers.backend.controller;

import com.freelancers.backend.model.User;
import com.freelancers.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService userService;
    @PostMapping("/addUser")
    public String addUser(@RequestBody User user){
        userService.saveUser(user);
        return "New user added";
    }
    @GetMapping("/getUsers")
    public List<User> getAll(){
        return userService.getUsers();
    }
}
