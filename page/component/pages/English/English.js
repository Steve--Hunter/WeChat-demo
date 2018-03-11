var questions = [
    {
        "What do we remember on Anzac Day?": [
            "The landing of the Australian and New Zealand Army Corps at Gallipoli, Turkey",
            "The arrival of the first free settlers from Great Britain",
            "The landing of the First Fleet at Sydney Cove"
        ]
    },
    {
        "What are the colours of the Australian Aboriginal Flag?": [
            "Black, red and yellow",
            "Green, white and black",
            "Blue, white and green"
        ]
    },
    {
        "Which official symbol of Australia identifies Commonwealth property?": [
            "Commonwealth Coat of Arms",
            "The national anthem",
            "Australia’s national flower"
        ]
    },
    {
        "Which of these statements about Australia’s system of government is correct?": [
            "The government is elected by the people",
            "The Queen of Australia chooses people to form the Australian Parliament",
            "The Prime Minister chooses our Members of Parliament"
        ]
    },
    {
        "Which of these is an example of freedom  of speech?": [
            "People can peacefully protest against government decisions",
            "Men and women are treated equally in a  court of law",
            "Australians are free to not follow a religion"
        ]
    },
    {
        "Which of these statements about government in Australia is correct?": [
            "Government in Australia is secular",
            "The government does not allow some religions",
            "Religious laws are passed by parliament"
        ]
    },
    {
        "Which of these is an example of equality  in Australia? ": [
            "Men and women have the same rights",
            "Everyone follows the same religion",
            "Everyone belongs to the same political party"
        ]
    },
    {
        "Which of these is a responsibility of all Australian citizens aged 18 years or over?": [
            "To vote in elections",
            "To attend local council meetings",
            "To have a current Australian passport"
        ]
    },
    {
        "Which of these is a responsibility of Australian citizens aged 18 years or over?": [
            "To serve on a jury if called to do so",
            "To do local community service",
            "To carry a passport at all times"
        ]
    },
    {
        "Which of these statements about  passports is correct?": [
            "Australian citizens can apply for an  Australian passport",
            "Permanent residents can hold an  Australian passport",
            "Australian citizens need a passport  and visa to return to Australia"
        ]
    },
    {
        "Which of these statements about voting in Australian elections is correct?": [
            "People are free and safe to vote for any candidate",
            "Voting is by a show of hands",
            "People must write their name on their vote"
        ]
    },
    {
        "What happened in Australia on  1 January 1901? ": [
            "The Australian Constitution came into effect",
            "The Australian Constitution was changed by a referendum",
            "The Australian and New Zealand Army Corps  was formed"
        ]
    },
    {
        "What is the name of the legal document that sets out the rules for the government of Australia?": [
            "The Australian Constitution",
            "The Australian Commonwealth",
            "The Australian Federation"
        ]
    },
    {
        "What is a referendum?": [
         "A vote to change the Australian Constitution",
         "A vote to change the Australian Constitution",
            "A vote to change the government"
        ]
    },
    {
        "Which arm of government has the power to interpret and apply laws? ": [
            "Judicial",
            "Executive",
            "Legislative"
        ]
    },
    {
        "Which of these is a role of the  Governor-General? ": [
            "The signing of Bills passed by the  Australian Parliament",
            "The appointment of state premiers",
            "The appointment of the Head of State "
        ]
    },
    {
        "Which of these statements about state governments is correct?": [
            "Each state has its own constitution",
            "All states have the same constitution",
            "The states have no constitution"
        ]
    },
    {
        "What is the name given to the party or coalition of parties with the second largest number of members in the House of Representatives? ": [
            "The Opposition",
            "The Government",
            "The Senate"
        ]
    },
    {
        "What is the name of a proposal to make a law in parliament? ": [
        "Bill",
        "Debate",
        "Royal Assent "
        ]
    },
    {
        "Who maintains peace and order in  Australia? ": [
            "Police",
            "Lawyers",
            "Public servants"
        ]
    }
];

