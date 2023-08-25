import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function GraphicalAnalysis() {
    const [tasks, setTasks] = useState([]);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            const res = await fetch("http://localhost:8080/Task", {
                method: "GET",
                credentials: "include",
            });
    
            if (res.status === 200) {
                const data = await res.json();
                console.log("received data");
                console.log(data);
                setTasks(data.tasks);
            } else {
                setTasks([]);
            }
        };
        fetchTasks();
    }, []);

    useEffect(() => {
        const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
        const fourWeeksAgo = new Date(new Date().getTime() - 4 * oneWeekInMilliseconds);

        const filteredTasks = tasks.filter(task => new Date(task.due_date) >= fourWeeksAgo);

        // Initialize counts for the last 4 weeks to 0
        const counts = [0, 0, 0, 0];

        filteredTasks.forEach(task => {
            const weekIndex = Math.floor((new Date(task.due_date) - fourWeeksAgo) / oneWeekInMilliseconds);
            counts[weekIndex]++;
        });

        setChartData([
            { name: 'Week 1', Completed: counts[0] },
            { name: 'Week 2', Completed: counts[1] },
            { name: 'Week 3', Completed: counts[2] },
            { name: 'Week 4', Completed: counts[3] },
        ]);
    }, [tasks]);

    return (
        <div>
            <BarChart
                width={600}
                height={300}
                data={chartData}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Completed" fill="#8884d8" />
            </BarChart>
        </div>
    );
}

export default GraphicalAnalysis;
