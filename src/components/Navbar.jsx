import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { Navbar, NavLink as MantineNavLink, Group, Code, Text, Avatar, Button } from '@mantine/core';
import {
  IconGauge, IconPlus, IconCoin, IconList, IconReportMoney, IconChartBar, IconLogout, IconSettings
} from '@tabler/icons-react';

const navItems = [
    { to: '/dashboard', icon: <IconGauge size={18} />, label: 'Dashboard' },
    { to: '/add-expense', icon: <IconPlus size={18} />, label: 'Add Expense' },
    { to: '/add-income', icon: <IconCoin size={18} />, label: 'Add Income' },
    { to: '/categories', icon: <IconList size={18} />, label: 'Categories' },
    { to: '/budget', icon: <IconReportMoney size={18} />, label: 'Budget' },
    { to: '/reports', icon: <IconChartBar size={18} />, label: 'Reports' },
    { to: '/settings', icon: <IconSettings size={18} />, label: 'Settings' },
];

const CustomNavbar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  const userAvatar = user?.photoURL || `https://api.dicebear.com/6.x/initials/svg?seed=${user?.email}`;

  return (
    <Navbar width={{ sm: 250, lg: 300 }} p="md">
      <Navbar.Section>
        <Group position="apart">
          <Text weight={700} size="xl">FinanceFlow</Text>
          <Code>v0.1.0</Code>
        </Group>
      </Navbar.Section>
      
      <Navbar.Section grow mt="md">
        {navItems.map((item) => (
            <MantineNavLink
                key={item.label}
                label={item.label}
                icon={item.icon}
                component={NavLink}
                to={item.to}
                active={window.location.pathname === item.to}
                variant="filled"
            />
        ))}
      </Navbar.Section>

      <Navbar.Section>
        <Group spacing="xs">
            <Avatar src={userAvatar} radius="xl" />
            <div style={{ flex: 1 }}>
                <Text size="sm" weight={500}>{user?.displayName}</Text>
                <Text color="dimmed" size="xs">{user?.email}</Text>
            </div>
        </Group>
        <Button 
            fullWidth 
            mt="md"
            variant="light"
            color="red"
            leftIcon={<IconLogout size={16} />}
            onClick={handleLogout}
        >
          Logout
        </Button>
      </Navbar.Section>
    </Navbar>
  );
};

export default CustomNavbar;
