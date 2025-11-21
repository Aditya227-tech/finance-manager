import React from 'react';
import { List, ListItem, ListItemText, ListItemAvatar, Avatar, Typography } from '@mui/material';
import { green, red } from '@mui/material/colors';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';

const TransactionList = ({ transactions }) => {
  return (
    <List>
      {transactions.map((transaction) => (
        <ListItem key={transaction.id}>
          <ListItemAvatar>
            <Avatar sx={{ bgcolor: transaction.type === 'income' ? green[500] : red[500] }}>
              {transaction.type === 'income' ? <AttachMoneyIcon /> : <MoneyOffIcon />}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={transaction.description}
            secondary={`$${transaction.amount.toFixed(2)} - ${new Date(transaction.date.seconds * 1000).toLocaleDateString()}`}
          />
          <Typography color={transaction.type === 'income' ? 'green' : 'red'} sx={{ fontWeight: 'bold' }}>
            {transaction.type === 'income' ? '+' : '-'}$${transaction.amount.toFixed(2)}
          </Typography>
        </ListItem>
      ))}
    </List>
  );
};

export default TransactionList;
