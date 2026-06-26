import { GoogleGenAI } from '@google/generative-ai';

const goalInput = document.getElementById('goal-input');
const generateBtn = document.getElementById('generate-btn');
const taskList = document.getElementById('task-list');
const notification = document.getElementById('notification');
const loading = document.getElementById('loading');

const ai = new GoogleGenAI({ apiKey: 'AQ.Ab8RN6JWxCQBfhlYXNX7PPg7iedL4NB3kFlgJc2da9KCs5M2Rw' });

function showNotification(text, type) {
    notification.innerText = text;
    notification.className = `notification ${type}`;
    setTimeout(() => {
        notification.className = 'notification';
    }, 4000);
}

async function generatePlan() {
    const goalText = goalInput.value.trim();

    if (goalText === "") {
        showNotification("Please enter a goal or objective!", "error");
        return;
    }

    taskList.innerHTML = "";
    loading.style.display = "block";
    generateBtn.disabled = true;

    try {
        const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });
        
        const prompt = `Create a structured step-by-step task breakdown for the goal: "${goalText}". 
        Return strictly a valid JSON array of objects without any markdown formatting wrappers or backticks. 
        Each object must have exactly these keys: "name", "priority" (choose only between 'high', 'medium', 'low'), and "time" (estimated duration).`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text().trim();
        
        const tasks = JSON.parse(responseText);

        if (!Array.isArray(tasks)) {
            throw new Error("Invalid format returned from AI.");
        }

        tasks.forEach(task => {
            const li = document.createElement('li');
            
            const infoDiv = document.createElement('div');
            infoDiv.className = 'task-info';

            const nameSpan = document.createElement('span');
            nameSpan.className = 'task-name';
            nameSpan.innerText = task.name;

            const metaSpan = document.createElement('span');
            metaSpan.className = 'task-meta';
            metaSpan.innerHTML = `Time: ${task.time} | Priority: <span class="badge ${task.priority}">${task.priority}</span>`;

            infoDiv.appendChild(nameSpan);
            infoDiv.appendChild(metaSpan);

            const deleteBtn = document.createElement('button');
            deleteBtn.innerText = 'Delete';
            deleteBtn.className = 'delete-btn';
            deleteBtn.onclick = function() {
                taskList.removeChild(li);
                showNotification("Task removed", "success");
            };

            li.appendChild(infoDiv);
            li.appendChild(deleteBtn);
            taskList.appendChild(li);
        });

        showNotification("AI Plan generated successfully!", "success");
        goalInput.value = "";

    } catch (error) {
        showNotification(`Failed to generate plan: ${error.message}`, "error");
    } finally {
        loading.style.display = "none";
        generateBtn.disabled = false;
    }
}

generateBtn.addEventListener('click', generatePlan);

goalInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        generatePlan();
    }
});