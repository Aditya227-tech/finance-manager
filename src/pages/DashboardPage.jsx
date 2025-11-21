import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { RingProgress, Text, SimpleGrid, Paper, Center, Group } from '@mantine/core';
import { IconArrowUpRight, IconArrowDownRight, IconWallet } from '@tabler/icons-react';
import TransactionList from '../components/TransactionList';

const DashboardPage = () => {
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser) {
        const uid = auth.currentUser.uid;
        setUserName(auth.currentUser.displayName || auth.currentUser.email);
        setLoading(true);

        const transactionsQuery = query(
          collection(db, 'transactions'),
          where('uid', '==', uid),
          orderBy('date', 'desc'),
          limit(5)
        );
        const transactionsSnapshot = await getDocs(transactionsQuery);
        const transactionsData = transactionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const allTransactionsQuery = query(collection(db, 'transactions'), where('uid', '==', uid));
        const allTransactionsSnapshot = await getDocs(allTransactionsQuery);
        const allTransactionsData = allTransactionsSnapshot.docs.map(doc => doc.data());

        const incomeTotal = allTransactionsData
          .filter(t => t.type === 'income')
          .reduce((acc, t) => acc + t.amount, 0);
        setIncome(incomeTotal);

        const expensesTotal = allTransactionsData
          .filter(t => t.type === 'expense')
          .reduce((acc, t) => acc + t.amount, 0);
        setExpenses(expensesTotal);

        setTransactions(transactionsData);
        setLoading(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        fetchData();
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const balance = income - expenses;
  const total = income + expenses;
  const incomePercentage = total ? (income / total) * 100 : 0;
  const expensePercentage = total ? (expenses / total) * 100 : 0;

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <Text size="xl" weight={700} mb="xl">Welcome back, {userName.split(' ')[0]}!</Text>
      <SimpleGrid cols={3} spacing="xl" mb="xl">
        <Paper withBorder p="lg" radius="md">
          <Group>
            <IconWallet size={32} />
            <div>
              <Text color="dimmed" size="xs" transform="uppercase" weight={700}>Balance</Text>
              <Text weight={700} size="xl">${balance.toFixed(2)}</Text>
            </div>
          </Group>
        </Paper>
        <Paper withBorder p="lg" radius="md">
          <Group>
            <IconArrowUpRight size={32} color="teal" />
            <div>
              <Text color="dimmed" size="xs" transform="uppercase" weight={700}>Income</Text>
              <Text weight={700} size="xl" color="teal">${income.toFixed(2)}</Text>
            </div>
          </Group>
        </Paper>
        <Paper withBorder p="lg" radius="md">
          <Group>
            <IconArrowDownRight size={32} color="red" />
            <div>
              <Text color="dimmed" size="xs" transform="uppercase" weight={700}>Expenses</Text>
              <Text weight={700} size="xl" color="red">${expenses.toFixed(2)}</Text>
            </div>
          </Group>
        </Paper>
      </SimpleGrid>

      <SimpleGrid cols={2} spacing="xl">
        <Paper withBorder p="lg" radius="md">
          <Text size="lg" weight={700} mb="md">Income vs. Expenses</Text>
          <Center>
            <RingProgress
              size={200}
              thickness={20}
              roundCaps
              sections={[
                { value: incomePercentage, color: 'teal' },
                { value: expensePercentage, color: 'red' },
              ]}
              label={
                <Text size="xs" align="center">
                  Total<br />
                  <Text weight={700} size="xl">${total.toFixed(2)}</Text>
                </Text>
              }
            />
          </Center>
        </Paper>
        <Paper withBorder p="lg" radius="md">
          <Text size="lg" weight={700} mb="md">Recent Transactions</Text>
          <TransactionList transactions={transactions} />
        </Paper>
      </SimpleGrid>
    </div>
  );
};

export default DashboardPage;
