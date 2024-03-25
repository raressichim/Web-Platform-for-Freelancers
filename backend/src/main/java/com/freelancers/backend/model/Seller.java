package com.freelancers.backend.model;

import jakarta.persistence.*;
@Entity
public class Seller {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String description;
    private String education;
    private String skills;
    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("Seller{");
        sb.append("id=").append(id);
        sb.append(", user=").append(user);
        sb.append(", description='").append(description).append('\'');
        sb.append(", education='").append(education).append('\'');
        sb.append(", skills='").append(skills).append('\'');
        sb.append('}');
        return sb.toString();
    }
}
