// Database sederhana berbasis objek (Key: Tanggal, Value: Array Tugas)
let db = JSON.parse(localStorage.getItem('myTodoDB')) || {};

const datePicker = document.getElementById('datePicker');
const selectedDateText = document.getElementById('selectedDateText');
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');

// Set tanggal hari ini sebagai default
const today = new Date().toISOString().split('T')[0];
datePicker.value = today;

// Inisialisasi SortableJS
const sortable = new Sortable(todoList, {
    animation: 150,
    ghostClass: 'sortable-ghost',
    onEnd: function() {
        saveCurrentOrder();
    }
});

// Fungsi menampilkan tugas berdasarkan tanggal
function renderTodos() {
    const date = datePicker.value;
    selectedDateText.innerText = new Date(date).toLocaleDateString('id-ID', { 
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
    });
    
    todoList.innerHTML = '';
    const tasks = db[date] || [];

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `todo-item ${task.completed ? 'completed' : ''}`;
        li.setAttribute('data-id', index);
        
        li.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${index})">
            <span class="todo-text">${task.text}</span>
            <button onclick="deleteTask(${index})" style="margin-left:10px; border:none; background:none; cursor:pointer;">❌</button>
        `;
        todoList.appendChild(li);
    });
}

// Tambah tugas baru
addBtn.addEventListener('click', () => {
    const text = todoInput.value.trim();
    const date = datePicker.value;
    if (!text) return;

    if (!db[date]) db[date] = [];
    db[date].push({ text, completed: false });
    
    todoInput.value = '';
    saveAndRender();
});

// Toggle Selesai (Coret)
window.toggleTask = (index) => {
    const date = datePicker.value;
    db[date][index].completed = !db[date][index].completed;
    saveAndRender();
};

// Hapus tugas
window.deleteTask = (index) => {
    const date = datePicker.value;
    db[date].splice(index, 1);
    saveAndRender();
};

// Simpan urutan setelah di-drag
function saveCurrentOrder() {
    const date = datePicker.value;
    const newOrder = [];
    document.querySelectorAll('.todo-item').forEach(item => {
        const text = item.querySelector('.todo-text').innerText;
        const completed = item.classList.contains('completed');
        newOrder.push({ text, completed });
    });
    db[date] = newOrder;
    localStorage.setItem('myTodoDB', JSON.stringify(db));
}

function saveAndRender() {
    localStorage.setItem('myTodoDB', JSON.stringify(db));
    renderTodos();
}

// Event listener saat tanggal diubah
datePicker.addEventListener('change', renderTodos);

// Render awal
renderTodos();