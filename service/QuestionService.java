package com.example.quiz.site.service;

import com.example.quiz.site.Question;
import com.example.quiz.site.dao.QuestionDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionService {

    private final QuestionDao questionDao;

    @Autowired
    public QuestionService(QuestionDao questionDao) {
        this.questionDao = questionDao;
    }

    public List<Question> getAllQuestion() {

        return questionDao.findAll();
    }
}

