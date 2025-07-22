// Task Manager Application
class TaskManager {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    this.filteredTasks = [];
    this.currentFilter = "all";
    this.currentCategory = "all";
    this.currentPriority = "all";
    this.searchQuery = "";
    
    this.init();
  }
  
  init() {
    this.renderTasks();
    this.updateStats();
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    document.getElementById("taskInput").addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.addTask();
    });
  }
  
  saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
    this.updateStats();
  }
  
  formatTimestamp(date) {
    return new Date(date).toLocaleString();
  }
  
  renderTasks() {
    const list = document.getElementById("taskList");
    list.innerHTML = "";
    
    const tasksToRender = this.searchQuery || this.currentFilter !== "all" || 
                         this.currentCategory !== "all" || this.currentPriority !== "all" 
                         ? this.filteredTasks : this.tasks;
    
    if (tasksToRender.length === 0) {
      list.innerHTML = `<li class="empty-state">No tasks found. Add a new task to get started!</li>`;
      return;
    }
    
    tasksToRender.forEach((task, index) => {
      const originalIndex = this.tasks.findIndex(t => t.id === task.id);
      const li = document.createElement("li");
      li.className = `task-item ${task.completed ? "completed" : ""}`;
      
      li.innerHTML = `
        <div class="task-content">
          <div class="task-text" onclick="taskManager.toggleTask(${originalIndex})">
            ${task.text}
          </div>
          <div class="task-meta">
            <span class="task-category ${task.category}">${task.category}</span>
            <span class="task-priority ${task.priority}">${task.priority}</span>
          </div>
          <div class="task-timestamp">${this.formatTimestamp(task.timestamp)}</div>
        </div>
        <div class="task-actions">
          <button class="task-btn complete" onclick="taskManager.toggleTask(${originalIndex})">
            <i class="fas fa-check"></i>
          </button>
          <button class="task-btn edit" onclick="taskManager.editTask(${originalIndex})">
            <i class="fas fa-pencil-alt"></i>
          </button>
          <button class="task-btn delete" onclick="taskManager.deleteTask(${originalIndex})">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>`;
      
      list.appendChild(li);
    });
  }
  
  addTask() {
    const input = document.getElementById("taskInput");
    const text = input.value.trim();
    const category = document.getElementById("taskCategory").value;
    const priority = document.getElementById("taskPriority").value;
    
    if (text !== "") {
      const newTask = {
        id: Date.now().toString(),
        text,
        category,
        priority,
        completed: false,
        timestamp: Date.now()
      };
      
      this.tasks.unshift(newTask);
      input.value = "";
      this.saveTasks();
      this.filterTasks();
    }
  }
  
  toggleTask(index) {
    this.tasks[index].completed = !this.tasks[index].completed;
    this.tasks[index].timestamp = Date.now(); // Update timestamp when toggled
    this.saveTasks();
    this.filterTasks();
  }
  
  editTask(index) {
    const newText = prompt("Edit your task:", this.tasks[index].text);
    if (newText !== null && newText.trim() !== "") {
      this.tasks[index].text = newText.trim();
      this.tasks[index].timestamp = Date.now(); // Update timestamp when edited
      this.saveTasks();
      this.filterTasks();
    }
  }
  
  deleteTask(index) {
    if (confirm("Are you sure you want to delete this task?")) {
      this.tasks.splice(index, 1);
      this.saveTasks();
      this.filterTasks();
    }
  }
  
  clearCompleted() {
    this.tasks = this.tasks.filter(task => !task.completed);
    this.saveTasks();
    this.filterTasks();
  }
  
  clearAll() {
    if (confirm("Are you sure you want to delete ALL tasks? This cannot be undone.")) {
      this.tasks = [];
      this.saveTasks();
      this.filterTasks();
    }
  }
  
  filterTasks() {
    this.searchQuery = document.getElementById("searchInput").value.toLowerCase();
    this.currentFilter = document.getElementById("filterStatus").value;
    this.currentCategory = document.getElementById("filterCategory").value;
    this.currentPriority = document.getElementById("filterPriority").value;
    
    this.filteredTasks = this.tasks.filter(task => {
      const matchesSearch = task.text.toLowerCase().includes(this.searchQuery);
      const matchesFilter = this.currentFilter === "all" || 
                          (this.currentFilter === "active" && !task.completed) || 
                          (this.currentFilter === "completed" && task.completed);
      const matchesCategory = this.currentCategory === "all" || 
                            task.category === this.currentCategory;
      const matchesPriority = this.currentPriority === "all" || 
                             task.priority === this.currentPriority;
      
      return matchesSearch && matchesFilter && matchesCategory && matchesPriority;
    });
    
    this.renderTasks();
  }
  
  updateStats() {
    document.getElementById("totalTasks").textContent = this.tasks.length;
    document.getElementById("activeTasks").textContent = this.tasks.filter(t => !t.completed).length;
    document.getElementById("completedTasks").textContent = this.tasks.filter(t => t.completed).length;
  }
}

// Initialize Task Manager
const taskManager = new TaskManager();

// Theme Toggle Function
function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  const themeIcon = document.querySelector(".theme-toggle i");
  if (document.body.classList.contains("dark-mode")) {
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");
  } else {
    themeIcon.classList.remove("fa-sun");
    themeIcon.classList.add("fa-moon");
  }
}

// Expose functions to global scope for HTML onclick attributes
function addTask() { taskManager.addTask(); }
function toggleTask(index) { taskManager.toggleTask(index); }
function editTask(index) { taskManager.editTask(index); }
function deleteTask(index) { taskManager.deleteTask(index); }
function clearCompleted() { taskManager.clearCompleted(); }
function clearAll() { taskManager.clearAll(); }
function filterTasks() { taskManager.filterTasks(); }