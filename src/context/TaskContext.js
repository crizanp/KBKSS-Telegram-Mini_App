// src/context/TaskContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const TaskContext = createContext();

export const useTasks = () => {
  return useContext(TaskContext);
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState({ special: [], daily: [], lists: [], extra: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/igh-airdrop-tasks`);
        const data = response.data;

        const categorizedTasks = {
          special: data.filter((task) => task.category === 'Special'),
          daily: data.filter((task) => task.category === 'Daily'),
          lists: data.filter((task) => task.category === 'Lists'),
          extra: data.filter((task) => task.category === 'Extra'),
        };

        setTasks(categorizedTasks);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
    <TaskContext.Provider value={{ tasks, loading, error }}>
      {children}
    </TaskContext.Provider>
  );
};
