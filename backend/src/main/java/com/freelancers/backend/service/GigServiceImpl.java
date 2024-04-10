package com.freelancers.backend.service;

import com.freelancers.backend.model.Gig;
import com.freelancers.backend.repository.GigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GigServiceImpl implements GigService {
    @Autowired
    private GigRepository gigRepository;

    @Override
    public Gig saveGig(Gig gig) {
        return gigRepository.save(gig);
    }
}
