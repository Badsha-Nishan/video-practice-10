function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

const createElements = (arr) => {
  const htmlElement = arr.map(
    (el) => `<span class = "btn text-xl bg-[#D7E4EF]">${el}</span>`
  );
  return htmlElement.join(" ");
};

const manageSpinner = (status) => {
  if (status === true) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("word-container").classList.add("hidden");
  } else {
    document.getElementById("word-container").classList.remove("hidden");
    document.getElementById("spinner").classList.add("hidden");
  }
};
const loadLessons = () => {
  const url = "https://openapi.programming-hero.com/api/levels/all";
  fetch(url)
    .then((res) => res.json())
    .then((data) => displayLessons(data.data));
};

const removeActive = () => {
  const activeBtn = document.querySelectorAll(".lesson-btn");
  activeBtn.forEach((btn) => btn.classList.remove("active"));
};

const loadLevelWord = (id) => {
  manageSpinner(true);
  fetch(`https://openapi.programming-hero.com/api/level/${id}`)
    .then((res) => res.json())
    .then((data) => {
      const clickBtn = document.getElementById(`lesson-btn-${id}`);
      removeActive();
      clickBtn.classList.add("active");
      displayLevelWord(data.data);
    });
};

const loadWordDetail = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  const res = await fetch(url);
  const details = await res.json();
  displayWordDetails(details.data);
};

const displayWordDetails = (word) => {
  const detailsContainer = document.getElementById("details-container");
  detailsContainer.innerHTML = `
        <div id="details-container" class="space-y-9">
          <div>
            <h2 class="text-3xl font-bold">
              ${word.word} (<i class="fa-solid fa-microphone-lines"></i>:${
    word.pronunciation
  })
            </h2>
          </div>
          <div class="space-y-3">
            <h3 class="font-bold text-xl">Meaning</h3>
            <p class="font-bangla text-xl font-medium">${word.meaning}</p>
          </div>
          <div class="space-y-3">
            <h3 class="font-bold text-xl">example</h3>
            <p class="text-xl">${word.sentence}</p>
          </div>
          <div>
            <h3 class="font-bangla text-xl font-medium">সমার্থক শব্দ গুলো</h3>
          </div>
          <div>
            ${createElements(word.synonyms)}
          </div>
        </div>
  `;
  document.getElementById("my_modal_5").showModal();
};

const displayLevelWord = (words) => {
  // 1. Get the Container and empty
  const wordContainer = document.getElementById("word-container");
  wordContainer.innerHTML = "";

  if (words.length === 0) {
    wordContainer.innerHTML = `
      <div class="col-span-full py-16 space-y-6 font-bangla">
        <img class="mx-auto" src="./assets/alert-error.png" alt="">
        <p class="text-xl font-medium text-gray-500">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
        <h2 class="font-bold text-4xl">নেক্সট Lesson এ যান</h2>
      </div>
    `;
    manageSpinner(false);
    return;
  }
  //   2. Get into every word
  for (const word of words) {
    // 3.Create element
    const card = document.createElement("div");
    card.innerHTML = `
        <div class="bg-white space-y-4 rounded py-8">
          <h2 class="text-3xl font-bold">${word.word}</h2>
          <p class="text-xl font-medium"> Meaning / Pronunciation</p>
          <h2 class="font-bangla font-semibold text-3xl">"${
            word.meaning ? word.meaning : "অর্থ পাওয়া যাইনি"
          } / ${
      word.pronunciation ? word.pronunciation : "Pronunciation পাওয়া যায়নি"
    }"</h2>
          <div class="flex justify-between px-12">
            <button onclick="loadWordDetail(${
              word.id
            })" class="btn bg-[#1A91FF20]">
              <i class="fa-solid fa-circle-info"></i>
            </button>
            <button onclick="pronounceWord('${
              word.word
            }')" class="btn bg-[#1A91FF20]"><i class="fa-solid fa-volume-high"></i></button>
          </div>
        </div>
    `;
    // 4.Append element
    wordContainer.append(card);
  }
  manageSpinner(false);
};

const displayLessons = (lessons) => {
  // 1. Get the Container & empty
  const lessonContainer = document.getElementById("level-container");
  lessonContainer.innerHTML = "";
  // 2. Get into every lesson
  for (const lesson of lessons) {
    // 3. Create element
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
                <button id="lesson-btn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn">
                    <i class="fa-solid fa-book-open"></i>
                    Lesson-${lesson.level_no}
                </button>
    `;
    // 4. Append element
    lessonContainer.append(btnDiv);
  }
};

loadLessons();

document.getElementById("btn-search").addEventListener("click", () => {
  removeActive();
  const input = document
    .getElementById("input-search")
    .value.trim()
    .toLowerCase();

  fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
      const allWord = data.data;
      const filteredWord = allWord.filter((word) =>
        word.word.toLowerCase().includes(input)
      );
      displayLevelWord(filteredWord);
    });
});
