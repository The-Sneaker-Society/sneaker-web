import React from 'react';
import { Container, Box, Typography, Button, Link } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useParams } from 'react-router-dom';
import { MdCheckCircle, MdError } from 'react-icons/md';

const PaymentStatus = ({ success }) => {
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
    const { contractId } = useParams();

    const styles = {
        container: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#000',
            color: '#fff',
            textAlign: 'center',
            padding: '20px',
            boxSizing: 'border-box'
        },
        content: {
            maxWidth: '600px',
            width: '100%'
        },
        icon: {
            marginBottom: '20px'
        },
        iconCircle: {
            backgroundColor: success ? 'green' : 'red', // Change background based on success
            borderRadius: '50%',
            width: isDesktop ? '120px' : '150px',
            height: isDesktop ? '120px' : '150px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '0 auto'
        },
        iconStyle: {
            color: '#fff', // White icon color
            fontSize: isDesktop ? '80px' : '100px' // Icon size depending on screen size
        },
        heading: {
            fontSize: isDesktop ? '28px' : '30px',
            margin: '20px 0'
        },
        paragraph: {
            fontSize: isDesktop ? '18px' : '20px'
        },
        emailInfo: {
            margin: '20px 0',
            fontWeight: 'bold',
            fontSize: isDesktop ? '18px' : '20px'
        },
        resendButton: {
            borderColor: '#fff',
            color: '#fff',
            padding: isDesktop ? '12px 24px' : '14px 28px',
            margin: '20px 0',
            fontSize: isDesktop ? '16px' : '20px'
        },
        supportInfo: {
            fontSize: isDesktop ? '16px' : '18px'
        },
        supportLink: {
            color: '#fff',
            textDecoration: 'underline'
        }
    };

    return (
        <Container style={styles.container}>
            <Box style={styles.content}>
                <Box style={styles.icon}>
                    <Box style={styles.iconCircle}>
                        {success ? (
                            <MdCheckCircle style={styles.iconStyle} />
                        ) : (
                            <MdError style={styles.iconStyle} />
                        )}
                    </Box>
                </Box>
                <Typography variant="h4" style={styles.heading}>
                    {success ? 'Payment Successful' : 'Payment Failed'}
                </Typography>
                {success ? (
                    <>
                        <Typography variant="body1" style={styles.paragraph}>
                            Your transaction has been successfully processed. We appreciate your business!
                        </Typography>
                        <Typography variant="body1" style={styles.emailInfo}>
                            Email was sent to:
                            <a href="mailto:test@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>
                                test@gmail.com
                            </a>
                        </Typography>
                        <Button variant="outlined" style={styles.resendButton}>Resend</Button>
                    </>
                ) : (
                    <Typography variant="body1" style={styles.paragraph}>
                        If you have any questions or concerns regarding your payment, please don't hesitate
                        to contact our support team at <Link href="mailto:help@thesneakerssociety.com" style={styles.supportLink}>help@thesneakerssociety.com</Link>
                    </Typography>
                )}
                {!success && (
                    <Typography variant="body2" style={styles.supportInfo}>
                        If you have any questions or concerns regarding your payment, please don't hesitate
                        to contact our support team at <Link href="mailto:help@thesneakerssociety.com" style={styles.supportLink}>help@thesneakerssociety.com</Link>
                    </Typography>
                )}
            </Box>
        </Container>
    );
}

export default PaymentStatus;
