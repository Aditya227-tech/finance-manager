import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Container, Typography, Paper, Grid } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const ReportsPage = () => {
  const [barChartData, setBarChartData] = useState(null);
  const [lineChartData, setLineChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser) {
        const uid = auth.currentUser.uid;

        // Fetch categories
        const categoriesQuery = query(collection(db, 'categories'), where('uid', '==', uid));
        const categoriesSnapshot = await getDocs(categoriesQuery);
        const categories = {};
        categoriesSnapshot.forEach(doc => {
          categories[doc.id] = doc.data().name;
        });

        // Fetch all transactions
        const transactionsQuery = query(collection(db, 'transactions'), where('uid', '==', uid));
        const transactionsSnapshot = await getDocs(transactionsQuery);
        const transactions = transactionsSnapshot.docs.map(doc => doc.data());

        // Process data for bar chart (Expenses by Category)
        const expensesByCategory = {};
        transactions
          .filter(t => t.type === 'expense')
          .forEach(t => {
            const categoryName = categories[t.category] || 'Uncategorized';
            if (expensesByCategory[categoryName]) {
              expensesByCategory[categoryName] += t.amount;
            } else {
              expensesByCategory[categoryName] = t.amount;
            }
          });

        setBarChartData({
          labels: Object.keys(expensesByCategory),
          datasets: [
            {
              label: 'Expenses by Category',
              data: Object.values(expensesByCategory),
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
          ],
        });

        // Process data for line chart (Income vs. Expenses over time)
        const monthlyData = {};
        transactions.forEach(t => {
          const month = new Date(t.date.seconds * 1000).toLocaleString('default', { month: 'long' });
          if (!monthlyData[month]) {
            monthlyData[month] = { income: 0, expense: 0 };
          }
          monthlyData[month][t.type] += t.amount;
        });

        const lineLabels = Object.keys(monthlyData);
        setLineChartData({
          labels: lineLabels,
          datasets: [
            {
              label: 'Income',
              data: lineLabels.map(m => monthlyData[m].income),
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
            },
            {
              label: 'Expenses',
              data: lineLabels.map(m => monthlyData[m].expense),
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
          ],
        });
      }
    };

    fetchData();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Reports
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            {barChartData ? (
              <Bar
                data={barChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Expenses by Category' },
                  },
                }}
              />
            ) : (
              <Typography>Loading...</Typography>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            {lineChartData ? (
              <Line
                data={lineChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Income vs. Expenses Over Time' },
                  },
                }}
              />
            ) : (
              <Typography>Loading...</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ReportsPage;
