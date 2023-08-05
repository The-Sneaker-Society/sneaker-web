import { Button, TextField, Stack, Box, Alert } from '@mui/material';
import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/authContext';
import Logo from '../../assets/ss-logo.svg';
import GoogleIcon from '@mui/icons-material/Google';
import * as Yup from 'yup'; // Import Yup validation library

import { Formik, Form, Field, useField } from 'formik';

const FormikTextField = ({ name, ...props }) => {
  const [field, meta] = useField(name);

  const isError = meta.touched && meta.error;

  return (
    <TextField
      {...field}
      {...props}
      error={isError}
      helperText={isError ? meta.error : props.helperText}
    />
  );
};

export default function LoginPage() {
  const [error, setError] = useState('');
  const { handleLoginWithGoogle, handleLoginWithEmailAndPass } =
    useContext(AuthContext);

  const handleLogin = async (e, type, values) => {
    try {
      e.preventDefault();
      switch (type) {
        case 'google':
          return await handleLoginWithGoogle();
        case 'email':
          await handleLoginWithEmailAndPass(values.email, values.password);
          break;
        default:
          break;
      }
    } catch (error) {
      setError(error.message);
      console.log(errorCode, errorMessage);
    }
  };

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Stack alignItems="center" spacing={3} pb={7}>
        <img src={Logo} style={{ height: '30vh', width: 'auto' }} alt="Logo" />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          validateOnMount={false}
          // onSubmit={}
        >
          {({ values, errors, isSubmitting }) => (
            <Form>
              <FormikTextField
                name="email"
                label="Email"
                fullWidth
                style={{ paddingBottom: '1rem' }}
              />

              <FormikTextField
                name="password"
                label="Password"
                type="password"
                fullWidth
              />
              <Stack pt={2} spacing={2}>
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  disabled={isSubmitting}
                  onClick={() => handleLogin(e, 'email', values)}
                >
                  Sign In
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleLogin(e, 'google', values)}
                  startIcon={<GoogleIcon />}
                >
                  Sign In with Google
                </Button>
                {error && <Alert severity="error"> {error}</Alert>}
              </Stack>
            </Form>
          )}
        </Formik>
      </Stack>
    </Box>
  );
}
