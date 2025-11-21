import React, { useState } from 'react';
import { auth } from '../firebase';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword, deleteUser } from "firebase/auth";
import { Container, Title, Paper, PasswordInput, Button, Group, Text, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

const SettingsPage = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [opened, { open, close }] = useDisclosure(false);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        const user = auth.currentUser;
        const credential = EmailAuthProvider.credential(user.email, currentPassword);

        try {
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);
            setSuccess('Password updated successfully!');
            setCurrentPassword('');
            setNewPassword('');
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDeleteAccount = async () => {
        const user = auth.currentUser;
        try {
            await deleteUser(user);
            // Redirect to login page or show a confirmation message
        } catch (error) {
            setError('Failed to delete account. Please re-authenticate and try again.');
            close();
        }
    };

  return (
    <Container size="sm" my="md">
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Title order={2} mb="lg">Account Settings</Title>
        
        <Paper withBorder p="md" mt="xl" radius="md">
            <Title order={4} mb="md">Change Password</Title>
            {error && <Text color="red" mb="md">{error}</Text>}
            {success && <Text color="green" mb="md">{success}</Text>}
            <form onSubmit={handleChangePassword}>
                <PasswordInput
                    label="Current Password"
                    placeholder="Your current password"
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.currentTarget.value)}
                    required
                />
                <PasswordInput
                    label="New Password"
                    placeholder="Your new password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.currentTarget.value)}
                    required
                    mt="md"
                />
                <Button type="submit" mt="xl">Change Password</Button>
            </form>
        </Paper>

        <Paper withBorder p="md" mt="xl" radius="md">
            <Title order={4} mb="md">Delete Account</Title>
            <Text mb="md">Permanently delete your account and all of your data. This action cannot be undone.</Text>
            <Button color="red" onClick={open}>Delete My Account</Button>
        </Paper>
      </Paper>

      <Modal opened={opened} onClose={close} title="Confirm Account Deletion">
        <Text>Are you sure you want to permanently delete your account? All of your data will be lost.</Text>
        <Group mt="md" position="right">
            <Button variant="default" onClick={close}>Cancel</Button>
            <Button color="red" onClick={handleDeleteAccount}>Delete Account</Button>
        </Group>
      </Modal>
    </Container>
  );
};

export default SettingsPage;
