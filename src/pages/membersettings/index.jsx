import React, { useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  TextField,
  Grid,
  CircularProgress,
  Alert,
  Switch,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { Formik, Form, useField } from "formik";
import * as Yup from "yup";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useClerk, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useColors } from "../../theme/colors";
import StyledButton from "../HomePage/StyledButton";
import { useSneakerMember } from "../../context/MemberContext";

const SETTINGS_MEMBER = gql`
  query SettingsMember {
    currentMember {
      id
      email
      firstName
      lastName
      phoneNumber
      addressLineOne
      addressLineTwo
      zipcode
      state
    }
  }
`;

const UPDATE_MEMBER = gql`
  mutation UpdateMember($data: UpdateMemberInput!) {
    updateMember(data: $data)
  }
`;

// Styled text field that adapts to current theme colors
const ThemedField = ({ name, colors, ...props }) => {
  const [field, meta] = useField(name);
  const isError = meta.touched && Boolean(meta.error);
  return (
    <TextField
      {...field}
      {...props}
      error={isError}
      helperText={isError ? meta.error : props.helperText}
      sx={{
        "& .MuiOutlinedInput-root": {
          color: colors.textPrimary,
          backgroundColor: colors.isDark ? "#111" : "#f5f5f5",
          "& fieldset": { borderColor: colors.borderSecondary },
          "&:hover fieldset": { borderColor: colors.textSecondary },
          "&.Mui-focused fieldset": { borderColor: colors.warning },
          "&.Mui-disabled": { opacity: 0.5 },
        },
        "& .MuiInputLabel-root": { color: colors.textSecondary },
        "& .MuiInputLabel-root.Mui-focused": { color: colors.warning },
        "& .MuiInputBase-input.Mui-disabled": {
          WebkitTextFillColor: colors.textSecondary,
        },
        ...props.sx,
      }}
    />
  );
};

// Card-style container for each section
const Section = ({ title, children, colors }) => (
  <Box
    sx={{
      backgroundColor: colors.widgetBg,
      border: `1px solid ${colors.borderSecondary}`,
      borderRadius: 2,
      padding: { xs: "20px", sm: "28px 32px" },
      mb: 3,
    }}
  >
    {title && (
      <Typography
        variant="h5"
        sx={{ color: colors.textPrimary, fontWeight: "bold", mb: 3 }}
      >
        {title}
      </Typography>
    )}
    {children}
  </Box>
);

// ─── Profile Tab ────────────────────────────────────────────────────────────
const ProfileTab = () => {
  const colors = useColors();
  const { data, loading, error, refetch } = useQuery(SETTINGS_MEMBER);
  const [updateMember] = useMutation(UPDATE_MEMBER);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress sx={{ color: colors.warning }} />
      </Box>
    );
  if (error)
    return <Alert severity="error">Error loading profile. Please refresh.</Alert>;

  const m = data?.currentMember;

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const { data: result } = await updateMember({
        variables: {
          data: {
            firstName: values.firstName,
            lastName: values.lastName,
            phoneNumber: values.phoneNumber,
            addressLineOne: values.addressLineOne,
            addressLineTwo: values.addressLineTwo,
            zipcode: values.zipcode,
            state: values.state,
          },
        },
      });
      if (result.updateMember) {
        setSuccessMsg("Profile updated successfully.");
        setErrorMsg(null);
        refetch();
      } else {
        throw new Error("Update failed.");
      }
    } catch (e) {
      setErrorMsg(e.message || "Something went wrong.");
      setSuccessMsg(null);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Section title="Personal Information" colors={colors}>
      {successMsg && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMsg}
        </Alert>
      )}
      {errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}
      <Formik
        enableReinitialize
        initialValues={{
          email: m?.email || "",
          firstName: m?.firstName || "",
          lastName: m?.lastName || "",
          phoneNumber: m?.phoneNumber || "",
          addressLineOne: m?.addressLineOne || "",
          addressLineTwo: m?.addressLineTwo || "",
          zipcode: m?.zipcode || "",
          state: m?.state || "",
        }}
        validationSchema={Yup.object({
          firstName: Yup.string().required("Required"),
          lastName: Yup.string().required("Required"),
          phoneNumber: Yup.string(),
          addressLineOne: Yup.string(),
          addressLineTwo: Yup.string(),
          zipcode: Yup.string(),
          state: Yup.string(),
        })}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <ThemedField
                  name="email"
                  label="Email"
                  variant="outlined"
                  fullWidth
                  disabled
                  helperText="Email cannot be changed."
                  colors={colors}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ThemedField
                  name="firstName"
                  label="First Name"
                  variant="outlined"
                  fullWidth
                  colors={colors}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ThemedField
                  name="lastName"
                  label="Last Name"
                  variant="outlined"
                  fullWidth
                  colors={colors}
                />
              </Grid>
              <Grid item xs={12}>
                <ThemedField
                  name="phoneNumber"
                  label="Phone Number"
                  variant="outlined"
                  fullWidth
                  colors={colors}
                />
              </Grid>
              <Grid item xs={12}>
                <ThemedField
                  name="addressLineOne"
                  label="Address Line 1"
                  variant="outlined"
                  fullWidth
                  colors={colors}
                />
              </Grid>
              <Grid item xs={12}>
                <ThemedField
                  name="addressLineTwo"
                  label="Address Line 2"
                  variant="outlined"
                  fullWidth
                  colors={colors}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ThemedField
                  name="zipcode"
                  label="Zipcode"
                  variant="outlined"
                  fullWidth
                  colors={colors}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ThemedField
                  name="state"
                  label="State"
                  variant="outlined"
                  fullWidth
                  colors={colors}
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
              <StyledButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <CircularProgress size={20} sx={{ color: "white" }} />
                ) : (
                  "Save Changes"
                )}
              </StyledButton>
            </Box>
          </Form>
        )}
      </Formik>
    </Section>
  );
};

