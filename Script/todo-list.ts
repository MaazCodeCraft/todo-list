interface TodoItem {
    name: string;
    dueDate: string;
    id: string;
}

class TodoList {
    private todoList: TodoItem[];
    private nameInput: HTMLInputElement | null = null;
    private dateInput: HTMLInputElement | null = null;
    private nameError: HTMLElement | null = null;
    private dateError: HTMLElement | null = null;
    private addButton: HTMLButtonElement | null = null;

    constructor() {
        localStorage.removeItem('todoList');
        this.todoList = [];
        this.init();
    }

    private init(): void {
        this.cacheElements();
        this.renderTodoList();
        this.setupEventListeners();
        this.setMinDate();
    }

    private cacheElements(): void {
        this.nameInput = document.querySelector('.js-name-input');
        this.dateInput = document.querySelector('.js-due-date-input');
        this.nameError = document.querySelector('.js-name-error');
        this.dateError = document.querySelector('.js-date-error');
        this.addButton = document.querySelector('.js-add-todo-button');
    }

    private setMinDate(): void {
        if (this.dateInput) {
            const today = new Date().toISOString().split('T')[0];
            this.dateInput.min = today;
        }
    }

    private loadFromStorage(): TodoItem[] | null {
        const stored = localStorage.getItem('todoList');
        return stored ? JSON.parse(stored) : null;
    }

    private saveToStorage(): void {
        localStorage.setItem('todoList', JSON.stringify(this.todoList));
    }

    private renderTodoList(): void {
        const todoListElement = document.querySelector('.js-todo-list') as HTMLElement;
        const emptyState = document.querySelector('.js-empty-state') as HTMLElement;
        
        if (!todoListElement) return;

        if (this.todoList.length === 0) {
            todoListElement.innerHTML = '';
            if (emptyState) emptyState.style.display = 'block';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';
        
        let todoListHTML = '';
        this.todoList.forEach((todoObject: TodoItem) => {
            const { name, dueDate, id } = todoObject;
            const dateClasses = this.getDateClasses(dueDate);
            const formattedDate = this.formatDate(dueDate);
            
            const html = `
                <div class="bg-white rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-center shadow-md border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden animate-slide-up">
                    <div class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-500"></div>
                    <div class="font-medium text-gray-800 text-base break-words">${this.escapeHtml(name)}</div>
                    <div class="${dateClasses} text-sm font-medium px-3 py-2 rounded-lg whitespace-nowrap justify-self-center">${formattedDate}</div>
                    <button class="js-delete-todo-button bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 shadow-md shadow-red-500/30 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-500/40 justify-self-end" data-id="${id}">Delete</button>
                </div>`;
            todoListHTML += html;
        });

        todoListElement.innerHTML = todoListHTML;
        this.setupDeleteButtons();
    }

    private getDateClasses(dueDate: string): string {
        const today = new Date();
        const due = new Date(dueDate);
        const todayStr = today.toISOString().split('T')[0];
        
        if (dueDate === todayStr) return 'bg-yellow-100 text-yellow-800';
        if (due < today) return 'bg-red-100 text-red-800';
        return 'bg-gray-100 text-gray-700';
    }

    private formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        });
    }

    private escapeHtml(text: string): string {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    private setupDeleteButtons(): void {
        document.querySelectorAll('.js-delete-todo-button')
            .forEach((deleteButton: Element) => {
                deleteButton.addEventListener('click', (event: Event) => {
                    const target = event.target as HTMLButtonElement;
                    const id = target.dataset.id || '';
                    this.deleteTodo(id);
                });
            });
    }

    private setupEventListeners(): void {
        if (this.addButton) {
            this.addButton.addEventListener('click', () => {
                this.addTodo();
            });
        }

        [this.nameInput, this.dateInput].forEach(input => {
            if (input) {
                input.addEventListener('keypress', (event: KeyboardEvent) => {
                    if (event.key === 'Enter') {
                        this.addTodo();
                    }
                });
                
                input.addEventListener('input', () => {
                    this.clearError(input);
                });
            }
        });
    }

    private addTodo(): void {
        if (!this.nameInput || !this.dateInput) return;

        const name = this.nameInput.value.trim();
        const dueDate = this.dateInput.value;
        
        this.clearAllErrors();
        
        if (!this.validateInputs(name, dueDate)) {
            return;
        }

        const newTodo: TodoItem = {
            id: this.generateId(),
            name,
            dueDate
        };

        this.todoList.push(newTodo);
        
        this.nameInput.value = '';
        this.dateInput.value = '';
        
        this.renderTodoList();
        this.saveToStorage();
    }

    private validateInputs(name: string, dueDate: string): boolean {
        let isValid = true;

        if (!name) {
            this.showError(this.nameInput, this.nameError, 'Task name is required');
            isValid = false;
        } else if (name.length < 3) {
            this.showError(this.nameInput, this.nameError, 'Task name must be at least 3 characters');
            isValid = false;
        } else if (name.length > 100) {
            this.showError(this.nameInput, this.nameError, 'Task name must be less than 100 characters');
            isValid = false;
        }

        if (!dueDate) {
            this.showError(this.dateInput, this.dateError, 'Due date is required');
            isValid = false;
        } else {
            const selectedDate = new Date(dueDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                this.showError(this.dateInput, this.dateError, 'Due date cannot be in the past');
                isValid = false;
            }
        }

        // Check for duplicate tasks
        if (isValid && this.todoList.some(todo => todo.name.toLowerCase() === name.toLowerCase())) {
            this.showError(this.nameInput, this.nameError, 'A task with this name already exists');
            isValid = false;
        }

        return isValid;
    }

    private showError(input: HTMLInputElement | null, errorElement: HTMLElement | null, message: string): void {
        if (input) {
            input.classList.add('border-red-500', 'bg-red-50');
            input.classList.remove('border-gray-200', 'bg-gray-50');
        }
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove('opacity-0', '-translate-y-1');
            errorElement.classList.add('opacity-100', 'translate-y-0');
        }
    }

    private clearError(input: HTMLInputElement): void {
        input.classList.remove('border-red-500', 'bg-red-50');
        input.classList.add('border-gray-200', 'bg-gray-50');
        const errorElement = input === this.nameInput ? this.nameError : this.dateError;
        if (errorElement) {
            errorElement.classList.add('opacity-0', '-translate-y-1');
            errorElement.classList.remove('opacity-100', 'translate-y-0');
        }
    }

    private clearAllErrors(): void {
        [this.nameInput, this.dateInput].forEach(input => {
            if (input) this.clearError(input);
        });
    }

    private generateId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    private deleteTodo(id: string): void {
        this.todoList = this.todoList.filter(todo => todo.id !== id);
        this.renderTodoList();
        this.saveToStorage();
    }
}

// Initialize the todo list when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TodoList();
});