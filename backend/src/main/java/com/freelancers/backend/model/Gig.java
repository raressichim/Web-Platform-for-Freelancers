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
    @Column(length = 1000)
    private String description;
    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] photo;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "seller_id")
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