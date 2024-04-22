import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, TextField, IconButton } from '@mui/material';
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";
import LinkIcon from '@mui/icons-material/Link';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const Permits = () => {
    const [permits, setPermits] = useState([]);
    const [sortedBy, setSortedBy] = useState('');
    const [ascending, setAscending] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth0();
    

    useEffect(() => {
        fetchPermits();
    }, []);

    const fetchPermits = () => {
        axios.get('http://localhost:8800/permits')
            .then(response => {
                setPermits(response.data.sort((a, b) => new Date(b.submittedDate) - new Date(a.submittedDate)));
                setSortedBy('submittedDate');
            })
            .catch(error => console.error('Error fetching permits:', error));
    };

    const deletePermit = (permitId) => {
        axios.delete(`http://localhost:8800/permits/${permitId}`)
            .then(() => {
                fetchPermits();
            })
            .catch(error => {
                alert('Failed to delete permit');
                console.error('Error deleting permit:', error);
            });
    };

    const handleSort = (field) => {
        const isAsc = sortedBy === field ? !ascending : false;
        setPermits(permits.slice().sort((a, b) => {
            if (a[field] < b[field]) return isAsc ? -1 : 1;
            if (a[field] > b[field]) return isAsc ? 1 : -1;
            return 0;
        }));
        setAscending(isAsc);
        setSortedBy(field);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const filteredPermits = permits.filter(permit => 
        permit.permitName.toLowerCase().includes(searchTerm) ||
        permit.address.toLowerCase().includes(searchTerm)
    );

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <Typography variant="h4" sx={{ margin: 2 }}>Permit Dashboard</Typography>
            <TextField
                label="Search by Name or Address"
                variant="outlined"
                fullWidth
                onChange={handleSearchChange}
                sx={{ mb: 2 }}
            />
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Permit Name</TableCell>
                            <TableCell>Submitter Name</TableCell>
                            <TableCell onClick={() => handleSort('submittedDate')}>
                                Submitted Date {sortedBy === 'submittedDate' && (ascending ? <ArrowUpwardIcon fontSize="inherit" /> : <ArrowDownwardIcon fontSize="inherit" />)}
                            </TableCell>
                            <TableCell onClick={() => handleSort('endDate')}>
                                End Date {sortedBy === 'endDate' && (ascending ? <ArrowUpwardIcon fontSize="inherit" /> : <ArrowDownwardIcon fontSize="inherit" />)}
                            </TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Attachment</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredPermits.map((permit) => (
                            <TableRow key={permit.permitId}>
                                <TableCell>{permit.permitName}</TableCell>
                                <TableCell>{permit.submitterName}</TableCell>
                                <TableCell>{permit.submittedDate}</TableCell>
                                <TableCell>{permit.endDate}</TableCell>
                                <TableCell>{permit.status}</TableCell>
                                <TableCell>{permit.address}</TableCell>
                                <TableCell>
                                    {permit.link ? (
                                        <a href={permit.link} target="_blank" rel="noopener noreferrer" style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px', display: 'inline-block' }}>
                                            <LinkIcon />
                                        </a>
                                    ) : 'None'}
                                </TableCell>
                                <TableCell>
                                    {isAuthenticated && (
                                        <>
                                            <Button color="primary" onClick={() => navigate(`/update/${permit.permitId}`)}>
                                                Update
                                            </Button>
                                            &nbsp;
                                            <Button color="secondary" onClick={() => deletePermit(permit.permitId)}>
                                                Delete
                                            </Button>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {isAuthenticated && (
                <Button variant="contained" color="primary" sx={{ m: 2 }} onClick={() => navigate('/add')}>
                    Add Permit
                </Button>
            )}
        </Paper>
    );
};

export default Permits;
