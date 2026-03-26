// Database sederhana di LocalStorage
let db = JSON.parse(localStorage.getItem('myTodoDB')) || {};

const datePicker = document.getElementById('datePicker');
const selectedDateText = document.getElementById('selectedDateText');
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const themeBtn = document.getElementById('themeBtn');

// 1. Logika Tema (Dark Mode)
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

// 2. Inisialisasi Default Tanggal
const today = new Date().toISOString().split('T')[0];
datePicker.value = today;

// 3. Fitur Drag and Drop (SortableJS)
new Sortable(todoList, {
    animation: 150,
    ghostClass: 'sortable-ghost',
    onEnd: saveCurrentOrder // Simpan urutan baru setiap kali selesai geser
});

// 4. Fungsi Menampilkan Tugas
function renderTodos() {
    const date = datePicker.value;
    if (!date) return;

    // Format tampilan tanggal
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    selectedDateText.innerText = new Date(date).toLocaleDateString('id-ID', options);
    
    todoList.innerHTML = '';
    const tasks = db[date] || [];

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `todo-item ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${index})">
            <span class="todo-text">${task.text}</span>
            <button class="delete-btn" onclick="deleteTask(${index})">🗑️</button>
        `;
        todoList.appendChild(li);
    });
}

// 5. Tambah Tugas
addBtn.addEventListener('click', () => {
    const text = todoInput.value.trim();
    const date = datePicker.value;
    if (!text) return;

    if (!db[date]) db[date] = [];
    db[date].push({ text, completed: false });
    
    todoInput.value = '';
    saveAndRender();
});

// 6. Coret Tugas (Toggle)
window.toggleTask = (index) => {
    const date = datePicker.value;
    db[date][index].completed = !db[date][index].completed;
    saveAndRender();
};

// 7. Hapus Tugas
window.deleteTask = (index) => {
    const date = datePicker.value;
    db[date].splice(index, 1);
    saveAndRender();
};

// 8. Simpan Urutan (Drag & Drop)
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
renderTodos(); // Jalankan saat pertama kali buka