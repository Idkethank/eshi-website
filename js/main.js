/* ==========================================
   ESHI WEBSITE - MAIN JAVASCRIPT
   ========================================== */


/* ------------------------------------------
   SCREEN NAVIGATION
------------------------------------------ */

const screens = [...document.querySelectorAll(".screen")];

function showScreen(id) {
  screens.forEach(screen => {
    screen.classList.toggle("active", screen.id === id);
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

const randomBetween = (min, max) =>
  Math.random() * (max - min) + min;


/* ------------------------------------------
   BACKGROUND MUSIC
------------------------------------------ */

const music = document.getElementById("background-music");
const musicToggle = document.getElementById("music-toggle");
const musicLabel = document.getElementById("music-label");

function updateMusicButton() {
  if (!music || !musicLabel || !musicToggle) return;

  musicLabel.textContent = music.paused
    ? "Play our song"
    : "Pause song";

  musicToggle.setAttribute(
    "aria-label",
    music.paused
      ? "Play background music"
      : "Pause background music"
  );
}

async function startMusic() {
  if (!music) return;

  try {
    await music.play();
    updateMusicButton();
  } catch {
    if (musicLabel) {
      musicLabel.textContent = "Tap to play song";
    }
  }
}

if (musicToggle && music) {
  musicToggle.addEventListener("click", async () => {
    if (music.paused) {
      try {
        await music.play();
      } catch {
        if (musicLabel) {
          musicLabel.textContent = "Add favorite-song.mp3";
        }
      }
    } else {
      music.pause();
    }

    updateMusicButton();
  });
}


/* ------------------------------------------
   TURKEY CATCHING GAME
------------------------------------------ */

const turkey = document.getElementById("turkey");
const catchStatus = document.getElementById("catch-status");
const gameHint = document.getElementById("game-hint");

let turkeyCaught = false;
let turkeyMoves = 0;
let lastDodge = 0;

/*
  Move the turkey directly into the body.
  This prevents the story screen or game box
  from clipping its fixed position.
*/

if (turkey) {
  document.body.appendChild(turkey);
}

function moveTurkey(mouseX = null, mouseY = null) {
  if (!turkey || turkeyCaught) return;

  const pad = 75;

  const maxX = Math.max(pad, window.innerWidth - pad);
  const maxY = Math.max(pad, window.innerHeight - pad);

  let x;
  let y;

  if (mouseX !== null && mouseY !== null) {
    const rect = turkey.getBoundingClientRect();

    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const angle = Math.atan2(
      cy - mouseY,
      cx - mouseX
    );

    const distance = randomBetween(145, 225);

    x =
      cx +
      Math.cos(angle) * distance +
      randomBetween(-65, 65);

    y =
      cy +
      Math.sin(angle) * distance +
      randomBetween(-65, 65);

    x = Math.max(pad, Math.min(maxX, x));
    y = Math.max(pad, Math.min(maxY, y));

  } else {
    x = randomBetween(pad, maxX);
    y = randomBetween(pad, maxY);
  }

  turkey.style.left = `${x}px`;
  turkey.style.top = `${y}px`;

  turkey.style.transform =
    `translate(-50%, -50%) rotate(${randomBetween(-12, 12)}deg)`;

  turkeyMoves++;

  if (catchStatus) {
    catchStatus.textContent =
      turkeyMoves < 3
        ? "It's moving! Go catch it!"
        : "Getting closer... keep trying!";
  }
}

/* Turkey dodges the mouse */

document.addEventListener("pointermove", event => {
  if (!turkey || turkeyCaught) return;

  if (event.pointerType !== "mouse") return;

  const rect = turkey.getBoundingClientRect();

  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  const distance = Math.hypot(
    event.clientX - cx,
    event.clientY - cy
  );

  const now = Date.now();

  if (distance < 135 && now - lastDodge > 450) {
    lastDodge = now;

    moveTurkey(
      event.clientX,
      event.clientY
    );
  }
});

/* Catching the turkey */

if (turkey) {
  turkey.addEventListener("click", async () => {
    if (turkeyCaught) return;

    turkeyCaught = true;

    startMusic();

    turkey.disabled = true;
    turkey.style.display = "none";

    if (catchStatus) {
      catchStatus.textContent = "You got it!";
    }

    if (gameHint) {
      gameHint.textContent = "Okay, you caught it.";
    }

    await wait(850);

    showScreen("story-screen");
  });
}


/* ------------------------------------------
   STORY CONTENT
   NINE CHAPTERS
------------------------------------------ */

const chapters = [

  /* PART 1 */

  {
    name: "How it started",

    fragments: [
      "It's actually crazy how almost a year has passed.",
      "She was in my Algebra 1 class last year.",
      "Back then, she was just another person in my class.",
      "Then something changed this year.",
      "I started noticing her more than I realized.",
      "Every time I walked into class, I'd somehow look for her.",
      "Eventually, we started talking.",
      "I thought it was just a little crush that would disappear.",
      "Clearly, that didn't happen."
    ]
  },

  /* PART 2 */

  {
    name: "The little things",

    fragments: [
      "The more we talked, the more I realized how much I liked her.",
      "She's genuinely one of the sweetest people I've met.",
      "She's funny without even trying.",
      "She's easy to talk to, and she remembers the smallest things.",
      "Her music taste is actually insane.",
      "She sends me one song and suddenly it's on repeat for a week.",
      "And her voice...",
      "I genuinely don't know how to explain it.",
      "I could listen to her talk about literally anything."
    ]
  },

  /* PART 3 */

  {
    name: "The library and the essay",

    fragments: [
      "I still think about the library.",
      "I remember saying I'd come over and then getting nervous.",
      "I was waiting for her friend to move so I could sit next to her.",
      "The walk over felt like the longest walk of my life.",
      "I thought it would be awkward.",
      "But once I sat down, we just started talking.",
      "Honestly, I could've stayed there so much longer.",
      "And then there's the English essay.",
      "She helped me fix it when she didn't have to.",
      "She genuinely saved my grade.",
      "I don't think she realizes how much I appreciated that."
    ]
  },

  /* PART 4 */

  {
    name: "Robotics and almost saying it",

    fragments: [
      "My mom caught me texting her during robotics.",
      "Bro, I thought I was DONE.",
      "Things got awkward, but I wasn't going to just stop talking to her.",
      "Having someone to text between competition matches was one of my favorite parts.",
      "I'd check my phone and see a message from her.",
      "Suddenly, I had something to look forward to.",
      "I also remember telling Methila that I liked Eshi.",
      "And then Eshi asked me who my crush was.",
      "I actually froze.",
      "I wanted to tell her so badly, but I couldn't get myself to do it."
    ]
  },

  /* PART 5 */

  {
    name: "India",

    fragments: [
      "Then I went to India.",
      "I didn't think I'd miss talking to her as much as I did.",
      "The time difference made everything so annoying.",
      "I couldn't talk to her normally like before.",
      "Before I left, I got the feeling she'd miss me too.",
      "For some reason, that stuck with me.",
      "I remember being on the flight and thinking about her.",
      "That's when I realized she'd become a pretty big part of my life.",
      "I even had a dream about her while I was away.",
      "We were at the beach, walking around and talking.",
      "It felt so normal that I was annoyed when I woke up."
    ]
  },

  /* PART 6 */

  {
    name: "Coming back",

    fragments: [
      "And then I saw her again.",
      "BRO.",
      "I already thought she was pretty before.",
      "But seeing her again at school was something else.",
      "And her eyes...",
      "I swear I could write an entire paragraph about them.",
      "There's something about them I can't really explain.",
      "I notice them every time I see her.",
      "And somehow, I still haven't gotten used to them.",
      "Her hair too. Everything about her just looks so good.",
      "I genuinely don't think she realizes how pretty she is."
    ]
  },

  /* PART 7 */

  {
    name: "The rough patch",

    fragments: [
      "Obviously, everything wasn't perfect.",
      "We went through a pretty bad rough patch.",
      "I was overthinking everything.",
      "I genuinely thought we were about to lose what we had.",
      "I was scared of losing her as a person in my life.",
      "For a while, I really thought that was it.",
      "And somehow, we managed to get through it.",
      "I'm genuinely so glad we did.",
      "I didn't want to lose the conversations, the jokes, the songs, or just having her there.",
      "I really didn't want things to end like that."
    ]
  },

  /* PART 8 */

  {
    name: "Something else...",

    fragments: [
      "There's also something I've been working on.",
      "I've been building something for her.",
      "I'm not revealing everything yet because I want it to be a surprise.",
      "I've been putting time into making it something special.",
      "It's not just some random thing I decided to get her.",
      "There's a reason I'm building it myself.",
      "And I think that's what makes it mean more to me.",
      "Maybe one day she'll know the whole story behind it.",
      "For now, I'll leave it at that."
    ]
  },

  /* PART 9 */

  {
    name: "Anyway",

    fragments: [
      "And now we're here.",
      "Almost a year since all of this started.",
      "I still get excited when she texts me.",
      "Something funny happens? I wanna tell her.",
      "I hear a good song? I wanna send it to her.",
      "I see something random? I wonder what she'd think.",
      "My phone lights up and it's her? Instant mood improvement.",
      "I really do love her.",
      "Not just because she's pretty, even though BRO SHE IS.",
      "It's her personality, her voice, her music taste, and all the little things.",
      "I'm genuinely glad I met her.",
      "Meeting her has been one of the best things that's happened to me."
    ]
  }

];


/* ------------------------------------------
   STORY ANIMATION
------------------------------------------ */

const storySky = document.getElementById("story-sky");

const startStoryButton =
  document.getElementById("story-start-button");

const nextPartButton =
  document.getElementById("next-part-button");

const chapterNumber =
  document.getElementById("chapter-number");

const chapterName =
  document.getElementById("chapter-name");

const storyInstruction =
  document.getElementById("story-instruction");

let currentChapter = 0;
let typingRun = 0;
let storyIsGathering = false;
let storySlots = [];


/* Shuffle positions so the quotes appear in different places */

function shuffleArray(array) {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [result[i], result[j]] =
      [result[j], result[i]];
  }

  return result;
}


/* Create positions across the story screen */

function createStorySlots() {
  const mobile = window.innerWidth <= 700;

  const columns = mobile
    ? [2, 51]
    : [2, 35.5, 69];

  const rows = mobile
    ? [2, 18, 34, 50, 66, 82]
    : [3, 27, 51, 75];

  const slots = [];

  rows.forEach(top => {
    columns.forEach(left => {
      slots.push({ left, top });
    });
  });

  storySlots = shuffleArray(slots);
}


/* Create one quote */

function makeFragment(sentence) {
  const fragment = document.createElement("div");

  fragment.className = "story-fragment";
  fragment.textContent = "";

  if (storySlots.length === 0) {
    createStorySlots();
  }

  const slot = storySlots.pop();

  const mobile = window.innerWidth <= 700;

  fragment.style.width = mobile ? "47%" : "29%";
  fragment.style.maxWidth = mobile ? "47%" : "29%";

  fragment.style.left = `${slot.left}%`;
  fragment.style.top = `${slot.top}%`;

  fragment.style.setProperty(
    "--fragment-tilt",
    `${randomBetween(-1.2, 1.2)}deg`
  );

  return fragment;
}


/* Type text letter by letter */

async function typeFragment(fragment, sentence, run) {
  fragment.classList.add("typing");

  for (let i = 0; i < sentence.length; i++) {
    if (run !== typingRun) return;

    fragment.textContent += sentence[i];

    let delay = 26;

    if (sentence[i] === "," || sentence[i] === ";") {
      delay = 120;
    }

    if (".!?".includes(sentence[i])) {
      delay = 240;
    }

    await wait(delay);
  }

  if (run !== typingRun) return;

  fragment.classList.remove("typing");
  fragment.classList.add("typed");
}


/* Clear previous chapter */

function clearStory() {
  typingRun++;

  if (storySky) {
    storySky.innerHTML = "";

    storySky.classList.remove("gathering");
    storySky.classList.remove("story-started");
  }

  createStorySlots();
}


/* Display a chapter */

async function showChapter(index) {
  if (!storySky) return;

  clearStory();

  storySky.classList.add("story-started");

  const run = typingRun;

  currentChapter = index;
  storyIsGathering = false;

  const chapter = chapters[index];

  if (!chapter) return;

  if (chapterNumber) {
    chapterNumber.textContent =
      `PART ${index + 1} OF ${chapters.length}`;
  }

  if (chapterName) {
    chapterName.textContent = chapter.name;
  }

  if (storyInstruction) {
    storyInstruction.textContent =
      "Watch the words appear. Take your time.";
  }

  if (nextPartButton) {
    nextPartButton.classList.add("hidden");
  }

  /*
    Each fragment is typed completely before
    the next one starts appearing.
  */

  for (const sentence of chapter.fragments) {
    if (run !== typingRun) return;

    const fragment = makeFragment(sentence);

    storySky.appendChild(fragment);

    await typeFragment(
      fragment,
      sentence,
      run
    );

    if (run !== typingRun) return;

    await wait(500);
  }

  if (run !== typingRun) return;

  if (nextPartButton) {
    nextPartButton.textContent =
      index === chapters.length - 1
        ? "Bring it all together →"
        : "Next part →";

    nextPartButton.classList.remove("hidden");
  }

  if (storyInstruction) {
    storyInstruction.textContent =
      index === chapters.length - 1
        ? "That's almost everything."
        : "Continue whenever you're ready.";
  }
}


/* Begin the story */

if (startStoryButton) {
  startStoryButton.addEventListener("click", () => {
    startStoryButton.classList.add("hidden");

    showChapter(0);
  });
}


/* Gather all the fragments at the end */

async function gatherStory() {
  if (!storySky || storyIsGathering) return;

  storyIsGathering = true;

  if (nextPartButton) {
    nextPartButton.classList.add("hidden");
  }

  if (storyInstruction) {
    storyInstruction.textContent =
      "And somehow, all those little moments led here...";
  }

  storySky.classList.add("gathering");

  await wait(2300);

  showScreen("thanks-screen");
}


/* Next part button */

if (nextPartButton) {
  nextPartButton.addEventListener("click", () => {
    if (storyIsGathering) return;

    if (currentChapter < chapters.length - 1) {
      showChapter(currentChapter + 1);
    } else {
      gatherStory();
    }
  });
}


/* ------------------------------------------
   THANK YOU -> MEMORIES
------------------------------------------ */

const memoriesButton =
  document.getElementById("memories-button");

if (memoriesButton) {
  memoriesButton.addEventListener("click", () => {
    showScreen("memories-screen");
  });
}


/* ------------------------------------------
   MEMORY CONTENT
------------------------------------------ */

const memoryContent = {

  "inside-joke": {
    kicker: "AN INSIDE JOKE",

    title: "Bannani shoeini?",

    image: "assets/memories/inside-joke.png",

    alt: "A screenshot of the banana-shoe joke conversation",

    thought:
      "This is such a random conversation, which is exactly why I like it. I asked the most ridiculous question and your reaction made it ten times funnier. It's one of those tiny exchanges that probably took less than a minute, but it stuck with me because I can still remember how funny it was."
  },

  blessing: {
    kicker: "A VERY IMPORTANT PHOTO",

    title: "Blessing my eyes",

    image: "assets/memories/blessing-my-eyes.png",

    alt: "A photo shared as one of the memories",

    thought:
      "I had to give this its own section. Sometimes a picture just catches you off guard, and this one definitely did. I wanted to save it here because it made me stop for a second and appreciate the person behind all these memories. Consider this a very official record of my eyes being blessed."
  },

  "phone-memory": {
    kicker: "ONE MORE MEMORY",

    title: "To be continued...",

    image: "",

    alt: "",

    thought:
      "This one's waiting for the next screenshot. I'll add the picture and the actual story behind it here."
  }

};


/* ------------------------------------------
   EXPANDABLE MEMORY CARDS
------------------------------------------ */

const memoryOverlay =
  document.getElementById("memory-overlay");

const memoryTitle =
  document.getElementById("memory-detail-title");

const memoryKicker =
  document.getElementById("memory-detail-kicker");

const memoryCopy =
  document.getElementById("memory-detail-copy");

const memoryImage =
  document.getElementById("memory-detail-image");

const closeMemory =
  document.getElementById("close-memory");


/* Open a memory */

function openMemory(key) {
  const memory = memoryContent[key];

  if (!memory || !memoryOverlay) return;

  memoryKicker.textContent = memory.kicker;
  memoryTitle.textContent = memory.title;
  memoryCopy.textContent = memory.thought;

  if (memory.image) {
    memoryImage.src = memory.image;
    memoryImage.alt = memory.alt;

    memoryImage.classList.remove("hidden");

    memoryImage.onerror = () => {
      memoryImage.classList.add("hidden");
    };

  } else {
    memoryImage.removeAttribute("src");
    memoryImage.classList.add("hidden");
  }

  memoryOverlay.classList.remove("hidden");

  memoryOverlay.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.style.overflow = "hidden";

  if (closeMemory) {
    closeMemory.focus();
  }
}


/* Close a memory */

function closeMemoryModal() {
  if (!memoryOverlay) return;

  memoryOverlay.classList.add("hidden");

  memoryOverlay.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.style.overflow = "";
}


/* Attach click events to every memory card */

document.querySelectorAll(".memory-card").forEach(card => {
  card.addEventListener("click", () => {
    openMemory(card.dataset.memory);
  });
});


/* Close button */

if (closeMemory) {
  closeMemory.addEventListener(
    "click",
    closeMemoryModal
  );
}


/* Click outside the memory to close it */

if (memoryOverlay) {
  memoryOverlay.addEventListener("click", event => {
    if (event.target === memoryOverlay) {
      closeMemoryModal();
    }
  });
}


/* Escape key closes the memory */

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeMemoryModal();
  }
});


