// script.js
// Beginner-friendly: simple DOM interaction, no frameworks.

(function() {
  'use strict';

  /* ============================================================
     HELLO BUTTON (from the original site)
     ============================================================ */

  const greetButton = document.getElementById('greetButton');
  const greetMessage = document.getElementById('greetMessage');

  const messages = [
    '🐕 Woof! The Beagle wags its tail.',
    '🐩 The Poodle does a little spin!',
    '🦴 The Golden Retriever brings you a toy.',
    '🐾 All three pups say hello!'
  ];

  let clickCount = 0;

  greetButton.addEventListener('click', function() {
    const messageIndex = clickCount % messages.length;
    greetMessage.textContent = messages[messageIndex];

    if (clickCount === 0) {
      greetButton.textContent = '🐕 Woof again!';
    }

    clickCount = clickCount + 1;
    greetMessage.setAttribute('aria-live', 'polite');
  });

  console.log('Virtual Dog Park is ready! 🐶');


  /* ============================================================
     MY VIRTUAL DOG
     ============================================================ */

  // --- The localStorage key. All saved dog data lives under this name. ---
  // In the browser: DevTools → Application → Local Storage → your page.
  const STORAGE_KEY = 'virtualDogParkPetV1';

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
  const growthFill      = document.getElementById('growthFill');
  const growthBar       = document.querySelector('.growth-bar');
  const feedBtn         = document.getElementById('feedBtn');
  const playBtn         = document.getElementById('playBtn');
  const nextDayBtn      = document.getElementById('nextDayBtn');
  const startOverBtn    = document.getElementById('startOverBtn');

  // --- The current adopted dog (null until adoption or restore) ---
  let currentDog = null;

  /**
   * getStage(day)
   * Returns the growth stage for a given day number.
   * Rules: Day 1 = Puppy; Day 2-3 = Young Dog; Day 4+ = Adult Dog.
   */
  function getStage(day) {
    if (day === 1) return 'Puppy';
    if (day <= 3) return 'Young Dog';
    return 'Adult Dog';
  }

  /**
   * getGrowthPercent(day)
   * Turns the day number into a 0-100 value for the growth bar.
   * Capped at 100 so the bar never overflows.
   */
  function getGrowthPercent(day) {
    const percent = day * 20;        // Day 1 = 20%, Day 5 = 100%
    return Math.min(percent, 100);
  }

  /**
   * saveDog()
   * Writes the current dog to localStorage as JSON text.
   * Called after adopt, feed, play, and next day.
   */
  function saveDog() {
    if (!currentDog) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentDog));
  }

  /**
   * loadDog()
   * Reads the saved dog from localStorage.
   * Returns a dog object, or null if nothing is saved or the data is broken.
   */
  function loadDog() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    try {
      const dog = JSON.parse(raw);

      // Basic sanity check so a broken save doesn't crash the page
      if (
        typeof dog.name !== 'string' ||
        typeof dog.breed !== 'string' ||
        typeof dog.day !== 'number' ||
        typeof dog.happiness !== 'number'
      ) {
        return null;
      }
      return dog;
    } catch (error) {
      // If the saved text isn't valid JSON, ignore it.
      return null;
    }
  }

  /**
   * renderDog()
   * Updates the dog card on the page using currentDog.
   * Uses textContent so the visitor's name is shown as plain text,
   * never as HTML — this keeps the page safe.
   */
  function renderDog() {
    if (!currentDog) return;

    const stage = getStage(currentDog.day);

    dogCardTitle.textContent = currentDog.name + "'s day";
    statName.textContent      = currentDog.name;
    statBreed.textContent     = currentDog.breed;
    statDay.textContent       = 'Day ' + currentDog.day;
    statStage.textContent     = stage;
    statHappiness.textContent = currentDog.happiness + ' / 100';

    // Growth bar: width comes from the day number.
    const percent = getGrowthPercent(currentDog.day);
    growthFill.style.width = percent + '%';

    // Update the bar's accessibility values too.
    growthBar.setAttribute('aria-valuenow', percent);
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
   * Validates the name, creates a new dog, saves it, and shows its card.
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

    saveDog();
    renderDog();
    dogCard.hidden = false;
    adoptForm.hidden = true;
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
    saveDog();
    renderDog();
  }

  /**
   * nextDay()
   * Advances the dog by one day. Happiness drops by 5, never below 0.
   * The stage may change because getStage() reads the day number.
   */
  function nextDay() {
    if (!currentDog) return;

    currentDog.day = currentDog.day + 1;
    currentDog.happiness = Math.max(currentDog.happiness - 5, 0);

    saveDog();
    renderDog();
  }

  /**
   * startOver()
   * Asks the visitor for confirmation, then clears the saved dog
   * and returns to the adoption form. If they cancel, nothing changes.
   */
  function startOver() {
    const ok = window.confirm(
      'Start over? This will delete your saved dog and return to the adoption form.'
    );
    if (!ok) return;

    localStorage.removeItem(STORAGE_KEY);
    currentDog = null;

    // Reset the form and show it again
    adoptForm.reset();
    adoptForm.hidden = false;
    dogCard.hidden = true;

    // Clear the stats and growth bar
    statName.textContent = '—';
    statBreed.textContent = '—';
    statDay.textContent = '—';
    statStage.textContent = '—';
    statHappiness.textContent = '—';
    growthFill.style.width = '20%';
    growthBar.setAttribute('aria-valuenow', 20);

    showMessage('', false);
    dogNameInput.focus();
  }

  /**
   * restoreDog()
   * Runs on page load. If a saved dog exists, show its card
   * instead of the adoption form.
   */
  function restoreDog() {
    const saved = loadDog();
    if (!saved) return;

    currentDog = saved;
    renderDog();
    dogCard.hidden = false;
    adoptForm.hidden = true;
  }

  // --- Wire up the events ---
  adoptForm.addEventListener('submit', adoptDog);
  feedBtn.addEventListener('click', boostHappiness);
  playBtn.addEventListener('click', boostHappiness);
  nextDayBtn.addEventListener('click', nextDay);
  startOverBtn.addEventListener('click', startOver);

  // --- On page load, restore any saved dog ---
  restoreDog();

})();