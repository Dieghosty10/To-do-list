document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const todoInput = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('todo-list');
    const searchInput = document.getElementById('search-input');
    const clearAllBtn = document.getElementById('clear-all');
    const themeSwitcher = document.getElementById('theme-switcher');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // Variables de estado
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let currentFilter = 'all';
    let searchTerm = '';

    // Inicializar SortableJS para drag and drop
    const sortable = new Sortable(todoList, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        onEnd: function() {
            const items = Array.from(todoList.children);
            const newTodos = items.map(item => {
                return todos.find(todo => todo.id === Number(item.dataset.id));
            });
            todos = newTodos;
            saveTodos();
        }
    });

    // Event Listeners
    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => e.key === 'Enter' && addTodo());
    searchInput.addEventListener('input', (e) => {
        searchTerm = e.target.value.toLowerCase();
        renderTodos();
    });
    clearAllBtn.addEventListener('click', clearAll);
    themeSwitcher.addEventListener('change', toggleTheme);
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTodos();
        });
    });

    // Solicitar permisos para notificaciones
    if ('Notification' in window) {
        Notification.requestPermission();
    }

    // Cargar tema guardado
    loadTheme();

    // Renderizar tareas iniciales
    renderTodos();

    // Funciones principales
    function addTodo() {
        const text = todoInput.value.trim();
        const priority = document.getElementById('priority-select').value;
        
        if (text) {
            const newTodo = {
                id: Date.now(),
                text,
                priority,
                completed: false,
                createdAt: new Date().toISOString()
            };
            
            todos.unshift(newTodo);
            renderTodos();
            todoInput.value = '';
            showNotification('✅ Tarea añadida correctamente');
            todoInput.focus();
        }
    }

    function renderTodos() {
        const filteredTodos = todos.filter(todo => {
            const matchesFilter = currentFilter === 'all' || 
                               (currentFilter === 'completed' && todo.completed) || 
                               (currentFilter === 'pending' && !todo.completed);
            
            const matchesSearch = todo.text.toLowerCase().includes(searchTerm);
            
            return matchesFilter && matchesSearch;
        });

        todoList.innerHTML = '';

        if (filteredTodos.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <i class="fas fa-clipboard-list"></i>
                <p>No hay tareas ${searchTerm ? 'que coincidan' : currentFilter !== 'all' ? currentFilter === 'completed' ? 'completadas' : 'pendientes' : ''}</p>
            `;
            todoList.appendChild(emptyState);
            return;
        }

        filteredTodos.forEach(todo => {
            const todoItem = document.createElement('li');
            todoItem.className = `todo-item ${todo.completed ? 'completed' : ''} ${todo.priority}`;
            todoItem.dataset.id = todo.id;
            
            todoItem.innerHTML = `
                <button class="complete-btn" title="${todo.completed ? 'Marcar como pendiente' : 'Marcar como completada'}">
                    <i class="fas ${todo.completed ? 'fa-check-circle' : 'fa-circle'}"></i>
                </button>
                <span class="todo-text" contenteditable="false">${todo.text}</span>
                <div class="todo-actions">
                    <button class="edit-btn" title="Editar tarea">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" title="Eliminar tarea">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            todoList.appendChild(todoItem);

            // Eventos para cada tarea
            setupTodoItemEvents(todoItem, todo);
        });

        updateStats();
    }

    function setupTodoItemEvents(todoItem, todo) {
        const completeBtn = todoItem.querySelector('.complete-btn');
        const editBtn = todoItem.querySelector('.edit-btn');
        const deleteBtn = todoItem.querySelector('.delete-btn');
        const todoText = todoItem.querySelector('.todo-text');

        // Completar/descompletar tarea
        completeBtn.addEventListener('click', () => {
            const id = Number(todoItem.dataset.id);
            todos = todos.map(t => 
                t.id === id ? { ...t, completed: !t.completed } : t
            );
            saveTodos();
            renderTodos();
            showNotification(todo.completed ? '📝 Tarea marcada como pendiente' : '✅ Tarea completada');
        });

        // Editar tarea (doble clic en el texto)
        todoText.addEventListener('dblclick', () => {
            todoText.contentEditable = true;
            todoText.focus();
            document.execCommand('selectAll', false, null);
        });

        todoText.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                todoText.blur();
            }
        });

        todoText.addEventListener('blur', () => {
            todoText.contentEditable = false;
            const id = Number(todoItem.dataset.id);
            const newText = todoText.textContent.trim();
            
            if (newText && newText !== todo.text) {
                todos = todos.map(t => 
                    t.id === id ? { ...t, text: newText } : t
                );
                saveTodos();
                showNotification('✏️ Tarea actualizada');
            } else {
                todoText.textContent = todo.text;
            }
        });

        // Botón de edición
        editBtn.addEventListener('click', () => {
            todoText.dispatchEvent(new MouseEvent('dblclick'));
        });

        // Eliminar tarea
        deleteBtn.addEventListener('click', () => {
            const id = Number(todoItem.dataset.id);
            todos = todos.filter(t => t.id !== id);
            saveTodos();
            renderTodos();
            showNotification('🗑️ Tarea eliminada');
        });
    }

    function clearAll() {
        if (todos.length > 0 && confirm('¿Estás seguro de eliminar todas las tareas?')) {
            todos = [];
            saveTodos();
            renderTodos();
            showNotification('🧹 Todas las tareas eliminadas');
        }
    }

    function updateStats() {
        const totalTasks = todos.length;
        const completedTasks = todos.filter(todo => todo.completed).length;
        
        document.getElementById('total-tasks').textContent = 
            `${totalTasks} ${totalTasks === 1 ? 'tarea' : 'tareas'}`;
            
        document.getElementById('completed-tasks').textContent = 
            `${completedTasks} completada${completedTasks !== 1 ? 's' : ''}`;
    }

    function toggleTheme() {
        const isDark = themeSwitcher.checked;
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }

    function loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeSwitcher.checked = savedTheme === 'dark';
    }

    function showNotification(message) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('To-Do List Pro', { body: message });
        }
    }

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }
});