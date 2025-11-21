import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Container, Title, TextInput, NumberInput, Select, Button, Stack, Paper } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useNavigate } from 'react-router-dom';

const AddExpensePage = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date());
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      if (auth.currentUser) {
        const uid = auth.currentUser.uid;
        const q = query(collection(db, 'categories'), where('uid', '==', uid));
        const querySnapshot = await getDocs(q);
        const categoriesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCategories(categoriesData);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (auth.currentUser) {
      const uid = auth.currentUser.uid;
      await addDoc(collection(db, 'transactions'), {
        uid,
        type: 'expense',
        description,
        amount: parseFloat(amount),
        category,
        date,
      });
      navigate('/dashboard');
    }
  };

  return (
    <Container size="sm" my="md">
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Title order={2} mb="lg">Add New Expense</Title>
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              label="Description"
              placeholder="Enter expense description"
              value={description}
              onChange={(event) => setDescription(event.currentTarget.value)}
              required
            />
            <NumberInput
              label="Amount"
              placeholder="Enter amount"
              value={amount}
              onChange={setAmount}
              min={0}
              step={0.01}
              precision={2}
              required
            />
            <Select
              label="Category"
              placeholder="Select a category"
              value={category}
              onChange={setCategory}
              data={categories.map(cat => ({ value: cat.name, label: cat.name }))}
              required
            />
            <DatePicker
              label="Date"
              placeholder="Select date"
              value={date}
              onChange={setDate}
              required
            />
            <Button type="submit" mt="md">
              Add Expense
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default AddExpensePage;
