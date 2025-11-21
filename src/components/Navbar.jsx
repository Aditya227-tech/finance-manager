import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { auth } from '../firebase';

const Navbar = ({ user }) => {
  const handleLogout = async () => {
    await auth.signOut();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
            Finance Tracker
          </Link>
        </Typography>
        {user ? (
          <>
            <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
            <Button color="inherit" component={Link} to="/add-expense">Add Expense</Button>
            <Button color="inherit" component={Link} to="/add-income">Add Income</Button>
            <Button color="inherit" component={Link} to="/categories">Categories</Button>
            <Button color="inherit" component={Link} to="/budget">Budget</Button>
            <Button color="inherit" component={Link} to="/reports">Reports</Button>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <Button color="inherit" component={Link} to="/">Login</Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
