import React from 'react';
import { Table, Group, Text, Avatar } from '@mantine/core';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react';

const TransactionList = ({ transactions }) => {
    if (!transactions || transactions.length === 0) {
        return <Text color="dimmed" align="center" mt="lg">No recent transactions to display.</Text>;
    }

  const rows = transactions.map((transaction) => {
    const amount = typeof transaction.amount === 'number' ? transaction.amount : 0;
    return (
        <tr key={transaction.id}>
        <td>
            <Group spacing="sm">
            <Avatar color={transaction.type === 'income' ? 'teal' : 'red'} size="lg" radius="xl">
                {transaction.type === 'income' ? <IconArrowUpRight size={20} /> : <IconArrowDownRight size={20} />}
            </Avatar>
            <div>
                <Text size="sm" weight={500}>{transaction.description}</Text>
                <Text size="xs" color="dimmed">
                {new Date(transaction.date.seconds * 1000).toLocaleDateString()}
                </Text>
            </div>
            </Group>
        </td>
        <td>
            <Text size="sm" color={transaction.type === 'income' ? 'teal' : 'red'} weight={700} align="right">
            {transaction.type === 'income' ? '+' : '-'}${amount.toFixed(2)}
            </Text>
        </td>
        </tr>
    );
});

  return (
    <Table verticalSpacing="md" highlightOnHover>
      <thead>
        <tr>
          <th>Transaction</th>
          <th style={{ textAlign: 'right' }}>Amount</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
};

export default TransactionList;
