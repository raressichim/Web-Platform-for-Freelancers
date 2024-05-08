package com.freelancers.backend.service;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class TagService {

    private final Set<String> programmingTags = Set.of(
            "java",
            "c++",
            "design patterns",
            "c",
            "python",
            "web programming",
            "javascript",
            "react",
            "spring boot",
            "html",
            "css",
            "php",
            "ruby",
            "sql",
            "mongodb",
            "node.js",
            "angular",
            "typescript",
            "vue.js",
            "django",
            "flask",
            "ruby on rails",
            "asp.net",
            "express.js",
            "rust",
            "swift",
            "go",
            "kotlin",
            "scala",
            "haskell",
            "clojure",
            "r",
            "bash",
            "matlab",
            "assembly",
            "objective-c",
            "groovy",
            "delphi",
            "cobol",
            "dart",
            "powershell",
            "solidity",
            "elixir"
    );


    public List<String> autocompleteTags(String prefix) {
        return programmingTags.stream()
                .filter(tag -> tag.toLowerCase().startsWith(prefix.toLowerCase()))
                .collect(Collectors.toList());
    }
}

