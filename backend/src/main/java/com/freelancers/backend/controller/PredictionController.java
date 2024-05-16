package com.freelancers.backend.controller;

import com.freelancers.backend.service.PredictionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Map;

@RestController
@RequestMapping("/export")
public class PredictionController {

    @Autowired
    private PredictionService predictionService;

    @GetMapping("/gigsToCsv")
    public String exportNewGigs() {
        try {
            predictionService.exportGigsToCSV("new_gigs.csv");
            return "New gigs exported successfully.";
        } catch (IOException e) {
            return "Failed to export new gigs.";
        }
    }

    @PostMapping("/suggestPrice")
    public String suggestPrice(@RequestBody Map<String, String> suggestionData) {
        try {
            predictionService.exportGigsToCSV("new_gigs.csv");
            Process predictProcess = getProcess(suggestionData);

            BufferedReader reader = new BufferedReader(new InputStreamReader(predictProcess.getInputStream()));
            String line;
            StringBuilder output = new StringBuilder();
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }

            int exitCode = predictProcess.waitFor();
            if (exitCode == 0) {
                return "Suggested price: " + output.toString().trim();
            } else {
                return "Failed to get suggested price. Exit code: " + exitCode;
            }

        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
            return "Failed to get suggested price.";
        }
    }

    private Process getProcess(Map<String, String> suggestionData) throws IOException, InterruptedException {
        String pythonScriptPath = "C:\\Users\\rares\\Desktop\\licenta\\Web-Platform-for-Freelancers\\backend\\output\\price_suggestion.py";

        // First, retrain the model
        String[] retrainCmd = new String[]{"python", pythonScriptPath, "retrain"};
        ProcessBuilder retrainPb = new ProcessBuilder(retrainCmd);
        Process retrainProcess = retrainPb.start();
        retrainProcess.waitFor();

        // Then, predict the price
        String[] predictCmd = new String[]{"python", pythonScriptPath, "predict", suggestionData.get("title"), suggestionData.get("tags")};
        ProcessBuilder predictPb = new ProcessBuilder(predictCmd);
        return predictPb.start();
    }
}