// ─── Security Tab ────────────────────────────────────────────────────────────
const SecurityTab = () => {
  const colors = useColors();
  const { user } = useUser();
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await user.updatePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      setSuccessMsg("Password updated successfully.");
      setErrorMsg(null);
      resetForm();
    } catch (e) {
      setErrorMsg(
        e.errors?.[0]?.longMessage ||
          e.errors?.[0]?.message ||
          "Failed to update password."
      );
      setSuccessMsg(null);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Section title="Change Password" colors={colors}>
      {successMsg && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMsg}
        </Alert>
      )}
      {errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}
      <Formik
        initialValues={{
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }}
        validationSchema={Yup.object({
          currentPassword: Yup.string().required("Required"),
          newPassword: Yup.string()
            .min(8, "At least 8 characters")
            .required("Required"),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref("newPassword")], "Passwords must match")
            .required("Required"),
        })}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <ThemedField
                  name="currentPassword"
                  label="Current Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  colors={colors}
                />
              </Grid>
              <Grid item xs={12}>
                <ThemedField
                  name="newPassword"
                  label="New Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  colors={colors}
                />
              </Grid>
              <Grid item xs={12}>
                <ThemedField
                  name="confirmPassword"
                  label="Confirm New Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  colors={colors}
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
              <StyledButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <CircularProgress size={20} sx={{ color: "white" }} />
                ) : (
                  "Update Password"
                )}
              </StyledButton>
            </Box>
          </Form>
        )}
      </Formik>
    </Section>
  );
};

// ─── Subscription Tab ────────────────────────────────────────────────────────
const SubscriptionTab = () => {
  const colors = useColors();
  const { member } = useSneakerMember();
  const navigate = useNavigate();

  return (
    <Section title="Subscription" colors={colors}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography sx={{ color: colors.textSecondary, fontSize: "0.85rem", mb: 0.5 }}>
            Current Plan
          </Typography>
          <Typography
            sx={{ color: colors.textPrimary, fontWeight: "bold", fontSize: "1.1rem" }}
          >
            Basic Plan — $8.00/month
          </Typography>
          <Typography
            sx={{
              color: member?.isSubscribed ? "#2ECC71" : "#e74c3c",
              fontSize: "0.9rem",
              mt: 0.5,
              fontWeight: 500,
            }}
          >
            {member?.isSubscribed ? "Active" : "Inactive"}
          </Typography>
        </Box>
        <StyledButton onClick={() => navigate("/member/subscriptions")}>
          Manage Subscription
        </StyledButton>
      </Box>
    </Section>
  );
};

