import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import { Autocomplete } from '@react-google-maps/api';

const Update = () => {
    const [permit, setPermit] = useState({
        permitName: '',
        endDate: '',
        submitterName: '',
        status: '',
        submittedDate: '',
        address: ''
    });

    const navigate = useNavigate();
    const location = useLocation();
    const permitId = location.pathname.split('/')[2];
    const autocompleteRef = useRef(null);

    useEffect(() => {
        // Fetch permit details
        axios.get(`http://localhost:8800/permits/${permitId}`)
            .then(response => {
                setPermit({
                    ...response.data,
                    submittedDate: response.data.submittedDate.split('T')[0]  // Ensure date format is correct for input type=date
                });
            })
            .catch(error => console.error('Error fetching permit details:', error));
    }, [permitId]);

    const handleChange = (event) => {
        setPermit((prevState) => ({
            ...prevState,
            [event.target.name]: event.target.value
        }));
    };

    const handleClick = async e => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8800/permits/${permitId}`, permit);
            navigate('/');
        } catch (error) {
            alert(error.message);
            console.log(error);
        }
    };

    const onLoad = (autocomplete) => {
        autocompleteRef.current = autocomplete;
    };

    const onPlaceChanged = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace().formatted_address;
            setPermit(prevState => ({
                ...prevState,
                address: place
            }));
        }
    };

    const { isAuthenticated } = useAuth0();
    if (!isAuthenticated) {
        navigate('/'); // Redirect to home if not authenticated
        return null;
    }

    return (
        <Container maxWidth="sm">
            <Typography variant="h3" gutterBottom>
                Update Permit
            </Typography>
            <TextField
                label="Permit Name"
                value={permit.permitName}
                onChange={handleChange}
                name="permitName"
                fullWidth
                margin="normal"
            />
            <TextField
                label="End Date"
                type="date"
                value={permit.endDate}
                onChange={handleChange}
                name="endDate"
                InputLabelProps={{
                    shrink: true,
                }}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Submitted Date"
                type="date"
                value={permit.submittedDate}
                onChange={handleChange}
                name="submittedDate"
                InputLabelProps={{
                    shrink: true,
                }}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Submitter"
                value={permit.submitterName}
                onChange={handleChange}
                name="submitterName"
                fullWidth
                margin="normal"
            />
            <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                    name="status"
                    value={permit.status}
                    label="Status"
                    onChange={handleChange}
                >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
            </FormControl>
            <Autocomplete
                onLoad={onLoad}
                onPlaceChanged={onPlaceChanged}
            >
                <TextField
                    label="Address"
                    value={permit.address}
                    onChange={handleChange}
                    name="address"
                    fullWidth
                    margin="normal"
                />
            </Autocomplete>
            <Box display="flex" justifyContent="center">
                <Button variant="contained" size="large" onClick={handleClick}>
                    Update
                </Button>
            </Box>
        </Container>
    );
};

export default Update;
