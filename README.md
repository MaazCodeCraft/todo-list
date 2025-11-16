# 📝 Modern Todo List Application

A sleek, professional todo list application built with TypeScript and Tailwind CSS, featuring comprehensive validations and modern 3D design.

## ✨ Features

### 🎨 Modern Design

- **3D Glass Morphism UI** with gradient backgrounds
- **Smooth animations** and hover effects
- **Responsive design** for all devices
- **Professional color scheme** with purple/blue gradients
- **Inter font** for modern typography

### ✅ Smart Validations

- **Required field validation** - both name and date required
- **Length validation** - 3-100 characters for task names
- **Date validation** - prevents past dates
- **Duplicate detection** - no identical task names
- **Real-time error feedback** with visual indicators

### 🚀 Enhanced UX

- **Empty state** with friendly messaging
- **Date formatting** - displays as "Mon, Dec 25"
- **Status indicators** - highlights overdue and today's tasks
- **Keyboard shortcuts** - Enter key to add tasks
- **Local storage** - persists data between sessions

## 🛠️ Tech Stack

- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Vanilla JavaScript** - No framework dependencies
- **Local Storage API** - Client-side data persistence

## 📁 Project Structure

```
Todo List/
├── README.md
├── package.json
├── tsconfig.json
├── todo-list.html
├── Script/
│   ├── todo-list.ts
│   └── todo-list.js
└── Style/
    └── todo-list.css (legacy)
```

## 🚀 Getting Started

### Prerequisites

- Node.js (for TypeScript compilation)
- Modern web browser
- Text editor/IDE

### Installation

1. **Clone or download** the project
2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Compile TypeScript** (optional):

   ```bash
   npm run build
   ```

4. **Open** `todo-list.html` in your browser

### Development

- **Watch mode** for TypeScript:
  ```bash
  npm run watch
  ```

## 📱 Usage

1. **Add Tasks**: Enter task name and due date, click "Add Task" or press Enter
2. **View Tasks**: See all tasks with formatted dates and status indicators
3. **Delete Tasks**: Click the delete button on any task
4. **Status Indicators**:
   - 🟡 **Today** - tasks due today
   - 🔴 **Overdue** - past due tasks
   - ⚪ **Upcoming** - future tasks

## 🎯 Validation Rules

- **Task Name**: 3-100 characters, no duplicates
- **Due Date**: Cannot be in the past
- **Both fields**: Required for submission

## 🔧 Customization

### Styling

The app uses Tailwind CSS classes for easy customization:

- Modify colors in gradient classes
- Adjust spacing with padding/margin utilities
- Change animations in transition classes

### Functionality

Key methods in `TodoList` class:

- `addTodo()` - Add new tasks
- `deleteTodo()` - Remove tasks
- `validateInputs()` - Input validation
- `renderTodoList()` - UI updates

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

**Made with ❤️ using TypeScript and Tailwind CSS**
