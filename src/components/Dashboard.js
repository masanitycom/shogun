import React from 'react';
import { Box, Typography } from '@mui/material';

export default function Dashboard() {
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4">
                ユーザーダッシュボード
            </Typography>
            {/* ここにダッシュボードの内容を追加 */}
        </Box>
    );
}
