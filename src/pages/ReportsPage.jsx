import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Container, Title, Paper, Grid, Text, Center, SegmentedControl, Group } from '@mantine/core';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { RingProgress } from '@mantine/core';


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Tooltip,
    Legend
);

const ReportsPage = () => {
  const [barChartData, setBarChartData] = useState(null);
  const [lineChartData, setLineChartData] = useState(null);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [timeRange, setTimeRange] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser) {
        const uid = auth.currentUser.uid;
        let transactionsQuery = query(collection(db, 'transactions'), where('uid', '==', uid));

        // Date filtering
        const now = new Date();
        let startDate;
        if (timeRange === '7d') {
            startDate = new Date(now.setDate(now.getDate() - 7));
        } else if (timeRange === '30d') {
            startDate = new Date(now.setMonth(now.getMonth() - 1));
        } else if (timeRange === '1y') {
            startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        }

        if(startDate) {
            transactionsQuery = query(transactionsQuery, where('date', '>=', startDate));
        }

        const transactionsSnapshot = await getDocs(transactionsQuery);
        const transactions = transactionsSnapshot.docs.map(doc => doc.data());

        let income = 0;
        let expenses = 0;
        const expensesByCategory = {};
        const monthlyData = {};

        transactions.forEach(t => {
            const date = new Date(t.date.seconds * 1000);
            const month = date.toLocaleString('default', { month: 'short', year: '2-digit' });

            if (t.type === 'income') {
                income += t.amount;
                if (!monthlyData[month]) monthlyData[month] = { income: 0, expense: 0 };
                monthlyData[month].income += t.amount;
            } else if (t.type === 'expense') {
                expenses += t.amount;
                if (!monthlyData[month]) monthlyData[month] = { income: 0, expense: 0 };
                monthlyData[month].expense += t.amount;

                if (expensesByCategory[t.category]) {
                    expensesByCategory[t.category] += t.amount;
                } else {
                    expensesByCategory[t.category] = t.amount;
                }
            }
        });

        setTotalIncome(income);
        setTotalExpenses(expenses);

        if(Object.keys(expensesByCategory).length > 0) {
            setBarChartData({
                labels: Object.keys(expensesByCategory),
                datasets: [{
                    label: 'Expenses by Category',
                    data: Object.values(expensesByCategory),
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                }],
            });
        } else {
            setBarChartData(null);
        }

        if(Object.keys(monthlyData).length > 0) {
            const lineLabels = Object.keys(monthlyData).sort((a,b) => new Date(a) - new Date(b));
            setLineChartData({
                labels: lineLabels,
                datasets: [
                    { label: 'Income', data: lineLabels.map(m => monthlyData[m].income), borderColor: 'rgb(75, 192, 192)', backgroundColor: 'rgba(75, 192, 192, 0.5)' },
                    { label: 'Expenses', data: lineLabels.map(m => monthlyData[m].expense), borderColor: 'rgb(255, 99, 132)', backgroundColor: 'rgba(255, 99, 132, 0.5)' },
                ],
            });
        } else {
            setLineChartData(null);
        }
      }
    };

    fetchData();
  }, [timeRange]);

  const totalBalance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (totalBalance / totalIncome) * 100 : 0;

  return (
    <Container my="md" size="lg">
      <Group position="apart" mb="lg">
        <Title order={2}>Financial Reports</Title>
        <SegmentedControl
            value={timeRange}
            onChange={setTimeRange}
            data= {[
                { label: 'All Time', value: 'all' },
                { label: 'Last 7 Days', value: '7d' },
                { label: 'Last 30 Days', value: '30d' },
                { label: 'Last Year', value: '1y' },
            ]}
        />
      </Group>
      <Grid>
        <Grid.Col md={4}>
          <Paper withBorder p="md" radius="md" style={{ height: '100%' }}>
            <Title order={4}>Savings Rate</Title>
            <Center style={{height: 200}}>
                <RingProgress
                size={180}
                thickness={18}
                roundCaps
                sections={[{ value: savingsRate, color: 'teal' }]}
                label={
                    <Text color="teal" weight={700} align="center" size="xl">
                    {savingsRate.toFixed(1)}%
                    </Text>
                }
                />
            </Center>
             <Text align="center" size="lg" weight={500} mt="md">Total Balance: ${totalBalance.toFixed(2)}</Text>
          </Paper>
        </Grid.Col>
        <Grid.Col md={8}>
          <Paper withBorder p="md" radius="md">
            {lineChartData ? (
                <Line
                    data={lineChartData}
                    options={{ responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Income vs. Expenses Over Time' } } }}
                />
            ) : (
                <Center style={{height: 250}}><Text>No data available for the selected period.</Text></Center>
            )}
          </Paper>
        </Grid.Col>
        <Grid.Col span={12}>
          <Paper withBorder p="md" radius="md" mt="md">
            {barChartData ? (
              <Bar
                data={barChartData}
                options={{ responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Expenses by Category' } } }}
              />
            ) : (
                <Center style={{height: 250}}><Text>No expense data available for the selected period.</Text></Center>
            )}
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default ReportsPage;
