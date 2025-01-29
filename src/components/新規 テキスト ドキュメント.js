// src/components/CodeViewer.js

import React, { useState, useEffect } from 'react';
import { fetchGithubCode } from '../utils/githubUtils';
import {
    Box,
    CircularProgress,
    Typography,
    Paper,
    Alert
} from '@mui/material';

const CodeViewer = () => {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadCode = async () => {
            try {
                const result = await fetchGithubCode({
                    owner: 'YourGithubUsername',
                    repo: 'YourRepoName',
                    path: 'src/components/Login.js',
                    ref: 'main' // または特定のブランチやコミットのSHA
                });

                setCode(result.content);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadCode();
    }, []);

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
                {error}
            </Alert>
        );
    }

    return (
        <Paper sx={{ p: 2, m: 2 }}>
            <Typography component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                {code}
            </Typography>
        </Paper>
    );
};

export default CodeViewer;
