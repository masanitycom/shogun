// src/pages/CodeReference.js

import React from 'react';
import CodeViewer from '../components/CodeViewer';
import {
    Container,
    Tabs,
    Tab,
    Box
} from '@mui/material';
import { useState } from 'react';

function CodeReference() {
    const [selectedFile, setSelectedFile] = useState('Login');

    // ここのアロー関数の書き方を修正
    const handleChange = (event, newValue) => {    // = が => に変更
        setSelectedFile(newValue);
    };

    return (
        <Container>
            <Tabs value={selectedFile} onChange={handleChange}>
                <Tab label="Login" value="Login" />
                <Tab label="Register" value="Register" />
                <Tab label="ResetPassword" value="ResetPassword" />
            </Tabs>

            {selectedFile === 'Login' && (
                <CodeViewer filePath="src/components/Auth/Login.js" />
            )}
            {selectedFile === 'Register' && (
                <CodeViewer filePath="src/components/Auth/Register.js" />
            )}
            {selectedFile === 'ResetPassword' && (
                <CodeViewer filePath="src/components/Auth/ResetPassword.js" />
            )}
        </Container>
    );
}

export default CodeReference;
