import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Container, Typography, Box, TextField, Button, List, ListItem, ListItemText } from '@mui/material';

const CategoriesPage = () => {
  const [categoryName, setCategoryName] = useState('');
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    if (auth.currentUser) {
      const uid = auth.currentUser.uid;
      const q = query(collection(db, 'categories'), where('uid', '==', uid));
      const querySnapshot = await getDocs(q);
      const categoriesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCategories(categoriesData);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (auth.currentUser) {
      const uid = auth.currentUser.uid;
      await addDoc(collection(db, 'categories'), {
        uid,
        name: categoryName,
      });
      setCategoryName('');
      fetchCategories();
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Categories
        </Typography>
        <form onSubmit={handleAddCategory}>
          <TextField
            label="New Category"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Add Category
          </Button>
        </form>
        <List sx={{ mt: 4 }}>
          {categories.map((cat) => (
            <ListItem key={cat.id}>
              <ListItemText primary={cat.name} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default CategoriesPage;
