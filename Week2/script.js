const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const notification = document.getElementById('notification');

function showNotification(text, type) {
    notification.innerText = text;
    notification.className = `notification ${type}`;
    
    setTimeout(() => {
        notification.className = 'notification'; 
    }, 2000);
}

function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        showNotification("Please enter a valid task!", "error");
        return;
    }

    const li = document.createElement('li');
    li.innerText = taskText;

    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'Delete';
    deleteBtn.className = 'delete-btn';
    
    deleteBtn.onclick = function() {
        taskList.removeChild(li);
        showNotification("Task deleted successfully", "success");
    };

    li.appendChild(deleteBtn);
    taskList.appendChild(li);

    taskInput.value = "";
    showNotification("Task added successfully!", "success");
}

addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});