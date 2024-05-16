package com.freelancers.backend.service;

import com.freelancers.backend.model.Gig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.List;

@Service
public class PredictionService {
    @Autowired
    private GigService gigService;

    public void exportGigsToCSV(String fileName) throws IOException {
        List<Gig> gigs = gigService.getGigs();
        String filePath = Paths.get("output", fileName).toString();
        try (FileWriter writer = new FileWriter(filePath)) {
            for (Gig gig : gigs) {
                writer.append(escapeCsvField(gig.getTitle())).append(",")
                        .append(escapeCsvField(gig.getTags())).append(",")
                        .append(String.valueOf(gig.getPrice())).append("\n");
            }
        }
    }

    private String escapeCsvField(String field) {
        if (field.contains(",") || field.contains("\n") || field.contains("\"")) {
            field = field.replace("\"", "\"\"");
            return "\"" + field + "\"";
        }
        return field;
    }
}
