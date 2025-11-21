import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Container, Typography, Box, Paper, Grid } from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import TransactionList from '../components/TransactionList';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardPage = () => {
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser) {
        const uid = auth.currentUser.uid;

        const transactionsQuery = query(collection(db, 'transactions'), where('uid', '==', uid));
        const transactionsSnapshot = await getDocs(transactionsQuery);
        const transactionsData = transactionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTransactions(transactionsData);

        const incomeTotal = transactionsData
          .filter(t => t.type === 'income')
          .reduce((acc, t) => acc + t.amount, 0);
        setIncome(incomeTotal);

        const expensesTotal = transactionsData
          .filter(t => t.type === 'expense')
          .reduce((acc, t) => acc + t.amount, 0);
        setExpenses(expensesTotal);
      }
    };

    fetchData();
  }, []);

  const balance = income - expenses;

  const chartData = {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        label: 'Amount',
        data: [income, expenses],
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            <AttachMoneyIcon color="success" sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography variant="h6" color="text.secondary">
                Total Income
              </Typography>
              <Typography variant="h4">
                ${income.toFixed(2)}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            <MoneyOffIcon color="error" sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography variant="h6" color="text.secondary">
                Total Expenses
              </Typography>
              <Typography variant="h4">
                ${expenses.toFixed(2)}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            <AccountBalanceWalletIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography variant="h6" color="text.secondary">
                Balance
              </Typography>
              <Typography variant="h4" sx={{ color: balance >= 0 ? 'green' : 'red' }}>
                ${balance.toFixed(2)}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Recent Transactions
            </Typography>
            <TransactionList transactions={transactions.slice(0, 5)} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Income vs. Expenses
            </Typography>
            <Doughnut data={chartData} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;
