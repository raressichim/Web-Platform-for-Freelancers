package com.freelancers.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@NoArgsConstructor
@ToString
public class Gig {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String title;
    private String tags;
    private float price;
    private String description;
    private String photoUrl;
    @ManyToOne
    @JoinColumn(name = "seller_id")
    private Seller owner;
}
