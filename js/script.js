document.addEventListener('DOMContentLoaded', function() {
  // Define correct answers
  const correctAnswers = {
    q1: "2023-06-01", // Expected date (format: YYYY-MM-DD)
    q2: "kylas apartment",
    q3: "second day meeting",
    q4: ["khaled", "khalid", "kalid", "kaled"],
    q5: "comedy", // We'll accept anything containing 'comedy'
    q6: "bellevue",
    q7: "prague",
    q8: "steak",  // We'll accept anything containing 'steak'
    q9: "any",    // For q9, any slider value is accepted.
    q10: "100",
    q11: "1000"
  };

  // Track whether each question is answered correctly
  const answeredCorrectly = {
    q1: false, q2: false, q3: false, q4: false, q5: false,
    q6: false, q7: false, q8: false, q9: false, q10: false
  };

  const forms = document.querySelectorAll('.question-form');
  const progressIndicator = document.getElementById('progress');
  const submitAllContainer = document.getElementById('submitAllContainer');
  const totalQuestions = 11;

  // Update slider display values as the slider is moved
  const updateSliderDisplay = (sliderId, displayId) => {
    const slider = document.getElementById(sliderId);
    const display = document.getElementById(displayId);
    slider.addEventListener('input', function() {
      display.textContent = slider.value;
    });
  };
  updateSliderDisplay('q9', 'sliderVal-q9');
  updateSliderDisplay('q10', 'sliderVal-q10');
  updateSliderDisplay('q11', 'sliderVal-q11');

  forms.forEach(function(form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const qid = form.getAttribute('data-question');
      let userAnswer = "";

      // Special handling for q9: accept any answer
      if (qid === "q9") {
        userAnswer = form.querySelector('input[type="range"]').value;
        answeredCorrectly[qid] = true;
        const feedbackSpan = document.getElementById('feedback-' + qid);
        feedbackSpan.textContent = "Correct!";
        feedbackSpan.style.color = "green";
        // Disable slider and button
        form.querySelector('input[type="range"]').disabled = true;
        form.querySelector('button.check-button').disabled = true;
        updateProgress();
        return;
      }

      // Determine the type of input within the form
      if (form.querySelector('input[type="radio"]')) {
        const selected = form.querySelector('input[type="radio"]:checked');
        if (selected) {
          userAnswer = selected.value.trim().toLowerCase();
        }
      } else if (form.querySelector('input[type="date"]')) {
        userAnswer = form.querySelector('input[type="date"]').value.trim();
      } else if (form.querySelector('input[type="range"]')) {
        // This branch handles q10 or q11 (sliders)
        userAnswer = form.querySelector('input[type="range"]').value;
      } else {
        // Text input case
        userAnswer = form.querySelector('input[type="text"]').value.trim().toLowerCase();
      }

      const feedbackSpan = document.getElementById('feedback-' + qid);
      let isCorrect = false;
      const correct = correctAnswers[qid];

      if (Array.isArray(correct)) {
        // For open-ended questions with multiple acceptable answers
        if (correct.includes(userAnswer)) {
          isCorrect = true;
        }
      } else {
        // For single correct answers or partial matches (q5, q8)
        // Accept any substring match for 'comedy' (q5) and 'steak' (q8)
        if ((qid === "q5" && userAnswer.includes("comedy")) ||
            (qid === "q8" && userAnswer.includes("steak")) ||
            userAnswer === correct) {
          isCorrect = true;
        }
      }

      if (isCorrect) {
        feedbackSpan.textContent = "Correct!";
        feedbackSpan.style.color = "green";
        answeredCorrectly[qid] = true;
        // Disable all inputs and the check button for this question
        const inputs = form.querySelectorAll('input');
        inputs.forEach(function(input) {
          input.disabled = true;
        });
        form.querySelector('button.check-button').disabled = true;
      } else {
        feedbackSpan.textContent = "Incorrect. Please try again.";
        feedbackSpan.style.color = "red";
        answeredCorrectly[qid] = false;
      }
      updateProgress();
    });
  });

  function updateProgress() {
    let count = 0;
    for (let key in answeredCorrectly) {
      if (answeredCorrectly[key]) count++;
    }
    progressIndicator.textContent = "Progress: " + count + "/" + totalQuestions;
    // Show the global submit button if all questions are correct
    if (count === totalQuestions) {
      submitAllContainer.style.display = "block";
    } else {
      submitAllContainer.style.display = "none";
    }
  }

  // Global "Submit Quiz" button event: proceed to note.html when clicked.
  document.getElementById('submitAll').addEventListener('click', function() {
    window.location.href = 'note.html';
  });
});
