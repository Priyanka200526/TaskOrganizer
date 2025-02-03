let input = document.getElementById("taskInput");
        let addBtn = document.getElementById("addbtn");
        let ul = document.getElementById("taskList");
        let currentDate = document.getElementById("currentDate");
        let currentTime = document.getElementById("currentTime");

        function updateDateTime() {
            let now = new Date();
            let date = now.getDate() + "/" + (now.getMonth()) + "/" + now.getFullYear();
            let time = now.toLocaleTimeString();
            document.getElementById("currentDate").textContent = date + ",";
            document.getElementById("currentTime").textContent = time;
        }
        setInterval(updateDateTime, 1000);

        function saveTasks() {
            let tasks = [];
            document.querySelectorAll("#taskList li").forEach(li => {
                let taskText = li.querySelector("span").textContent;
                let isCompleted = li.querySelector("span").classList.contains("completed")
                tasks.push({ text: taskText, completed: isCompleted })
            });
            localStorage.setItem("tasks", JSON.stringify(tasks));
        }

        function loadTasks() {
            let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
            tasks.forEach(task => {
                addTaskToList(task.text, task.completed)
            });
            updateTaskCount()
        }

        let taskCounter = document.createElement("div")
        taskCounter.innerText = "completed : 0 | Uncompleted : 0";
        taskCounter.classList.add("countbtn")
        document.querySelector(".container").appendChild(taskCounter);


        function updateTaskCount() {
            let completedTasks = document.querySelectorAll("#taskList li span.completed").length;
            let totalTasks = document.querySelectorAll("#taskList li").length;
            let incompletedTasks = totalTasks - completedTasks;
            taskCounter.innerText = `completed:${completedTasks} | Incompleted : ${incompletedTasks}`
        }
        function checkdeadlines() {
            document.querySelectorAll("#taskList li span").forEach(span => {
                if (span.classList.contains("completed")) {
                    span.style.color = "red"
                }
                else {
                    span.style.color = "white"
                }
            })
        }
        function addTaskToList(taskText, isCompleted = false) {
            let li = document.createElement("li");
            let span = document.createElement("span");
            span.textContent = taskText;
            if (isCompleted) {
                span.classList.add("completed")
            }
            li.appendChild(span);

            let buttonGroup = document.createElement("div");
            buttonGroup.classList.add("button-group");

            let completeButton = document.createElement("button");
            completeButton.innerHTML = `<i class="ri-checkbox-circle-fill"></i>`;
            completeButton.addEventListener("click", () => {
                span.classList.toggle("completed")
                updateTaskCount();
                saveTasks();
                checkdeadlines()
            });

            let editButton = document.createElement("button");
            editButton.innerHTML = `<i class="ri-pencil-fill"></i>`;
            editButton.classList.add("editbtn");
            editButton.addEventListener("click", () => {
                input.value = span.textContent;
                li.remove();
                saveTasks();
                updateTaskCount();
            });

            let deleteButton = document.createElement("button");
            deleteButton.innerHTML = `<i class="ri-delete-bin-5-fill"></i>`;
            deleteButton.classList.add("deletebtn");
            deleteButton.addEventListener("click", () => {
                li.remove();
                saveTasks();
                updateTaskCount()
            });

            buttonGroup.appendChild(completeButton);
            buttonGroup.appendChild(editButton);
            buttonGroup.appendChild(deleteButton);
            li.appendChild(buttonGroup);
            ul.appendChild(li);
            updateTaskCount();
            checkdeadlines()

        }
        addBtn.addEventListener("click", () => {
            if (input.value.trim() === "") {
                alert("Task cannot be empty!")
                return
            }
            addTaskToList(input.value.trim())
            saveTasks();
            input.value = "";
            updateTaskCount()
        })
        input.addEventListener("keypress", (e) => {
            if (e.key === "Enter" && input.value.trim() !== "") {
                addTaskToList(input.value.trim());
                saveTasks();
                input.value = "";
                input.focus()
                updateTaskCount();
            }
        });
        let allclear = document.createElement("button")
        allclear.innerText = "clear"
        allclear.classList.add("clearbtn")
        allclear.addEventListener("click", () => {
            ul.innerHTML = "";
            localStorage.removeItem("tasks")
            updateTaskCount()
        })
        document.querySelector(".container").appendChild(allclear)
        loadTasks();
        updateTaskCount()
        checkdeadlines()