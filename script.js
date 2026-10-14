// script.js
// Beginner-friendly: simple DOM interaction, no frameworks.

(function() {
  'use strict';

  /* ============================================================
     HELLO BUTTON (from the original site)
     ============================================================ */

  // 1. Find the button and message paragraph by their IDs
  const greetButton = document.getElementById('greetButton');
  const greetMessage = document.getElementById('greetMessage');

  // 2. Array of friendly messages to cycle through
  const messages = [
    '🐕 Woof! The Beagle wags its tail.',
    '🐩 The Poodle does a little spin!',
    '🦴 The Golden Retriever brings you a toy.',
    '🐾 All three pups say hello!'
  ];

  // Keep track of which message to show next
  let clickCount = 0;

  // 3. Add a click event listener to the button
  greetButton.addEventListener('click', function() {
    const messageIndex = clickCount % messages.length;
    greetMessage.textContent = messages[messageIndex];

    if (clickCount === 0) {
      greetButton.textContent = '🐕 Woof again!';
    }

    clickCount = clickCount + 1;
    greetMessage.setAttribute('aria-live', 'polite');
  });

  // 4. Log to console so a student can see everything is loaded
  console.log('Virtual Dog Park is ready! 🐶');


  /* ============================================================
     MY VIRTUAL DOG
     ============================================================ */

  // --- Grab the elements we need from the page ---
  const adoptForm       = document.getElementById('adoptForm');
  const dogNameInput    = document.getElementById('dogName');
  const dogBreedSelect  = document.getElementById('dogBreed');
  const nameHelp        = document.getElementById('nameHelp');
  const dogCard         = document.getElementById('dogCard');
  const dogCardTitle    = document.getElementById('dogCardTitle');
  const statName        = document.getElementById('statName');
  const statBreed       = document.getElementById('statBreed');
  const statDay         = document.getElementById('statDay');
  const statStage       = document.getElementById('statStage');
  const statHappiness   = document.getElementById('statHappiness');
  const feedBtn         = document.getElementById('feedBtn');
  const playBtn         = document.getElementById('playBtn');

  // --- The current adopted dog (null until the visitor adopts one) ---
  let currentDog = null;

  /**
   * getStage(day)
   * Returns the growth stage for a given day number.
   * Simple rules: day 1-3 Puppy, day 4-7 Young, day 8+ Adult.
   */
  function getStage(day) {
    if (day <= 3) return 'Puppy';
    if (day <= 7) return 'Young';
    return 'Adult';
  }

  /**
   * renderDog()
   * Updates the dog card on the page using the currentDog object.
   * Uses textContent so the visitor's name is shown as plain text,
   * never as HTML — this keeps the page safe.
   */
  function renderDog() {
    if (!currentDog) return;

    dogCardTitle.textContent = currentDog.name + "'s day";
    statName.textContent      = currentDog.name;
    statBreed.textContent     = currentDog.breed;
    statDay.textContent       = 'Day ' + currentDog.day;
    statStage.textContent     = getStage(currentDog.day);
    statHappiness.textContent = currentDog.happiness + ' / 100';
  }

  /**
   * showMessage(text, isSuccess)
   * Shows a helpful message under the form.
   * Red for errors, green for success.
   */
  function showMessage(text, isSuccess) {
    nameHelp.textContent = text;
    if (isSuccess) {
      nameHelp.classList.add('success');
    } else {
      nameHelp.classList.remove('success');
    }
  }

  /**
   * validateName(rawName)
   * Returns the trimmed name if it's valid, otherwise returns null
   * and shows a helpful error message.
   * Rules: not empty after trimming, and at most 20 characters.
   */
  function validateName(rawName) {
    const trimmed = rawName.trim();

    if (trimmed === '') {
      showMessage('Please enter a name for your dog.', false);
      return null;
    }
    if (trimmed.length > 20) {
      showMessage('Names must be 20 characters or fewer.', false);
      return null;
    }
    return trimmed;
  }

  /**
   * adoptDog(event)
   * Runs when the Adopt button is clicked (form submit).
   * Validates the name, creates a new dog, and shows its card.
   */
  function adoptDog(event) {
    event.preventDefault(); // stop the form from reloading the page

    const name = validateName(dogNameInput.value);
    if (name === null) return; // invalid — message already shown

    currentDog = {
      name: name,
      breed: dogBreedSelect.value,
      day: 1,
      happiness: 50
    };

    renderDog();
    dogCard.hidden = false;
    showMessage('🎉 ' + name + ' has been adopted!', true);
  }

  /**
   * boostHappiness()
   * Adds 10 to the current dog's happiness, but never above 100.
   * Shared by the Feed and Play buttons.
   */
  function boostHappiness() {
    if (!currentDog) return;

    currentDog.happiness = Math.min(currentDog.happiness + 10, 100);
    renderDog();
  }

  // --- Wire up the events ---
  adoptForm.addEventListener('submit', adoptDog);
  feedBtn.addEventListener('click', boostHappiness);
  playBtn.addEventListener('click', boostHappiness);

})();