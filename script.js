////////////////////////
// Workout functionality 

// parse workout: each entry is the time of an exercise or pause in seconds
let workoutPlan = [];
function parseWorkout() {
    const exercises = document.querySelectorAll(".exercise");
    exercises.forEach((exercise) => {
        let contentExercise = exercise.querySelectorAll(".counterField");

        // extract the information for each exercise added
        let repeats = parseInt(contentExercise[0].innerHTML);
        let timeRepeat = parseInt(contentExercise[1].innerHTML);
        let timePause = parseInt(contentExercise[2].innerHTML);
        let numberRepeats = parseInt(contentExercise[3].innerHTML);

        // append respective times to workout plan
        for (let i = 0; i < repeats; i++) {
            // append the time for one repeat as often as in number repeats
            for (let j = 0; j < numberRepeats; j++) {
                workoutPlan.push(timeRepeat);
            }
            workoutPlan.push(timePause);
        }
    })
}

///////////
// Timer
let currentSeconds = 0;
let targetSeconds = 40;

let stoppedTime = 0;

////
// timing function
const time = document.querySelector("#time");

// change the current seconds and the inner html in time
let timeStopped = true;
let interval = NaN;
function activateTimer() {
    let nowFixed = new Date()

    interval = setInterval(() => {
        if (currentSeconds <= targetSeconds) {
            let now = new Date();
            currentSeconds = (now.getTime() - nowFixed.getTime()) / 1000 + stoppedTime;
            time.innerHTML = parseInt(currentSeconds);
            timeStopped = false;
        }
        else {
            stopTimer()
        }
    }, 10)

}





function stopTimer() {
    stoppedTime = currentSeconds;
    clearInterval(interval);
    timeStopped = true;
}

function resetTimer() {
    stopTimer()
    currentSeconds = 0;
    stoppedTime = 0;
    time.innerHTML = currentSeconds;
}

// update progress bar on change of time 
const bar = document.getElementById("bar");
const progressUpdater = setInterval(() => {
    bar.style.width = String(100 * currentSeconds / targetSeconds) + "%";
})

// time array: [40,120,10] with elemnts in seconds
const audio = new Audio('https://www.soundjay.com/buttons/beep-01a.mp3')

function timerWorkout(timeArray) {
    let index = 0;
    let started = false;
    resetTimer();

    let id = setInterval(() => {
        if (timeArray.length <= index) {
            stopTimer();
            clearInterval(id);
            time.innerHTML = "👏🏽";
        }

        else if (!started) {
            targetSeconds = timeArray[index];
            resetTimer();
            activateTimer();
            started = true;
            // set color of progress bar if it is pause 
            if (targetSeconds > 80) {
                time.style.color = "#8FBDD3";
                bar.style.backgroundColor = "#8FBDD3";
            }
            else {
                time.style.color = "#FF4C29";
                bar.style.backgroundColor = "#FF4C29";
            }
        }

        else if (targetSeconds <= currentSeconds) {
            started = false;
            index++;
            // play beep if the current round is finished
            audio.play()
        }
    }, 10)
}

// timer for whole plan
function startTimerWorkout() {
    timerWorkout(workoutPlan);
}


// timer for single timer
const singleTimer = document.getElementById("singleTimer");

singleTimer.addEventListener("click", () => {
    let input = parseInt(singleTimer.value);
    if (!isNaN(input)) {
        singleTimer.value = input;
    }
}
)


const startSingleTimer = document.getElementById("startSingleTimer");
startSingleTimer.addEventListener("click", () => {
    landingPage.style.display = "none";
    workout.style.display = "flex";
    // start the timer
    timerWorkout([singleTimer.value])
});





///////////
// Styling

////
// Workout

// append counter buttons 
function appendCounterButtons() {
    // get all counter containers
    const counterContainers = document.querySelectorAll(".counterContainer");

    counterContainers.forEach((counterContainer) => {

        // get counter field node
        const counter = counterContainer.querySelector(".counterField");

        // create buttons
        const up = document.createElement("button");
        up.classList.add(".counterButton");
        up.innerHTML = "➕";
        up.style.order = "-1";

        const down = document.createElement("button");
        down.classList.add(".counterButton");
        down.innerHTML = "➖";

        // add functionality to buttons
        up.addEventListener("click", () => counter.textContent++);
        down.addEventListener("click", () => {
            if (counter.textContent > 0) {
                counter.textContent--;
            }
        })

        // append 
        counterContainer.appendChild(up);
        counterContainer.appendChild(down);
    })
}



// append workout card
function appendExerciseCard() {
    // create exercise card
    const exercise = document.createElement("div");
    exercise.classList.add("exercise");

    // append #repeats - duration exercise - duration pause - #
    const counterFields = document.querySelectorAll(".addExercise .counterField");
    counterFields.forEach((counterField) => {
        exercise.appendChild(counterField.cloneNode(true));
    })

    // create remove button
    const rm = document.createElement("div");
    rm.classList.add("remove");
    rm.textContent = "❌"

    exercise.appendChild(rm);

    // append card to exercises
    exercises.appendChild(exercise);

    // add functionality to remove button
    rm.addEventListener("click", () => exercise.remove(exercise))
}


////
// activ workout


// switch display
const startButton = document.getElementById("startWorkout");
const endButton = document.getElementById("endWorkout");

const landingPage = document.getElementById("landingPage");
const workout = document.getElementById("workout");

startButton.addEventListener("click", () => {
    landingPage.style.display = "none";
    workout.style.display = "flex";

    // parse then workout
    workoutPlan = [];
    parseWorkout();

    // start the timer
    startTimerWorkout();
})

endButton.addEventListener("click", () => {
    landingPage.style.display = "flex";
    workout.style.display = "none";
    resetTimer();
})


////////////////////////
// Event listeners

// reset timer when reset button is pressed
const reset = document.getElementById("resetTimer");
reset.addEventListener("click", resetTimer);

// add workout card when add button is pressed
const add = document.querySelector("#addExerciseTimer");
add.addEventListener("click", appendExerciseCard);


// click on time to stop/resume
time.addEventListener("click", () => {
    if (timeStopped) {
        activateTimer();
    }
    else {
        stopTimer();
    }
})



////////////////////////
// dropdown functionality
let coll = document.getElementsByClassName("collapsible");
let i;

for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.display === "flex") {
            content.style.display = "none";
        } else {
            content.style.display = "flex";
        }
    });
}



///////////////////
// Executing functions

// append buttons
appendCounterButtons()
