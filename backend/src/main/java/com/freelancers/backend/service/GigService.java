package com.freelancers.backend.service;

import com.freelancers.backend.model.Gig;
import com.freelancers.backend.model.Seller;

import java.util.List;

public interface GigService {
    public Gig saveGig(Gig gig);
    public List<Gig> getGigs();
    public List<Gig> getYourGigs(Seller owner);
}
