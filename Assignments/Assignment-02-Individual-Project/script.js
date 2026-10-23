let workouts = {
    Monday: "Chest + Triceps",
    Tuesday: "Back + Biceps",
    Wednesday: "Legs",
    Thursday: "Shoulders",
    Friday: "Chest + Arms",
    Saturday: "Cardio",
    Sunday: "Rest Day"
};


/* LOAD SAVED DATA */

let tasks =
    JSON.parse(localStorage.getItem("fittrackTasks")) || {};

let completedDates =
    JSON.parse(localStorage.getItem("fittrackCompleted")) || [];

let currentMonth = new Date();


/* TODAY */

function getToday() {
    return new Date().toISOString().split("T")[0];
}

function getTodayDay() {

    return new Date().toLocaleDateString(
        "en-US",
        { weekday: "long" }
    );
}


/* PAGE NAVIGATION */

function showPage(page, button) {

    document.querySelectorAll(".page").forEach(function(section) {
        section.style.display = "none";
    });

    document.getElementById(page).style.display = "block";

    document.querySelectorAll(".menu").forEach(function(menu) {
        menu.classList.remove("active");
    });

    if (button) {
        button.classList.add("active");
    }

    let titles = {
        dashboard: "Fitness Dashboard",
        weekly: "Weekly Schedule",
        calendar: "Workout Calendar",
        streak: "Workout Streak"
    };

    document.getElementById("pageTitle").innerText =
        titles[page];

    if (page == "dashboard") {
        loadDashboard();
    }

    if (page == "weekly") {
        loadWeekly();
    }

    if (page == "calendar") {
        loadCalendar();
    }

    if (page == "streak") {
        loadStreak();
    }
}


/* DASHBOARD */

function loadDashboard() {

    let today = new Date();
    let day = getTodayDay();

    document.getElementById("headerDate").innerText =
        today.toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric"
            }
        );

    document.getElementById("todayDate").innerText =
        today.toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric"
            }
        );

    document.getElementById("statWorkout").innerText =
        workouts[day];

    document.getElementById("workoutTitle").innerText =
        workouts[day];

    document.getElementById("workoutDescription").innerText =
        getWorkoutDescription(workouts[day]);

    let streak = calculateStreak();

    document.getElementById("dashboardStreak").innerText =
        streak;

    document.getElementById("statStreak").innerText =
        streak + " Days";

    showTodayTasks();

}


/* WORKOUT DESCRIPTION */

function getWorkoutDescription(workout) {

    if (workout == "Rest Day") {
        return "Recovery day. Focus on rest, hydration and mobility.";
    }

    return "Complete today's planned exercises and keep your fitness routine consistent.";
}


/* TODAY TASKS */

function getTasksForToday() {

    let day = getTodayDay();

    if (!tasks[day]) {
        tasks[day] = [];
    }

    return tasks[day];
}


function addTodayTask() {

    let input =
        document.getElementById("todayTask");

    let text = input.value.trim();

    if (text == "") {
        alert("Please enter a task.");
        return;
    }

    let day = getTodayDay();

    if (!tasks[day]) {
        tasks[day] = [];
    }

    tasks[day].push({
        text: text
    });

    saveTasks();

    input.value = "";

    showTodayTasks();
}


function showTodayTasks() {

    let day = getTodayDay();

    let list =
        document.getElementById("todayTaskList");

    list.innerHTML = "";

    let todayTasks = tasks[day] || [];

    todayTasks.forEach(function(task, index) {

        let li =
            document.createElement("li");

        let completed =
            isTaskCompleted(day, index);

        if (completed) {
            li.style.textDecoration = "line-through";
            li.style.opacity = "0.55";
        }

        li.innerHTML =
            "<span>" + task.text + "</span>" +

            "<span class='task-buttons'>" +

            "<button class='complete' " +
            "onclick='toggleTask(" + index + ")'>✓</button>" +

            "<button class='delete' " +
            "onclick='deleteTodayTask(" + index + ")'>×</button>" +

            "</span>";

        list.appendChild(li);
    });

    let completed = 0;

    todayTasks.forEach(function(task, index) {
        if (isTaskCompleted(day, index)) {
            completed++;
        }
    });

    document.getElementById("taskCount").innerText =
        completed + " / " + todayTasks.length + " Completed";

    document.getElementById("statTasks").innerText =
        completed + " / " + todayTasks.length;
}


/* TASK COMPLETION */

function isTaskCompleted(day, index) {

    let key =
        day + "-" + index;

    let completedTasks =
        JSON.parse(
            localStorage.getItem("fittrackTaskStatus")
        ) || {};

    return completedTasks[getToday() + "-" + key] === true;
}


function toggleTask(index) {

    let day = getTodayDay();

    let completedTasks =
        JSON.parse(
            localStorage.getItem("fittrackTaskStatus")
        ) || {};

    let key =
        getToday() + "-" + day + "-" + index;

    completedTasks[key] =
        !completedTasks[key];

    localStorage.setItem(
        "fittrackTaskStatus",
        JSON.stringify(completedTasks)
    );

    showTodayTasks();

    checkDayCompletion();
}


/* DELETE */

function deleteTodayTask(index) {

    let day = getTodayDay();

    tasks[day].splice(index, 1);

    saveTasks();

    showTodayTasks();
}


