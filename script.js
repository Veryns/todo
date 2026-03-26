let db = JSON.parse(localStorage.getItem('myTodoDB')) || {};

const datePicker = document.getElementById('datePicker');
const selectedDateText = document.getElementById('selectedDateText');
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const themeBtn = document.getElementById('themeBtn');
const actionBar = document.getElementById('actionBar');

// 1. Logika Tema
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeBtn.innerText = '☀️ Mode Terang';
}

themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeBtn.innerText = isDark ? '☀️ Mode Terang' : '🌙 Mode Gelap';
});

// 2. Inisialisasi Tanggal
const today = new Date().toISOString().split('T')[0];
datePicker.value = today;

// 3. Drag and Drop
new Sortable(todoList, {
    animation: 150,
    onEnd: saveCurrentOrder
});

// 4. Render Tugas & Tombol Hapus Semua
function renderTodos() {
    const date = datePicker.value;
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    selectedDateText.innerText = new Date(date).toLocaleDateString('id-ID', options);
    
    todoList.innerHTML = '';
    actionBar.innerHTML = ''; // Reset bar tombol
    
    const tasks = db[date] || [];

    // Jika ada tugas, tampilkan tombol Hapus Semua
    if (tasks.length > 0) {
        const clearBtn = document.createElement('button');
        clearBtn.className = 'clear-btn';
        clearBtn.innerText = '🗑️ Hapus Semua Tugas Hari Ini';
        clearBtn.onclick = clearAllTasks;
        actionBar.appendChild(clearBtn);
    }

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `todo-item ${task.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${index})">
            <span class="todo-text">${task.text}</span>
            <button class="delete-btn" onclick="deleteTask(${index})">❌</button>
        `;
        todoList.appendChild(li);
    });
}

// 5. Logika Tambah & Hapus
addBtn.addEventListener('click', () => {
    const text = todoInput.value.trim();
    const date = datePicker.value;
    if (!text) return;
    if (!db[date]) db[date] = [];
    db[date].push({ text, completed: false });
    todoInput.value = '';
    saveAndRender();
});

function clearAllTasks() {
    const date = datePicker.value;
    if (confirm(`Hapus semua tugas untuk tanggal ${date}?`)) {
        db[date] = [];
        saveAndRender();
    }
}

window.toggleTask = (index) => {
    const date = datePicker.value;
    db[date][index].completed = !db[date][index].completed;
    saveAndRender();
};

window.deleteTask = (index) => {
    const date = datePicker.value;
    db[date].splice(index, 1);
    saveAndRender();
};

function saveCurrentOrder() {
    const date = datePicker.value;
    const items = document.querySelectorAll('.todo-item');
    const newOrder = [];
    items.forEach(item => {
        newOrder.push({
            text: item.querySelector('.todo-text').innerText,
            completed: item.classList.contains('completed')
        });
    });
    db[date] = newOrder;
    localStorage.setItem('myTodoDB', JSON.stringify(db));
}

function saveAndRender() {
    localStorage.setItem('myTodoDB', JSON.stringify(db));
    renderTodos();
}

datePicker.addEventListener('change', renderTodos);
renderTodos();