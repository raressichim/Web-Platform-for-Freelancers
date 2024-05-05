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
@NoArgsConstructor
@ToString
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(unique = true)
    private String username;
    private String name;
    @Column(unique = true)
    private String email;
    private String password;
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private Seller seller;

    @OneToMany(fetch = FetchType.LAZY,mappedBy = "client")
    @JsonIgnore
    private List<OrderRecord> orders;

    @OneToMany(fetch = FetchType.LAZY,mappedBy = "client")
    @JsonIgnore
    private List<Review> reviews;
}