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
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String description;
    private float rating;
    @ManyToOne()
    @JoinColumn(name = "client_id")
    private User client;
    @ManyToOne()
    @JoinColumn(name= "gig_id")
    private Gig gig;
    @ManyToOne()
    @JoinColumn(name= "seller_id")
    private Seller seller;
    @ManyToOne()
    @JoinColumn(name= "order_id")
    private OrderRecord order;


}
