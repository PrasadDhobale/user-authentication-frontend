import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/admin/users');
        setUsers(response.data);
        // Process data for chart
        const data = response.data.reduce((acc, user) => {
          const month = new Date(user.lastLoginDate).toLocaleString('default', { month: 'short' });
          acc[month] = (acc[month] || 0) + 1;
          return acc;
        }, {});
        setChartData({
          labels: Object.keys(data),
          datasets: [{
            label: 'User Count by Month',
            data: Object.values(data),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Count</th>
            <th>Gender</th>
            <th>Last Login Date</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.count}</td>
              <td>{user.gender}</td>
              <td>{new Date(user.lastLoginDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
