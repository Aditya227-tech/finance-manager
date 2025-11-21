import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Container, Title, TextInput, Button, Paper, List, ThemeIcon, Group, ActionIcon, Modal, Text } from '@mantine/core';
import { IconCirclePlus, IconPencil, IconTrash, IconTag } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';

const CategoriesPage = () => {
  const [categoryName, setCategoryName] = useState('');
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  
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
  }, [auth.currentUser]);

  const handleAddOrUpdateCategory = async (e) => {
    e.preventDefault();
    if (auth.currentUser && categoryName.trim() !== '') {
        const uid = auth.currentUser.uid;
        if (editingCategory) {
            // Update existing category
            const categoryDoc = doc(db, 'categories', editingCategory.id);
            await updateDoc(categoryDoc, { name: categoryName });
            setEditingCategory(null);
        } else {
            // Add new category
            await addDoc(collection(db, 'categories'), {
                uid,
                name: categoryName,
            });
        }
        setCategoryName('');
        fetchCategories();
    }
  };

  const handleDeleteCategory = async () => {
    if (deleteCandidate) {
        const categoryDoc = doc(db, 'categories', deleteCandidate.id);
        await deleteDoc(categoryDoc);
        fetchCategories();
        close();
        setDeleteCandidate(null);
    }
  };

  const openDeleteModal = (category) => {
    setDeleteCandidate(category);
    open();
  }

  return (
    <Container size="sm" my="md">
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Title order={2} mb="lg">Manage Categories</Title>
        <form onSubmit={handleAddOrUpdateCategory}>
          <Group>
            <TextInput
              label={editingCategory ? "Edit Category" : "New Category"}
              placeholder="Enter category name"
              value={categoryName}
              onChange={(event) => setCategoryName(event.currentTarget.value)}
              required
              style={{ flex: 1 }}
            />
            <Button type="submit" mt={25}>{editingCategory ? "Update" : "Add"}</Button>
          </Group>
        </form>

        <List spacing="xs" size="sm" center mt="lg">
          {categories.map((cat) => (
            <List.Item
              key={cat.id}
              icon={
                <ThemeIcon color="teal" size={24} radius="xl">
                  <IconTag size={16} />
                </ThemeIcon>
              }
            >
                <Group position="apart">
                    <Text>{cat.name}</Text>
                    <Group spacing="xs">
                        <ActionIcon color="blue" onClick={() => {
                            setEditingCategory(cat);
                            setCategoryName(cat.name);
                        }}>
                            <IconPencil size={16} />
                        </ActionIcon>
                        <ActionIcon color="red" onClick={() => openDeleteModal(cat)}>
                            <IconTrash size={16} />
                        </ActionIcon>
                    </Group>
                </Group>
            </List.Item>
          ))}
        </List>
      </Paper>
      
      <Modal opened={opened} onClose={close} title="Confirm Deletion">
        <Text>Are you sure you want to delete the category "{deleteCandidate?.name}"?</Text>
        <Group mt="md" position="right">
            <Button variant="default" onClick={close}>Cancel</Button>
            <Button color="red" onClick={handleDeleteCategory}>Delete</Button>
        </Group>
      </Modal>

    </Container>
  );
};

export default CategoriesPage;
