import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';

function PricingCard({ title, price, description, benefits, buttonText, highlight = false }) {
    const listItemStyles = {
        fontSize: '0.9rem',
        fontWeight: 'normal',
        lineHeight: '1.5',
        color: 'white',
    };

    return (
        <Card sx={{
            bgcolor: '#333',
            transition: 'transform 0.3s',
            '&:hover': {
                transform: 'scale(1.05)',
            }
        }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom color={highlight ? '#ffcc00' : 'inherit'}>
                    {title}
                </Typography>
                <Typography variant="h4" gutterBottom color={highlight ? '#ffcc00' : 'inherit'}>
                    {price}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {description}
                </Typography>
                <ul sx={{ textAlign: 'left', listStyleType: 'none', pl: 0 }}>
                    {benefits.map((benefit, index) => (
                        <li key={index}><Typography sx={listItemStyles} fontWeight="bold">- {benefit}</Typography></li>
                    ))}
                </ul>
                <Button variant="contained" color="secondary" size="large" mt={3}>
                    {buttonText}
                </Button>
            </CardContent>
        </Card>
    );
}

export default PricingCard;
