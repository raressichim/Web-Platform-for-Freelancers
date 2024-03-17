package com.freelancers.backend.service;

import com.freelancers.backend.model.User;

import java.util.List;

public interface UserService {
    public User saveUser(User user);
    public List<User> getUsers();
    public boolean login(String email,String password);
}
