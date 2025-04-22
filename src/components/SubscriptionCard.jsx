import React from 'react';
import { Box, Typography, Button, useMediaQuery, useTheme } from '@mui/material';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const SubscriptionCard = ({
    title = "Essential",
    subtitle = "Simplify Your Success",
    price = "$7.99",
    features = [],
    actionButton = null,
    isRightSide = true
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isMedium = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Box sx={{
            display: 'flex',
            width: '100%',
            height: '100%',
            justifyContent: isRightSide ? 'flex-end' : 'flex-start',
            alignItems: 'center',
            px: { xs: 2, sm: 4 },
            py: 4
        }}>
            <Box sx={{
                border: '2px solid white',
                borderRadius: '8px',
                p: { xs: 3, sm: 4 },
                width: { xs: '100%', sm: '400px' },
                maxWidth: '400px',
                backgroundColor: 'black',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
            }}>
                {/* Badge Icon */}
                <WorkspacePremiumIcon sx={{
                    color: '#FFD100',
                    fontSize: { xs: '2.5rem', sm: '3rem' },
                    mb: 1
                }} />

                {/* Title */}
                <Typography variant="h3" fontWeight="bold" sx={{
                    fontSize: { xs: '2rem', sm: '2.5rem' },
                    mb: 0.5
                }}>
                    {title}
                </Typography>

                {/* Subtitle */}
                <Typography variant="body1" sx={{
                    fontSize: { xs: '1rem', sm: '1.2rem' },
                    mb: 2
                }}>
                    {subtitle}
                </Typography>

                {/* Price */}
                <Typography variant="h2" fontWeight="bold" sx={{
                    color: '#FFD100',
                    fontSize: { xs: '3.5rem', sm: '4.5rem' },
                    mb: 0.5,
                    display: 'flex',
                    alignItems: 'baseline',
                    alignSelf: 'center'
                }}>
                    {price}
                    <Typography
                        component="span"
                        sx={{
                            color: '#FFD100',
                            fontSize: { xs: '1rem', sm: '1.2rem' },
                            ml: 0.5
                        }}
                    >
                        /month
                    </Typography>
                </Typography>

                {/* Action Button */}
                {actionButton && (
                    <Box sx={{ mb: 2, alignSelf: 'center' }}>
                        {actionButton}
                    </Box>
                )}

                {/* Features */}
                <Box sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    mt: actionButton ? 0 : 2
                }}>
                    {features.map((feature, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5
                            }}
                        >
                            <CheckCircleOutlineIcon sx={{ color: '#FFD100' }} />
                            <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                                {feature}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default SubscriptionCard; 