/* WORKOUT COMPLETE */

function completeWorkout() {

    let today = getToday();

    if (!completedDates.includes(today)) {

        completedDates.push(today);

        localStorage.setItem(
            "fittrackCompleted",
            JSON.stringify(completedDates)
        );
    }

    alert("Today's workout completed! 🔥");

    loadDashboard();
}


/* CHECK TASK COMPLETION */

function checkDayCompletion() {

    let day = getTodayDay();

    let todayTasks = tasks[day] || [];

    if (todayTasks.length == 0) {
        return;
    }

    let allCompleted =
        todayTasks.every(function(task, index) {
            return isTaskCompleted(day, index);
        });

    if (allCompleted) {

        let today = getToday();

        if (!completedDates.includes(today)) {

            completedDates.push(today);

            localStorage.setItem(
                "fittrackCompleted",
                JSON.stringify(completedDates)
            );
        }
    }
}


/* SAVE TASKS */

function saveTasks() {

    localStorage.setItem(
        "fittrackTasks",
        JSON.stringify(tasks)
    );
}


/* WEEKLY */

function loadWeekly() {

    let container =
        document.getElementById("weeklyList");

    container.innerHTML = "";

    Object.keys(workouts).forEach(function(day) {

        let card =
            document.createElement("div");

        card.className = "week-card";

        card.innerHTML =
            "<h3>" + day + "</h3>" +

            "<p class='workout-name'>💪 " +
            workouts[day] +
            "</p>" +

            "<div class='add-task'>" +

            "<input id='input-" + day +
            "' placeholder='Add task...'>" +

            "<button class='add-button' " +
            "onclick=\"addWeeklyTask('" +
            day + "')\">Add</button>" +

            "</div>" +

            "<ul id='list-" +
            day + "'></ul>";

        container.appendChild(card);

        showWeeklyTasks(day);
    });
}


function addWeeklyTask(day) {

    let input =
        document.getElementById("input-" + day);

    let text = input.value.trim();

    if (text == "") {
        alert("Please enter a task.");
        return;
    }

    if (!tasks[day]) {
        tasks[day] = [];
    }

    tasks[day].push({
        text: text
    });

    saveTasks();

    input.value = "";

    showWeeklyTasks(day);

    if (day == getTodayDay()) {
        showTodayTasks();
    }
}


function showWeeklyTasks(day) {

    let list =
        document.getElementById("list-" + day);

    if (!list) {
        return;
    }

    list.innerHTML = "";

    let dayTasks = tasks[day] || [];

    dayTasks.forEach(function(task, index) {

        let li =
            document.createElement("li");

        li.innerHTML =
            "<span>" + task.text + "</span>" +

            "<button class='delete' " +
            "onclick=\"deleteWeeklyTask('" +
            day + "', " +
            index +
            ")\">×</button>";

        list.appendChild(li);
    });
}


function deleteWeeklyTask(day, index) {

    tasks[day].splice(index, 1);

    saveTasks();

    showWeeklyTasks(day);

    if (day == getTodayDay()) {
        showTodayTasks();
    }
}


/* CALENDAR */

function loadCalendar() {

    let year =
        currentMonth.getFullYear();

    let month =
        currentMonth.getMonth();

    let monthName =
        currentMonth.toLocaleDateString(
            "en-US",
            { month: "long" }
        );

    document.getElementById("monthYear").innerText =
        monthName + " " + year;

    let calendar =
        document.getElementById("calendarGrid");

    calendar.innerHTML = "";

    let days = [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat"
    ];

    days.forEach(function(day) {

        let div =
            document.createElement("div");

        div.innerText = day;

        div.style.fontWeight = "bold";

        div.style.background = "#edf3ff";

        calendar.appendChild(div);
    });

    let firstDay =
        new Date(year, month, 1).getDay();

    let totalDays =
        new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {

        let empty =
            document.createElement("div");

        empty.style.background = "transparent";

        calendar.appendChild(empty);
    }

    for (let day = 1; day <= totalDays; day++) {

        let div =
            document.createElement("div");

        div.innerText = day;

        let date =
            year + "-" +
            String(month + 1).padStart(2, "0") +
            "-" +
            String(day).padStart(2, "0");

        if (completedDates.includes(date)) {
            div.classList.add("completed");
            div.innerText = "✓ " + day;
        }

        if (date == getToday()) {
            div.classList.add("today-date");
        }

        calendar.appendChild(div);
    }
}


function previousMonth() {

    currentMonth.setMonth(
        currentMonth.getMonth() - 1
    );

    loadCalendar();
}


function nextMonth() {

    currentMonth.setMonth(
        currentMonth.getMonth() + 1
    );

    loadCalendar();
}


/* STREAK */

function calculateStreak() {

    let streak = 0;

    let date = new Date();

    while (true) {

        let current =
            date.toISOString().split("T")[0];

        if (completedDates.includes(current)) {

            streak++;

            date.setDate(
                date.getDate() - 1
            );

        } else {
            break;
        }
    }

    return streak;
}


function loadStreak() {

    document.getElementById("bigStreak").innerText =
        calculateStreak();
}


/* INITIAL LOAD */

loadDashboard();