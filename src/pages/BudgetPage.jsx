import React, { useState, useEffect } from 'react';
import { doc, setDoc, getDoc, collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Container, Title, Paper, NumberInput, Button, Group, Text, Progress, Stack } from '@mantine/core';

const BudgetPage = () => {
  const [budget, setBudget] = useState(0);
  const [currentBudget, setCurrentBudget] = useState(0);
  const [spending, setSpending] = useState(0);

  useEffect(() => {
    const fetchBudgetData = async () => {
      if (auth.currentUser) {
        const uid = auth.currentUser.uid;
        const budgetRef = doc(db, 'budgets', uid);

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
          where('date', '>=', Timestamp.fromDate(startOfMonth)),
          where('date', '<=', Timestamp.fromDate(endOfMonth))
        );
        const querySnapshot = await getDocs(expensesQuery);
        const totalSpending = querySnapshot.docs.reduce((acc, doc) => acc + doc.data().amount, 0);
        setSpending(totalSpending);
      }
    };

    fetchBudgetData();
  }, []);

  const handleSetBudget = async (e) => {
    e.preventDefault();
    if (auth.currentUser && budget > 0) {
        const uid = auth.currentUser.uid;
        const budgetRef = doc(db, 'budgets', uid);
        await setDoc(budgetRef, { amount: parseFloat(budget) });
        setCurrentBudget(parseFloat(budget));
        setBudget(0);
    }
  };

  const progress = currentBudget > 0 ? (spending / currentBudget) * 100 : 0;
  const progressColor = progress > 100 ? 'red' : progress > 75 ? 'yellow' : 'green';

  return (
    <Container size="sm" my="md">
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Title order={2} mb="lg">Monthly Budget</Title>
        <form onSubmit={handleSetBudget}>
          <Group align="end">
            <NumberInput
              label="Set Monthly Budget"
              value={budget}
              onChange={setBudget}
              min={0}
              step={50}
              precision={2}
              style={{ flex: 1 }}
            />
            <Button type="submit">Set Budget</Button>
          </Group>
        </form>

        <Paper withBorder p="md" mt="xl" radius="md">
          <Stack spacing="sm">
            <Group position="apart">
                <Text weight={500}>Current Budget:</Text>
                <Text weight={700} size="lg">${currentBudget.toFixed(2)}</Text>
            </Group>
            <Group position="apart">
                <Text weight={500}>Current Spending:</Text>
                <Text weight={700} size="lg" color={progressColor}>${spending.toFixed(2)}</Text>
            </Group>
            <Progress value={progress} color={progressColor} size="lg" radius="xl" mt="sm" />
            <Text align="center" size="sm" color="dimmed">{progress.toFixed(0)}% of budget spent</Text>
          </Stack>
        </Paper>
      </Paper>
    </Container>
  );
};

export default BudgetPage;
