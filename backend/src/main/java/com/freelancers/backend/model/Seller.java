package com.freelancers.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
public class Seller {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(length = 1000)
    private String description;
    private String education;
    private String skills;
    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @OneToMany(fetch = FetchType.LAZY,mappedBy = "owner", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Gig> gigs;

    @OneToMany(fetch = FetchType.LAZY,mappedBy = "seller")
    @JsonIgnore
    private List<OrderRecord> orders;

    @OneToMany(fetch = FetchType.LAZY,mappedBy = "seller")
    @JsonIgnore
    private List<Review> reviews;


}