document.addEventListener('DOMContentLoaded', () => {
    // Highlight active navigation link automatically based on filename
    const currentLocation = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === currentLocation) {
            link.classList.add('active');
        }
    });

    // --- ACADEMIC PLANNER LOGIC ---
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    // In-memory array to store tasks
    let tasks = JSON.parse(localStorage.getItem('academic_tasks')) || [
        { id: 1, text: 'Submit Web Engineering Assignment', completed: false },
        { id: 2, text: 'Prepare for Database Systems Midterm', completed: true }
    ];

    function saveAndRenderTasks() {
        localStorage.setItem('academic_tasks', JSON.stringify(tasks));
        renderTasks();
    }

    function renderTasks() {
        if (!taskList) return;
        taskList.innerHTML = '';

        if (tasks.length === 0) {
            taskList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No pending tasks. Add one above!</p>';
            return;
        }

        tasks.forEach((task) => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            
            li.innerHTML = `
                <span>${escapeHtml(task.text)}</span>
                <div class="task-actions">
                    <button class="task-btn complete-btn" onclick="toggleTask(${task.id})">
                        ${task.completed ? 'Unmark' : 'Complete'}
                    </button>
                    <button class="task-btn delete-btn" onclick="deleteTask(${task.id})">Delete</button>
                </div>
            `;
            taskList.appendChild(li);
        });
    }

    // Global helper for inline event handlers
    window.toggleTask = function(id) {
        tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
        saveAndRenderTasks();
    };

    window.deleteTask = function(id) {
        tasks = tasks.filter(t => t.id !== id);
        saveAndRenderTasks();
    };

    if (addTaskBtn && taskInput) {
        addTaskBtn.addEventListener('click', () => {
            const text = taskInput.value.trim();
            if (!text) {
                alert('Please enter a task description.');
                return;
            }
            const newTask = {
                id: Date.now(),
                text: text,
                completed: false
            };
            tasks.push(newTask);
            taskInput.value = '';
            saveAndRenderTasks();
        });

        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addTaskBtn.click();
            }
        });

        renderTasks();
    }

    // --- CONTACT FORM VALIDATION LOGIC ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const phoneInput = document.getElementById('phone');
            const messageInput = document.getElementById('message');
            const successBanner = document.getElementById('successBanner');

            let isValid = true;

            // Reset previous errors
            document.querySelectorAll('.form-group').forEach(group => group.classList.remove('error'));
            successBanner.style.display = 'none';

            // Validate Name (No field is empty)
            if (!nameInput.value.trim()) {
                setError(nameInput, 'Name cannot be empty.');
                isValid = false;
            }

            // Validate Email format & emptiness
            const emailVal = emailInput.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailVal) {
                setError(emailInput, 'Email cannot be empty.');
                isValid = false;
            } else if (!emailRegex.test(emailVal)) {
                setError(emailInput, 'Please enter a valid email address format.');
                isValid = false;
            }

            // Validate Phone number (contains only digits & not empty)
            const phoneVal = phoneInput.value.trim();
            const digitsRegex = /^\d+$/;
            if (!phoneVal) {
                setError(phoneInput, 'Phone number cannot be empty.');
                isValid = false;
            } else if (!digitsRegex.test(phoneVal)) {
                setError(phoneInput, 'Phone number must contain only digits.');
                isValid = false;
            }

            // Validate Message (No field is empty)
            if (!messageInput.value.trim()) {
                setError(messageInput, 'Message cannot be empty.');
                isValid = false;
            }

            // If all checks pass
            if (isValid) {
                successBanner.style.display = 'block';
                successBanner.textContent = `Thank you, ${nameInput.value}! Your message has been sent successfully.`;
                contactForm.reset();
                setTimeout(() => {
                    successBanner.style.display = 'none';
                }, 5000);
            }
        });
    }

    function setError(inputElement, message) {
        const formGroup = inputElement.parentElement;
        formGroup.classList.add('error');
        const errorDiv = formGroup.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.textContent = message;
        }
    }

    function escapeHtml(str) {
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
});
