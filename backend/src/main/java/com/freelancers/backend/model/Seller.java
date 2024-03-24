package com.freelancers.backend.model;

import jakarta.persistence.*;
@Entity
public class Seller {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @OneToOne
    @PrimaryKeyJoinColumn
    private User user;
    private String description;
    private String education;
    private String skills;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getEducation() {
        return education;
    }

    public void setEducation(String education) {
        this.education = education;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

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
