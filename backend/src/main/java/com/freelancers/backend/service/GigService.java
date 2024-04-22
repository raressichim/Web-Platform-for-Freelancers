package com.freelancers.backend.service;

import com.freelancers.backend.model.Gig;
import com.freelancers.backend.model.Seller;

import java.util.List;
import java.util.Optional;

public interface GigService {
    Gig saveGig(Gig gig);

    List<Gig> getGigs();

    List<Gig> getYourGigs(Seller owner);

}
