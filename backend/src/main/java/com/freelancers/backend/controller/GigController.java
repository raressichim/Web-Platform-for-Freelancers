package com.freelancers.backend.controller;

import com.freelancers.backend.model.Gig;
import com.freelancers.backend.service.GigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
@RestController
@RequestMapping("/gig")
public class GigController {
    @Autowired
    private GigService gigService;
    @PostMapping("/addGig")
    public void addGig(@RequestBody Gig gig){
        gigService.saveGig(gig);
    }
}
