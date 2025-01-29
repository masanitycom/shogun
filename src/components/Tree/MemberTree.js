// src/components/Tree/MemberTree.js
import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { TreeView, TreeItem } from '@mui/lab';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PersonIcon from '@mui/icons-material/Person';

const CustomTreeItem = ({ node }) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5 }}>
            <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                <PersonIcon />
            </Avatar>
            <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {node.name_kana}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    ID: {node.user_id}
                </Typography>
            </Box>
        </Box>
    );
};

const MemberTree = ({ data }) => {
    const renderTree = (node) => (
        <TreeItem
            key={node.id}
            nodeId={node.id}
            label={<CustomTreeItem node={node} />}
        >
            {Array.isArray(node.children)
                ? node.children.map((child) => renderTree(child))
                : null}
        </TreeItem>
    );

    return (
        <TreeView
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            sx={{
                height: 'auto',
                flexGrow: 1,
                maxWidth: '100%',
                overflowY: 'auto'
            }}
        >
            {data && renderTree(data)}
        </TreeView>
    );
};

export default MemberTree;
