// Dashboard.js

// Theme Toggle
const themeToggle = document.getElementById("theme-toggle");
themeToggle.onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
};
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

// To-Do List
const inputBox = document.getElementById("todo-input");
const listContainer = document.getElementById("todo-list");
function addTask() {
  if (inputBox.value === '') {
    alert("You must write something!");
  } else {
    let li = document.createElement("li");
    li.textContent = inputBox.value;
    listContainer.appendChild(li);
    let span = document.createElement("span");
    span.innerHTML = "×";
    span.classList.add("delete-btn");
    li.appendChild(span);
  }
  inputBox.value = "";
  saveData();
}
listContainer.addEventListener("click", function (e) {
  if (e.target.tagName === "LI") {
    e.target.classList.toggle("done");
    saveData();
  } else if (e.target.tagName === "SPAN") {
    e.target.parentElement.remove();
    saveData();
  }
});
function saveData() {
  localStorage.setItem("todos", listContainer.innerHTML);
}
function showTasks() {
  listContainer.innerHTML = localStorage.getItem("todos");
}
showTasks();

// Notes
let notes = JSON.parse(localStorage.getItem("notes")) || [];
function renderNotes() {
  const container = document.getElementById("notes-container");
  container.innerHTML = "";
  notes.forEach((note, index) => {
    const div = document.createElement("div");
    div.className = "note";
    div.textContent = note;
    const del = document.createElement("button");
    del.textContent = "❌";
    del.className = "delete-btn";
    del.onclick = () => {
      notes.splice(index, 1);
      localStorage.setItem("notes", JSON.stringify(notes));
      renderNotes();
    };
    div.appendChild(del);
    container.appendChild(div);
  });
}
function addNote() {
  const input = document.getElementById("note-input");
  const text = input.value.trim();
  if (!text) return;
  notes.push(text);
  localStorage.setItem("notes", JSON.stringify(notes));
  renderNotes();
  input.value = "";
}
renderNotes();

// Pomodoro Timer
const start = document.getElementById("start");
const stop = document.getElementById("stop");
const reset = document.getElementById("reset");
const timerDisplay = document.getElementById("timer-display");
let timeLeft = 3600;
let interval;
const updateTimer = () => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};
const startTimer = () => {
  if (interval) return;
  interval = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft === 0) {
      clearInterval(interval);
      alert("Time's up!");
      timeLeft = 3600;
      updateTimer();
    }
  }, 1000);
};
const stopTimer = () => {
  clearInterval(interval);
  interval = null;
};
const resetTimer = () => {
  clearInterval(interval);
  interval = null;
  timeLeft = 3600;
  updateTimer();
};
start.addEventListener("click", startTimer);
stop.addEventListener("click", stopTimer);
reset.addEventListener("click", resetTimer);
updateTimer();

// Weather
const apikey="c888a7714b7ab5199fdfa33750fba0d4";
const apiUrl="https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

async function checkWeather(city) {
    try {
        const response = await fetch(apiUrl + city + `&appid=${apikey}`);

        if (response.status === 404) {
            document.querySelector(".error").style.display = "block";
            document.querySelector(".weather").style.display = "none";
            return;
        }

        const data = await response.json();

        document.querySelector(".city").textContent = data.name;
        document.querySelector(".temp").textContent = `${data.main.temp}°C`;
        document.querySelector(".humidity").textContent = `${data.main.humidity}%`;
        document.querySelector(".wind").textContent = `${data.wind.speed}km/h`;

        const main = data.weather[0].main;

        if (main === "Clouds") {
            weatherIcon.src = "images/clouds.png";
        } else if (main === "Clear") {
            weatherIcon.src = "images/clear.png";
        } else if (main === "Rain") {
            weatherIcon.src = "images/rain.png";
        } else if (main === "Drizzle") {
            weatherIcon.src = "images/drizzle.png";
        } else if (main === "Mist") {
            weatherIcon.src = "images/mist.png";
        } else {
            weatherIcon.src = "images/clear.png"; // Default fallback
        }

        document.querySelector(".weather").style.display = "block";
        document.querySelector(".error").style.display = "none";
    } catch (err) {
        console.error("Fetch error:", err);
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
    }
}


    

searchBtn.addEventListener("click",()=>{
    checkWeather(searchBox.value);
})
