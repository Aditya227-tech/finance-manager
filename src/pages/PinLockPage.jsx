import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Container, Typography, Box } from '@mui/material';

const PinLockPage = () => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const correctPin = '1234'; // In a real app, this should be stored securely

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pin === correctPin) {
      navigate('/dashboard');
    } else {
      setError('Invalid PIN');
      setPin('');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Enter PIN
        </Typography>
        <Box component="form" onSubmit={handlePinSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="pin"
            label="PIN"
            type="password"
            id="pin"
            autoComplete="off"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            inputProps={{ maxLength: 4 }}
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Unlock
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default PinLockPage;
