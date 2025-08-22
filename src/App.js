import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseclient";

export default function App() {
const [tasks, setTasks] = useState([]);
const [newTask, setNewTask] = useState("");
const [columnId, setColumnId] = useState("new");
const [loading, setLoading] = useState(false);
const [draggedTask, setDraggedTask] = useState(null);

const columnStyles = {
    new: { header: "bg-gradient-to-r from-blue-600 to-blue-400", border: "border-blue-400" },
    inProgress: { header: "bg-gradient-to-r from-yellow-600 to-yellow-400", border: "border-yellow-400" },
    completed: { header: "bg-gradient-to-r from-green-600 to-green-400", border: "border-green-400" },
};

// Fetch tasks on page load
useEffect(() => {
    const loadTasks = async () => {
     setLoading(true);
     const { data, error } = await supabase.from("tasks").select("*");
     if (error) console.error("❌ fetch error:", error.message);
     else setTasks(data);
     setLoading(false);
    };
    loadTasks();
}, []);

// Add task
const addTask = async () => {
    if (!newTask.trim()) return;

    const { data, error } = await supabase
     .from("tasks")
     .insert([{ title: newTask, column_id: columnId }])
     .select();

    if (error) {
     console.error("❌ insert error:", error.message);
     return;
    }

    setTasks((prev) => [...prev, data[0]]);
    setNewTask("");
};

// Delete task
const deleteTask = async (id) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) console.error("❌ delete error:", error.message);
    else setTasks((prev) => prev.filter((t) => t.id !== id));
};

// Update task column when dropped
const moveTask = async (task, newColumnId) => {
    if (task.column_id === newColumnId) return;

    const { error } = await supabase
     .from("tasks")
     .update({ column_id: newColumnId })
     .eq("id", task.id);

    if (error) {
     console.error("❌ update error:", error.message);
     return;
    }

    setTasks((prev) =>
     prev.map((t) => (t.id === task.id ? { ...t, column_id: newColumnId } : t))
    );
};

// Group tasks by column
const columns = {
    new: { name: "New", items: tasks.filter((t) => t.column_id === "new") },
    inProgress: { name: "In Progress", items: tasks.filter((t) => t.column_id === "inProgress") },
    completed: { name: "Completed", items: tasks.filter((t) => t.column_id === "completed") },
};

return (
    <div className="p-6 w-full min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-800 text-white">
     <h1 className="text-3xl font-bold mb-6 text-center">✅Kanban-Board</h1>

     {/* Add Task Form */}
     <div className="flex gap-2 mb-6 justify-center">
        <input
         className="px-3 py-2 rounded text-black"
         value={newTask}
         onChange={(e) => setNewTask(e.target.value)}
         placeholder="Task title"
        />
        <select
         className="px-3 py-2 rounded text-black"
         value={columnId}
         onChange={(e) => setColumnId(e.target.value)}
        >
         <option value="new">New</option>
         <option value="inProgress">In Progress</option>
         <option value="completed">Completed</option>
        </select>
        <button onClick={addTask} className="bg-blue-600 px-4 py-2 rounded">
         Add
        </button>
     </div>

     {/* Columns */}
     {loading ? (
        <p className="text-center">Loading…</p>
     ) : (
        <div className="grid grid-cols-3 gap-6">
         {Object.entries(columns).map(([colId, col]) => (
            <div
             key={colId}
             className={`p-4 rounded-lg shadow-md border ${columnStyles[colId].border}`}
             onDragOver={(e) => e.preventDefault()}
             onDrop={() => draggedTask && moveTask(draggedTask, colId)}
            >
             <h2 className={`text-xl font-semibold mb-4 p-2 rounded ${columnStyles[colId].header}`}>
                {col.name}
             </h2>

             {col.items.length === 0 ? (
                <p className="opacity-60 text-sm">No tasks</p>
             ) : (
                col.items.map((item) => (
                 <div
                    key={item.id}
                    draggable
                    onDragStart={() => setDraggedTask(item)}
                    className="flex justify-between items-center bg-zinc-700 px-3 py-2 mb-2 rounded"
                 >
                    <span>{item.title}</span>
                    <button
                     onClick={() => deleteTask(item.id)}
                     className="text-red-400 hover:text-red-600"
                    >
                     ✕
                    </button>
                 </div>
                ))
             )}
            </div>
         ))}
        </div>
     )}
    </div>
);
}