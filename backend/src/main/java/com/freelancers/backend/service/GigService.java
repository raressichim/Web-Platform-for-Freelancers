package com.freelancers.backend.service;

import com.freelancers.backend.model.Gig;

import java.util.List;

public interface GigService {
    public Gig saveGig(Gig gig);
    public List<Gig> getGigs();
}
