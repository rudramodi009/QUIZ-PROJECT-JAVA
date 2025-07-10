package com.example.quiz.site;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication(scanBasePackages = "com.example.quiz.site")
public class QuizSiteApplication {

	public static void main(String[] args) {
		SpringApplication.run(QuizSiteApplication.class, args);
	}

}
