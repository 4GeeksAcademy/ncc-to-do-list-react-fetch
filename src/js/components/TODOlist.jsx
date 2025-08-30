import React, { useState, useEffect } from 'react';

const TodoService = {
    API_URL: 'https://playground.4geeks.com/todo/users/ncarrillocofr',
    USER_URL: 'https://playground.4geeks.com/todo/users/ncarrillocofr',
    TODOS_URL: 'https://playground.4geeks.com/todo/todos/ncarrillocofr',

    createUser: async () => {
        try {
            await fetch(TodoService.USER_URL, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({})
            });
        } catch (error) {
            console.log(error);
        }
    },

    getTasks: async () => {
        try {
            const resp = await fetch(TodoService.API_URL);
            if (resp.status === 404) {
                await TodoService.createUser();
                const retryResp = await fetch(TodoService.API_URL);
                return await retryResp.json();
            }
            return await resp.json();
        } catch (error) {
            console.log(error);
            return { todos: [] };
        }
    },

    addTask: async (taskLabel) => {
        try {
            const resp = await fetch(TodoService.TODOS_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    label: taskLabel, 
                    is_done: false
                })
            });
            return await resp.json();
        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    deleteTask: async (taskId) => {
        try {
            await fetch(`https://playground.4geeks.com/todo/todos/${taskId}`, {
                method: "DELETE"
            });
        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    clearAllTasks: async (tasks) => {
        try {
            const deletePromises = tasks.map(task => 
                fetch(`https://playground.4geeks.com/todo/todos/${task.id}`, {
                    method: "DELETE"
                })
            );
            await Promise.all(deletePromises);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
};

// todo list
const TodoApp = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');

    useEffect(() => {
        const loadTasks = async () => {
            const data = await TodoService.getTasks();
            setTasks(data.todos || []);
        };
        loadTasks();
    }, []);

    const refreshTasks = async () => {
        const data = await TodoService.getTasks();
        setTasks(data.todos || []);
    };

    const addTask = async (event) => {
        if (event.key === 'Enter' && newTask.trim()) {
            try {
                await TodoService.addTask(newTask.trim());
                await refreshTasks();
                setNewTask('');
            } catch (error) {
                console.log('Error adding task');
            }
        }
    };

    const deleteTask = async (taskId) => {
        try {
            await TodoService.deleteTask(taskId);
            await refreshTasks();
        } catch (error) {
            console.log('Error deleting task');
        }
    };

    const clearAllTasks = async () => {
        try {
            await TodoService.clearAllTasks(tasks);
            await refreshTasks();
        } catch (error) {
            console.log('Error clearing tasks');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="bg-light p-4 rounded shadow">
                        <div className="text-center mb-4">
                            <h1 className="text-muted display-1 fw-light">todos</h1>
                        </div>
                        
                        <input
                            type="text"
                            className="form-control form-control-lg border-0 shadow-none"
                            placeholder="What needs to be done?"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            onKeyDown={addTask}
                            style={{backgroundColor: 'white', fontSize: '1.2rem', padding: '15px'}}
                        />

                        <div className="mt-3">
                            {tasks.length === 0 ? (
                                <p className="text-center text-muted py-4">No hay tareas, añadir tareas</p>
                            ) : (
                                tasks.map((task, index) => (
                                    <div
                                        key={task.id || index}
                                        className="d-flex justify-content-between align-items-center py-3 px-3 border-bottom task-item"
                                        onMouseEnter={(e) => e.target.querySelector('.delete-btn').style.opacity = '1'}
                                        onMouseLeave={(e) => e.target.querySelector('.delete-btn').style.opacity = '0'}
                                    >
                                        <span className="fs-5 text-muted">{task.label}</span>
                                        <button
                                            className="btn btn-link text-danger p-0 delete-btn"
                                            onClick={() => deleteTask(task.id)}
                                            style={{opacity: '0', transition: 'opacity 0.2s', fontSize: '1.5rem'}}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                        
                        {tasks.length > 0 && (
                            <div className="text-center mt-3">
                                <button 
                                    className="btn btn-link text-muted p-0"
                                    onClick={clearAllTasks}
                                    style={{fontSize: '0.9rem'}}
                                >
                                    Clear all tasks
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TodoApp;