// ─── Notifications Tab ───────────────────────────────────────────────────────
const NotificationsTab = () => {
  const colors = useColors();
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [inAppNotifs, setInAppNotifs] = useState(true);

  const switchSx = {
    "& .MuiSwitch-switchBase.Mui-checked": { color: colors.warning },
    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
      backgroundColor: colors.warning,
    },
  };

  const NotifRow = ({ label, description, checked, onChange }) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        py: 1,
      }}
    >
      <Box>
        <Typography sx={{ color: colors.textPrimary, fontWeight: 500 }}>
          {label}
        </Typography>
        <Typography sx={{ color: colors.textSecondary, fontSize: "0.85rem" }}>
          {description}
        </Typography>
      </Box>
      <Switch checked={checked} onChange={onChange} sx={switchSx} />
    </Box>
  );

  return (
    <Section title="Notification Preferences" colors={colors}>
      <Alert severity="info" sx={{ mb: 3 }}>
        Saving preferences requires a backend update — UI is ready to wire up.
      </Alert>
      <NotifRow
        label="Email Notifications"
        description="Receive contract updates and alerts via email"
        checked={emailNotifs}
        onChange={(e) => setEmailNotifs(e.target.checked)}
      />
      <Divider sx={{ borderColor: colors.borderSecondary, my: 1 }} />
      <NotifRow
        label="In-App Notifications"
        description="Show notifications inside the app"
        checked={inAppNotifs}
        onChange={(e) => setInAppNotifs(e.target.checked)}
      />
    </Section>
  );
};

// ─── Account Tab ─────────────────────────────────────────────────────────────
const AccountTab = () => {
  const colors = useColors();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleLogout = () => {
    signOut(() => navigate("/"));
  };

  const handleDeleteRequest = () => {
    window.location.href =
      "mailto:help@sneakersociety.com?subject=Account%20Deletion%20Request&body=Hi%2C%20I%27d%20like%20to%20request%20the%20deletion%20of%20my%20Sneaker%20Society%20account.";
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <Section title="Session" colors={colors}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography sx={{ color: colors.textPrimary, fontWeight: 500 }}>
              Log Out
            </Typography>
            <Typography sx={{ color: colors.textSecondary, fontSize: "0.85rem" }}>
              Sign out of your account on this device
            </Typography>
          </Box>
          <StyledButton onClick={handleLogout}>Log Out</StyledButton>
        </Box>
      </Section>

      <Section colors={colors}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography sx={{ color: "#e74c3c", fontWeight: 600 }}>
              Delete Account
            </Typography>
            <Typography sx={{ color: colors.textSecondary, fontSize: "0.85rem" }}>
              Permanently remove your account and all associated data
            </Typography>
          </Box>
          <Button
            variant="outlined"
            onClick={() => setDeleteDialogOpen(true)}
            sx={{
              borderColor: "#e74c3c",
              color: "#e74c3c",
              textTransform: "none",
              "&:hover": {
                borderColor: "#c0392b",
                color: "#c0392b",
                backgroundColor: "rgba(231,76,60,0.06)",
              },
            }}
          >
            Delete Account
          </Button>
        </Box>
      </Section>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: colors.widgetBg,
            border: `1px solid ${colors.borderSecondary}`,
          },
        }}
      >
        <DialogTitle sx={{ color: colors.textPrimary }}>
          Delete Account
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: colors.textSecondary }}>
            To delete your account, you'll need to contact our support team.
            Clicking <strong style={{ color: colors.textPrimary }}>Continue</strong> will
            open an email to{" "}
            <strong style={{ color: colors.textPrimary }}>
              help@sneakersociety.com
            </strong>{" "}
            with your request.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ color: colors.textSecondary, textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteRequest}
            sx={{ color: "#e74c3c", textTransform: "none" }}
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// ─── Main Settings Page ───────────────────────────────────────────────────────
const TABS = ["Profile", "Security", "Subscription", "Notifications", "Account"];

const MemberSettings = () => {
  const colors = useColors();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 700,
        mx: "auto",
        px: { xs: 2, sm: 3 },
        py: 4,
      }}
    >
      <Typography
        variant="h3"
        sx={{ color: colors.textPrimary, fontWeight: "bold", mb: 3 }}
      >
        Settings
      </Typography>

      <Tabs
        value={activeTab}
        onChange={(_, v) => setActiveTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          mb: 4,
          borderBottom: `1px solid ${colors.borderSecondary}`,
          "& .MuiTab-root": {
            color: colors.textSecondary,
            textTransform: "none",
            fontSize: "0.95rem",
          },
          "& .MuiTab-root.Mui-selected": { color: colors.warning },
          "& .MuiTabs-indicator": { backgroundColor: colors.warning },
        }}
      >
        {TABS.map((t) => (
          <Tab key={t} label={t} />
        ))}
      </Tabs>

      {activeTab === 0 && <ProfileTab />}
      {activeTab === 1 && <SecurityTab />}
      {activeTab === 2 && <SubscriptionTab />}
      {activeTab === 3 && <NotificationsTab />}
      {activeTab === 4 && <AccountTab />}
    </Box>
  );
};

export default MemberSettings;
