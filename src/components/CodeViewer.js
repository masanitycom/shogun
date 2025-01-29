// src/components/CodeViewer.js

import React, { useState, useEffect } from 'react';
import { fetchGithubCode } from '../utils/githubUtils';
import {
    Box,
    CircularProgress,
    Typography,
    Container,
    Alert
} from '@mui/material';

const CodeViewer = ({ filePath }) => {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getCode = async () => {
            try {
                const content = await fetchGithubCode(filePath);
                setCode(content);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        getCode();
    }, [filePath]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" m={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ m: 2 }}>
                エラーが発生しました: {error}
            </Alert>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{
                p: 3,
                bgcolor: '#f5f5f5',
                borderRadius: 1,
                mt: 2,
                overflow: 'auto'
            }}>
                <Typography
                    component="pre"
                    sx={{
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'monospace'
                    }}
                >
                    {code}
                </Typography>
            </Box>
        </Container>
    );
};

export default CodeViewer;
