'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Check, Trash2, Loader2, Circle } from 'lucide-react';
import { useUser, useFirestore } from '@/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, doc, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { cn } from '@/lib/utils';

interface Task {
    id: string;
    content: string;
    completed: boolean;
}

export function QuickTasks() {
    const { user } = useUser();
    const firestore = useFirestore();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        if (!user || !firestore) return;

        const q = query(collection(firestore, `users/${user.uid}/tasks`), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const t = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
            setTasks(t);
        });
        return () => unsubscribe();
    }, [user, firestore]);

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTask.trim() || !user || !firestore) return;

        setIsAdding(true);
        try {
            await addDoc(collection(firestore, `users/${user.uid}/tasks`), {
                content: newTask,
                completed: false,
                createdAt: serverTimestamp()
            });
            setNewTask('');
        } catch (e) { console.error(e) }
        finally { setIsAdding(false); }
    };

    const toggleTask = async (task: Task) => {
        if (!user || !firestore) return;
        await updateDoc(doc(firestore, `users/${user.uid}/tasks/${task.id}`), {
            completed: !task.completed
        });
    };

    const deleteTask = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user || !firestore) return;
        await deleteDoc(doc(firestore, `users/${user.uid}/tasks/${id}`));
    };

    const activeCount = tasks.filter(t => !t.completed).length;

    return (
        <div className="bg-[#18181b] border border-white/5 rounded-2xl p-6 flex flex-col min-h-[350px]">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-white font-serif">Quick Tasks</h3>
                <p className="text-xs text-gray-500">Manage your daily editorial checklist.</p>
            </div>

            {/* Filter Tabs Mock */}
            <div className="flex bg-black/20 p-1 rounded-lg mb-4">
                <button className="flex-1 py-1.5 text-xs font-medium text-white bg-white/10 rounded-md shadow-sm">Active ({activeCount})</button>
                <button className="flex-1 py-1.5 text-xs font-medium text-gray-500 hover:text-white transition-colors">Completed ({tasks.length - activeCount})</button>
            </div>

            <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Add a quick task..."
                    className="flex-1 bg-black/20 border border-white/5 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-primary/50 placeholder:text-gray-600 transition-colors"
                />
                <button
                    type="submit"
                    disabled={isAdding}
                    className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                    {isAdding ? <Loader2 size={16} className="animate-spin" /> : <Plus size={18} />}
                </button>
            </form>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {tasks.length === 0 && <p className="text-xs text-gray-600 text-center py-8">No active tasks</p>}

                {tasks.map((task) => (
                    <div
                        key={task.id}
                        onClick={() => toggleTask(task)}
                        className={cn(
                            "flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer group",
                            task.completed ? "bg-black/10 border-transparent opacity-50" : "bg-white/5 border-white/5 hover:border-primary/30"
                        )}
                    >
                        <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors", task.completed ? "border-green-500 bg-green-500/10 text-green-500" : "border-gray-600 text-transparent")}>
                            <Check size={10} />
                        </div>
                        <span className={cn("flex-1 text-sm truncate", task.completed ? "text-gray-500 line-through" : "text-gray-200")}>{task.content}</span>
                        <button
                            onClick={(e) => deleteTask(task.id, e)}
                            className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all transform scale-90 hover:scale-110"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
