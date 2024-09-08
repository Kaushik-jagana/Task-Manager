import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import api from '../api/api'; 
import TaskModal from './TaskModal';
import '../styles/TaskDashboard.css';  
import { useNavigate } from 'react-router-dom';
import TaskDetailsModal from './TaskDetailsModal';

const reorderTasks = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

function TasksDashboard() {
    const [tasks, setTasks] = useState({
        todo: [],
        inProgress: [],
        done: [],
    });
    const [showModal, setShowModal] = useState(false);
    const [showTask, setShowTask] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [filteredTasks, setFilteredTasks] = useState(tasks);
    const [sortOrder, setSortOrder] = useState('Recent');  // Sorting state
    const [searchQuery, setSearchQuery] = useState('');  // Search query state
    const navigate = useNavigate();

    // Handle token from URL query params (Google OAuth)
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const token = queryParams.get('token');

        if (token) {
            localStorage.setItem('token', token);
            navigate('/tasks', { replace: true });
        }
    }, [navigate]);

    // Fetch tasks from the server
    const fetchTasks = async () => {
        try {
            const res = await api.get('/api/tasks');
            const fetchedTasks = res.data;
            setTasks({
                todo: fetchedTasks.filter((task) => task.status === 'TODO'),
                inProgress: fetchedTasks.filter((task) => task.status === 'INPROGRESS'),
                done: fetchedTasks.filter((task) => task.status === 'DONE'),
            });
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // Sorting logic based on createdAt
    const handleSort = (tasks) => {
        const sortedTasks = { ...tasks };
        const sortOrderMultiplier = sortOrder === 'Recent' ? -1 : 1;

        for (let column in sortedTasks) {
            sortedTasks[column] = sortedTasks[column].sort((a, b) => {
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);
                return (dateA - dateB) * sortOrderMultiplier;  // Sorting by date
            });
        }

        return sortedTasks;
    };

    // Search logic based on task title
    const handleSearch = (tasks) => {
        if (!searchQuery.trim()) return tasks;

        const filteredTasks = { ...tasks };
        for (let column in filteredTasks) {
            filteredTasks[column] = filteredTasks[column].filter((task) =>
                task.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return filteredTasks;
    };

    // Update the tasks list whenever sorting or search changes
    useEffect(() => {
        let updatedTasks = handleSort(tasks);
        updatedTasks = handleSearch(updatedTasks);
        setFilteredTasks(updatedTasks);
    }, [tasks, sortOrder, searchQuery]);

    // Drag and drop logic
    const onDragEnd = async (result) => {
        const { source, destination } = result;

        if (!destination) return;

        const sourceColumn = tasks[source.droppableId];
        const destinationColumn = tasks[destination.droppableId];

        if (source.droppableId === destination.droppableId) {
            const reorderedTasks = reorderTasks(sourceColumn, source.index, destination.index);
            setTasks((prevTasks) => ({
                ...prevTasks,
                [source.droppableId]: reorderedTasks,
            }));
        } else {
            const sourceTasks = Array.from(sourceColumn);
            const destinationTasks = Array.from(destinationColumn);
            const [movedTask] = sourceTasks.splice(source.index, 1);
            destinationTasks.splice(destination.index, 0, movedTask);

            setTasks((prevTasks) => ({
                ...prevTasks,
                [source.droppableId]: sourceTasks,
                [destination.droppableId]: destinationTasks,
            }));
            await api.put(`/api/tasks/${movedTask._id}`, {
                status: destination.droppableId.toUpperCase(),
            });
        }
    };

    // View task details
    const handleViewDetails = (task) => {
        setSelectedTask(task);  
        setShowTask(true);  
    };

    const handleCloseModal = () => {
        setSelectedTask(null);  
        setShowTask(false); 
    };

    // Save task (create or edit)
    const handleSaveTask = async (taskData) => {
        try {
            if (taskToEdit) {
                await api.put(`/api/tasks/${taskToEdit._id}`, taskData);
            } else {
                await api.post('/api/tasks', taskData);
            }

            setTaskToEdit(null);
            setShowModal(false);
            fetchTasks();  
        } catch (err) {
            console.error('Error saving task:', err);
            alert('Error saving task. Please try again.');
        }
    };

    // Edit task
    const handleEditTask = (task) => {
        setTaskToEdit(task);
        setShowModal(true);
    };

    // Delete task
    const deleteTask = async (id) => {
        try {
            await api.delete(`/api/tasks/${id}`);
            fetchTasks();  // Re-fetch tasks after deletion
        } catch (err) {
            console.error(err);
        }
    };

    // Define columns
    const columns = [
        { id: 'todo', title: 'TODO' },
        { id: 'inProgress', title: 'IN PROGRESS' },
        { id: 'done', title: 'DONE' },
    ];

    return (
        <div className="tasks-dashboard">
            <header>
                <button onClick={() => setShowModal(true)} className="add-task-btn">Add Task</button>
            </header>

            <div className="task-filters">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}  // Update search query
                />
                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}  // Update sort order
                >
                    <option value="Recent">Sort by: Recent</option>
                    <option value="Oldest">Sort by: Oldest</option>
                </select>
            </div>

            <TaskModal
                show={showModal}
                onClose={() => { setShowModal(false); setTaskToEdit(null); }}
                onSave={handleSaveTask}
                taskToEdit={taskToEdit}
            />

            {showTask && (
                <TaskDetailsModal task={selectedTask} onClose={handleCloseModal} />
            )}

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="task-columns">
                    {columns.map((column) => (
                        <Droppable key={column.id} droppableId={column.id}>
                            {(provided) => (
                                <div
                                    className="task-column"
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    <h3>{column.title}</h3>
                                    {filteredTasks[column.id]?.map((task, index) => (
                                        <Draggable
                                            key={task._id}
                                            draggableId={task._id}
                                            index={index}
                                        >
                                            {(provided) => (
                                                <div
                                                    className="task-card"
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <h4>{task.title}</h4>
                                                    <p>{task.description}</p>
                                                    <p>Created at: {new Date(task.createdAt).toLocaleString()}</p>
                                                    <div className="task-actions">
                                                        <button className="edit-btn" onClick={() => handleEditTask(task)}>Edit</button>
                                                        <button
                                                            className="delete-btn"
                                                            onClick={() => deleteTask(task._id)}
                                                        >
                                                            Delete
                                                        </button>
                                                        <button className="details-btn" onClick={() => handleViewDetails(task)}>View Details</button>
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
}

export default TasksDashboard;
