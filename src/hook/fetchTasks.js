import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchTasks = () => {
  const [tasks, setTasks] = useState({ special: [], daily: [], lists: [], extra: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/igh-airdrop-tasks`);
        const data = response.data;

        // Categorize tasks based on their types
        const categorizedTasks = {
          special: data.filter((task) => task.category === 'Special'),
          daily: data.filter((task) => task.category === 'Daily'),
          lists: data.filter((task) => task.category === 'Lists'),
          extra: data.filter((task) => task.category === 'Extra'),
        };

        setTasks(categorizedTasks);
      } catch (error) {
        setError(error);
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return { tasks, loading, error };
};

export default useFetchTasks;
