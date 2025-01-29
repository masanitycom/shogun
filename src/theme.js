import { createTheme } from '@mui/material';

export const theme = createTheme({
    palette: {
        background: {
            default: '#f8f9fa',
            paper: '#ffffff',
        },
        primary: {
            main: '#0f172a',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: '4px',
                    fontWeight: 500,
                    padding: '10px 0',
                },
                contained: {
                    backgroundColor: '#0f172a',
                    color: '#ffffff',
                    '&:hover': {
                        backgroundColor: '#1e293b',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    marginBottom: '16px',
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '4px',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                    borderRadius: '8px',
                },
            },
        },
    },
});
