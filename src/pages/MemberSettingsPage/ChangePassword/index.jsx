import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../dashboard/SideBar";
import { Link } from "react-router-dom";

const ChangePasswordPage = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    schema
      .validate(
        { currentPassword, newPassword, confirmPassword },
        { abortEarly: false }
      )
      .then(() => {
        // Submit form
      })
      .catch((err) => {
        const newErrors = {};
        err.inner.forEach((error) => {
          newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
      });
  };

  const handleCurrentPasswordChange = (event) => {
    setCurrentPassword(event.target.value);
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleBackClick = () => {
    history.push("/MemberSettings");
  };

  const schema = yup.object().shape({
    currentPassword: yup.string().required("Current password is required"),
    newPassword: yup
      .string()
      .required("New password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: yup
      .string()
      .required("Confirm password is required")
      .oneOf([yup.ref("newPassword"), null], "Passwords must match"),
  });

  const isNonMobile = useMediaQuery("(min-width:600px)");

  return (
    <Box display="flex">
      <Sidebar />
      <Box m="20px">
        <Typography
          sx={{ fontWeight: "bold" }}
          variant="h2"
          marginBottom="20px"
        >
          Set New Password
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="20px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            <TextField
              label="Current Password"
              variant="outlined"
              type="password"
              value={currentPassword}
              onChange={handleCurrentPasswordChange}
              error={!!errors.currentPassword}
              helperText={errors.currentPassword}
              sx={{
                gridColumn: "span 4",
              }}
            />
            <TextField
              label="New Password"
              variant="outlined"
              type="password"
              value={newPassword}
              onChange={handleNewPasswordChange}
              error={!!errors.newPassword}
              helperText={errors.newPassword}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Confirm Password"
              variant="outlined"
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              sx={{ gridColumn: "span 4" }}
            />
            <Box display="flex" mt="20px" gap="30px" gridColumn="span 4">
              <Button variant="contained" color="primary" type="submit">
                Cancel
              </Button>
              <Button variant="contained" color="primary" type="submit">
                Save
              </Button>
            </Box>
            <Button
              size="small"
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/LoginPage")}
            >
              Back to log in
            </Button>
            <Link to="/membersettings">
              <Button
                variant="contained"
                sx={{
                  Link: "/membersettings",
                }}
                onClick={handleBackClick}
              >
                Back
              </Button>
            </Link>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default ChangePasswordPage;