/* ------------------------------------------
   REPLAY THE WEBSITE
------------------------------------------ */

const replayButton =
  document.getElementById("replay-button");

if (replayButton) {
  replayButton.addEventListener("click", () => {

    /* Reset turkey */

    turkeyCaught = false;
    turkeyMoves = 0;
    lastDodge = 0;

    if (turkey) {
      turkey.disabled = false;
      turkey.textContent = "🦃";

      turkey.style.display = "block";
      turkey.style.left = "50%";
      turkey.style.top = "55%";

      turkey.style.transform =
        "translate(-50%, -50%)";
    }

    if (catchStatus) {
      catchStatus.textContent =
        "Tap the turkey to catch it!";
    }

    if (gameHint) {
      gameHint.textContent =
        "Catch the turkey ↓";
    }

    /* Reset story */

    clearStory();

    currentChapter = 0;
    storyIsGathering = false;

    if (startStoryButton) {
      startStoryButton.classList.remove("hidden");
    }

    if (nextPartButton) {
      nextPartButton.classList.add("hidden");
    }

    if (chapterNumber) {
      chapterNumber.textContent =
        "A STORY IN NINE PARTS";
    }

    if (chapterName) {
      chapterName.textContent = "";
    }

    if (storyInstruction) {
      storyInstruction.textContent =
        "There's a little more to this story...";
    }

    /* Close memory if one is open */

    closeMemoryModal();

    /* Return to welcome screen */

    showScreen("welcome-screen");
  });
}


/* ------------------------------------------
   INITIAL SETUP
------------------------------------------ */

createStorySlots();

if (storySky) {
  storySky.innerHTML = "";
}

if (nextPartButton) {
  nextPartButton.classList.add("hidden");
}

updateMusicButton();

console.log("Eshi website loaded successfully.");