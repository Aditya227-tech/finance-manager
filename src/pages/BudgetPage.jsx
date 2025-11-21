import React, { useState, useEffect } from 'react';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Container, Typography, Box, TextField, Button, Paper, LinearProgress } from '@mui/material';

const BudgetPage = () => {
  const [budget, setBudget] = useState('');
  const [currentBudget, setCurrentBudget] = useState(0);
  const [spending, setSpending] = useState(0);

  const uid = auth.currentUser.uid;
  const budgetRef = doc(db, 'budgets', uid);

  const fetchBudgetData = async () => {
    // Fetch budget
    const docSnap = await getDoc(budgetRef);
    if (docSnap.exists()) {
      setCurrentBudget(docSnap.data().amount);
    }

    // Fetch spending
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const expensesQuery = query(
      collection(db, 'transactions'),
      where('uid', '==', uid),
      where('type', '==', 'expense'),
      where('date', '>=', startOfMonth),
      where('date', '<=', endOfMonth)
    );
    const querySnapshot = await getDocs(expensesQuery);
    const totalSpending = querySnapshot.docs.reduce((acc, doc) => acc + doc.data().amount, 0);
    setSpending(totalSpending);
  };

  useEffect(() => {
    if (uid) {
      fetchBudgetData();
    }
  }, [uid]);

  const handleSetBudget = async (e) => {
    e.preventDefault();
    await setDoc(budgetRef, { amount: parseFloat(budget) });
    setCurrentBudget(parseFloat(budget));
    setBudget('');
  };

  const progress = currentBudget > 0 ? (spending / currentBudget) * 100 : 0;

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Budget
        </Typography>
        <form onSubmit={handleSetBudget}>
          <TextField
            label="Set Monthly Budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            type="number"
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Set Budget
          </Button>
        </form>
        <Paper sx={{ p: 2, mt: 4 }}>
          <Typography variant="h6">Current Budget: ${currentBudget.toFixed(2)}</Typography>
          <Typography variant="h6">Current Spending: ${spending.toFixed(2)}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Box sx={{ width: '100%', mr: 1 }}>
              <LinearProgress variant="determinate" value={progress > 100 ? 100 : progress} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
              <Typography variant="body2" color="text.secondary">{`${Math.round(progress)}%`}</Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default BudgetPage;
