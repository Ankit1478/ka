'use client'

import { useState } from 'react';

export default function Home() {
  const [todo, setTodo] = useState<{ userId: number; id: number; title: string; completed: boolean } | null>(null);
  const [todoId, setTodoId] = useState(1);

  const fetchTodo = async (id: number) => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch TODO');
      }
      const data = await response.json();
      setTodo(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClick = () => {
    const newId = todoId + 1;
    setTodoId(newId);
    fetchTodo(newId);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Fetch TODO</h1>
      <button 
        onClick={handleClick} 
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-300"
      >
        Get New TODO
      </button>
      {todo && (
        <div className="mt-6 p-4 bg-white rounded shadow-md">
          <h2 className="text-xl font-semibold mb-2">TODO Details</h2>
          <p><strong>ID:</strong> {todo.id}</p>
          <p><strong>Title:</strong> {todo.title}</p>
          <p><strong>Completed:</strong> {todo.completed ? 'Yes' : 'No'}</p>
        </div>
      )}
    </div>
  );
}
