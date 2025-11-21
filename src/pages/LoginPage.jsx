import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import { 
    Container, 
    Paper, 
    TextInput, 
    PasswordInput, 
    Button, 
    Title, 
    Text, 
    Group, 
    Alert, 
    Divider 
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { GoogleIcon } from '../components/GoogleIcon'; // Assuming you have a GoogleIcon component

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container size={420} my={40}>
        <Title
            align="center"
            sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
        >
            Welcome back!
        </Title>
        <Text color="dimmed" size="sm" align="center" mt={5}>
            Do not have an account yet?{' '}
            <Text component="a" href="#" size="sm" onClick={(e) => e.preventDefault()}>
                Create account
            </Text>
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            {error && (
                <Alert icon={<IconAlertCircle size={16} />} title="Login Error" color="red" withCloseButton onClose={() => setError(null)} mb="md">
                    {error}
                </Alert>
            )}
            <form onSubmit={handleLogin}>
                <TextInput 
                    label="Email"
                    placeholder="your@email.com" 
                    required 
                    value={email}
                    onChange={(event) => setEmail(event.currentTarget.value)}
                />
                <PasswordInput 
                    label="Password" 
                    placeholder="Your password" 
                    required 
                    mt="md" 
                    value={password}
                    onChange={(event) => setPassword(event.currentTarget.value)}
                />
                <Group position="apart" mt="md">
                    <Text component="a" href="#" onClick={(e) => e.preventDefault()} size="xs">
                        Forgot password?
                    </Text>
                </Group>
                <Button fullWidth mt="xl" type="submit">
                    Sign in
                </Button>
            </form>
            
            <Divider label="Or continue with" labelPosition="center" my="lg" />

            <Button 
                fullWidth 
                variant="default"
                leftIcon={<GoogleIcon />}
                onClick={handleGoogleSignIn}
            >
                Sign in with Google
            </Button>
        </Paper>
    </Container>
  );
};

export default LoginPage;
