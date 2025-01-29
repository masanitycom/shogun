// src/components/Dashboard/Dashboard.js
import React from 'react';
import { Container, Typography } from '@mui/material';

export default function Dashboard() {
    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                ダッシュボード
            </Typography>
            {/* ここにダッシュボードの内容を追加 */}
        </Container>
    );
}