var ANSWER_COUNT = 3;
var GAME_LENGTH = 20;



Page({
  data: {
  },

  getWelcomeResponse: function() {
      var sessionAttributes = {},
          speechOutput = "Hi, I will ask you " + GAME_LENGTH.toString()
              + "  questions from the Australian Citizenship Practice Test, try to get as many right as you can, in the real Citizenship Test, you need to get 15 out of 20 correct. Just say the number of the answer. Let's begin. ",
          shouldEndSession = false,

          gameQuestions = populateGameQuestions(),
          correctAnswerIndex = Math.floor(Math.random() * (ANSWER_COUNT)), // Generate a random index for the correct answer, from 0 to 3
          roundAnswers = populateRoundAnswers(gameQuestions, 0, correctAnswerIndex),

          currentQuestionIndex = 0,
          spokenQuestion = Object.keys(questions[gameQuestions[currentQuestionIndex]])[0],
          repromptText = "Question 1. " + spokenQuestion + " ",

          i, j;

      for (i = 0; i < ANSWER_COUNT; i++) {
          repromptText += (i+1).toString() + ". " + roundAnswers[i] + ". "
      }
      speechOutput += repromptText;
      sessionAttributes = {
          "speechOutput": repromptText,
          "repromptText": repromptText,
          "currentQuestionIndex": currentQuestionIndex,
          "correctAnswerIndex": correctAnswerIndex + 1,
          "questions": gameQuestions,
          "score": 0,
          "correctAnswerText":
              questions[gameQuestions[currentQuestionIndex]][Object.keys(questions[gameQuestions[currentQuestionIndex]])[0]][0]
      };
      callback(sessionAttributes,
          buildSpeechletResponse(CARD_TITLE, speechOutput, repromptText, shouldEndSession));
  },
  populateGameQuestions: function() {
    var gameQuestions = [];
    var indexList = [];
    var index = questions.length;

    if (GAME_LENGTH > index){
        throw "Invalid Game Length.";
    }

    for (var i = 0; i < questions.length; i++){
        indexList.push(i);
    }

    // Pick GAME_LENGTH random questions from the list to ask the user, make sure there are no repeats.
    for (var j = 0; j < GAME_LENGTH; j++){
        var rand = Math.floor(Math.random() * index);
        index -= 1;

        var temp = indexList[index];
        indexList[index] = indexList[rand];
        indexList[rand] = temp;
        gameQuestions.push(indexList[index]);
    }

    return gameQuestions;
  },

populateRoundAnswers: function(gameQuestionIndexes, correctAnswerIndex, correctAnswerTargetLocation) {
  // Get the answers for a given question, and place the correct answer at the spot marked by the
  // correctAnswerTargetLocation variable. Note that you can have as many answers as you want but
  // only ANSWER_COUNT will be selected.
  var answers = [],
      answersCopy = questions[gameQuestionIndexes[correctAnswerIndex]][Object.keys(questions[gameQuestionIndexes[correctAnswerIndex]])[0]],
      temp, i;

  var index = answersCopy.length;

  if (index < ANSWER_COUNT){
      throw "Not enough answers for question.";
  }

  // Shuffle the answers, excluding the first element.
  for (var j = 1; j < answersCopy.length; j++){
      var rand = Math.floor(Math.random() * (index - 1)) + 1;
      index -= 1;

      var temp = answersCopy[index];
      answersCopy[index] = answersCopy[rand];
      answersCopy[rand] = temp;
  }

  // Swap the correct answer into the target location
  for (i = 0; i < ANSWER_COUNT; i++) {
      answers[i] = answersCopy[i];
  }
  temp = answers[0];
  answers[0] = answers[correctAnswerTargetLocation];
  answers[correctAnswerTargetLocation] = temp;
  return answers;
},

populateRoundAnswers: function(gameQuestionIndexes, correctAnswerIndex, correctAnswerTargetLocation) {

}


})
