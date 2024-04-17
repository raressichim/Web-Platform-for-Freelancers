package com.freelancers.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

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
    @Lob
    private byte[] photo;
    @ManyToOne
    @JoinColumn(name = "seller_id")
    @JsonIgnore
    private Seller owner;

    public Gig(String title, String tags, float price, String description, byte[] photo, Seller owner) {
        this.title = title;
        this.tags = tags;
        this.price = price;
        this.description = description;
        this.photo = photo;
        this.owner = owner;
    }
}