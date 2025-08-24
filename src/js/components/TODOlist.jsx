import React, { useState } from 'react';

const TodoApp = () => {
    const [tasks, setTasks] = useState([
        "Wash my hands",
        "Make the bed", 
        "Brush my teeth",
        "Eat breakfast",
        "Walk the dog"
    ]);
    const [newTask, setNewTask] = useState('');

    const addTask = (task) => {
        if (task.key === 'Enter' && newTask.trim()) {
            setTasks([...tasks, newTask.trim()]);
            setNewTask('');
        }
    };

    const deleteTask = (index) => {
        setTasks(tasks.filter((_, i) => i !== index));
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
                            onChange={(task) => setNewTask(task.target.value)}
                            onKeyDown={addTask}
                            style={{backgroundColor: 'white', fontSize: '1.2rem', padding: '15px'}}
                        />

                        <div className="mt-3">
                            {tasks.length === 0 ? (
                                <p className="text-center text-muted py-4">No hay tareas, añadir tareas</p>
                            ) : (
                                tasks.map((task, index) => (
                                    <div
                                        key={index}
                                        className="d-flex justify-content-between align-items-center py-3 px-3 border-bottom task-item"
                                        onMouseEnter={(task) => task.target.querySelector('.delete-btn').style.opacity = '1'}
                                        onMouseLeave={(task) => task.target.querySelector('.delete-btn').style.opacity = '0'}
                                    >
                                        <span className="fs-5 text-muted">{task}</span>
                                        <button
                                            className="btn btn-link text-danger p-0 delete-btn"
                                            onClick={() => deleteTask(index)}
                                            style={{opacity: '0', transition: 'opacity 0.2s', fontSize: '1.5rem'}}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TodoApp;