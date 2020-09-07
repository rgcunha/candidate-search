'use strict';

const express = require('express');
const app = express();
app.use(express.json());

// Your code starts here. Placeholders for .get and .post are provided for
//  your convenience.
const candidates = [];

// returns an integer greater than 0 is candidate 1 is better than candidate 2
function compareCandidates(candidate1, candidate2, skills) {
    const candidate1Skills = getMatchedSkills(candidate1, skills);
    const candidate2Skills = getMatchedSkills(candidate2, skills);
    return candidate1Skills.length > candidate2Skills.length; 
}

function getMatchedSkills(candidate, requiredSkills) {
    if (!candidate) return [];
    return candidate.skills.filter(skill => requiredSkills.includes(skill));
}

function isValidCandidate(candidate, skills) {
    const matchedSkills = getMatchedSkills(candidate, skills);
    return matchedSkills.length > 0 ? true : false;
}

function getBestCandidate(skills) {
 let bestCandidate = null;
 candidates.forEach(candidate => {
     if (isValidCandidate(candidate, skills)) {
        const result = compareCandidates(candidate, bestCandidate, skills);
        if (result > 0) { bestCandidate = candidate; }
     }
 })
 return bestCandidate;
}

const badRequestError = { error: 'bad request' };
const notFoundError = { error: 'not found' };

app.post('/candidates', function(req, res) {
    if (!req.body) {
      return res.status(400).send(badRequestError)
    }
    
    const { id, name, skills } = req.body;
    const newCandidate = { id, name, skills };
    candidates.push(newCandidate);
    res.status(201).send(newCandidate);
});

app.get('/candidates/search', function(req, res) {
  const { skills } = req.query;
  if (!skills) {
    return res.status(400).send(badRequestError);
  }
  const arrSkills = skills.split(',');
  const candidate = getBestCandidate(arrSkills);
  
  if (!candidate) {
      res.status(404).send(notFoundError);
  }
  res.send(candidate);
});

app.listen(process.env.HTTP_PORT || 3000);