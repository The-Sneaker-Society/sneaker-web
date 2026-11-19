import { useRef, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useUser } from "@clerk/clerk-react";
import { Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { Menu } from "@mui/icons-material";
import { useLayout } from "../../components/Layout";
import { useColors } from "../../theme/colors";
import ThemeToggle from "../../components/ThemeToggle";
import LogoutConfirmModal from "../../components/LogoutConfirmModal";
import UserProfileForm from "./UserProfileForm";

const SUPPORT_EMAIL = "support@thesneakersociety.com";

const CURRENT_USER_PROFILE = gql`
  query CurrentUserProfile {
    currentUser {
      id
      email
      firstName
      lastName
      addressLineOne
      addressLineTwo
      city
      country
      zipcode
      state
      phoneNumber
    }
  }
`;

const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile($data: UpdateUserInput!) {
    updateUser(data: $data)
  }
`;

const tabs = [
  { value: "profile", label: "Profile" },
  { value: "support", label: "Support" },
  { value: "account", label: "Account" },
  { value: "appearance", label: "Appearance" },
];

const displayValue = (value) => String(value ?? "").trim() || "Not provided";

const ReadOnlyField = ({ label, value }) => (
  <Box sx={{ minWidth: 0 }}>
    <Typography
      component="dt"
      variant="body2"
      color="text.secondary"
      sx={{ mb: 0.5 }}
    >
      {label}
    </Typography>

    <Typography
      component="dd"
      variant="body1"
      sx={{
        m: 0,
        whiteSpace: "pre-line",
        overflowWrap: "anywhere",
      }}
    >
      {displayValue(value)}
    </Typography>
  </Box>
);

const UserSettingsPage = () => {
  const colors = useColors();
  const { openMobileNav } = useLayout();
  const { user, isLoaded, isSignedIn } = useUser();

  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const savingRef = useRef(false);

  const [saveError, setSaveError] = useState("");
  const [notice, setNotice] = useState(null);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [requestType, setRequestType] = useState(null);

  const { data, loading, error, refetch } = useQuery(CURRENT_USER_PROFILE, {
    skip: !isLoaded || !isSignedIn,
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  const [updateUser] = useMutation(UPDATE_USER_PROFILE);

  const profile = data?.currentUser;
  const accountEmail = user?.primaryEmailAddress?.emailAddress || "";

  const missingShippingFields = [
    ["addressLineOne", "street address"],
    ["city", "city"],
    ["zipcode", "ZIP code"],
  ]
    .filter(([field]) => !String(profile?.[field] ?? "").trim())
    .map(([, label]) => label);

  const address = [
    profile?.addressLineOne,
    profile?.addressLineTwo,
    [profile?.city, profile?.state, profile?.zipcode]
      .filter(Boolean)
      .join(", "),
    profile?.country,
  ]
    .filter(Boolean)
    .join("\n");

  const requestLabel =
    requestType === "deletion" ? "account deletion" : "data export";

  const requestMailto = requestType
    ? `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
        `Sneaker Society ${requestLabel} request`,
      )}&body=${encodeURIComponent(
        [
          "Hello Sneaker Society Support,",
          "",
          `I would like to request ${requestLabel}.`,
          "",
          `Account email: ${accountEmail || "Please enter your account email"}`,
          "",
          "Please let me know the next steps.",
        ].join("\n"),
      )}`
    : undefined;

  const startEditing = () => {
    setSaveError("");
    setNotice(null);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    if (savingRef.current) return;
    setSaveError("");
    setIsEditing(false);
  };

  const handleSave = async (values) => {
    if (savingRef.current) return;

    savingRef.current = true;
    setIsSaving(true);
    setSaveError("");
    setNotice(null);

    try {
      let result;

      try {
        const response = await updateUser({
          variables: {
            data: {
              firstName: values.firstName,
              lastName: values.lastName,
              addressLineOne: values.addressLineOne,
              addressLineTwo: values.addressLineTwo,
              city: values.city,
              country: values.country || "US",
              zipcode: values.zipcode,
              state: values.state,
              phoneNumber: values.phoneNumber,
            },
          },
        });

        result = response.data;

        if (!result?.updateUser) {
          throw new Error("Failed to update profile. Please try again.");
        }
      } catch (mutationError) {
        setSaveError(mutationError.message || "Unable to save your profile.");
        return;
      }

      try {
        const refreshed = await refetch();

        if (refreshed.error || !refreshed.data?.currentUser) {
          throw new Error("Unable to refresh profile.");
        }

        setNotice({
          severity: "success",
          message: "Profile updated successfully.",
        });
      } catch {
        setNotice({
          severity: "warning",
          message:
            "Your changes were saved, but the profile could not be refreshed. Retry loading the profile before making more changes.",
        });
      }

      setIsEditing(false);
    } finally {
      savingRef.current = false;
      setIsSaving(false);
    }
  };

  const cardSx = {
    p: { xs: 2, sm: 3 },
    bgcolor: colors.widgetBg,
    color: colors.textPrimary,
    borderColor: colors.borderSubtle,
    borderRadius: 2,
    minWidth: 0,
  };

  const renderProfile = () => {
    // Keep an active form mounted during the save/refetch cycle.
    if (isEditing && profile) {
      return (
        <Paper variant="outlined" sx={cardSx}>
          <Typography variant="h3" component="h2" fontWeight={600} mb={1}>
            Edit profile
          </Typography>

          <Typography color="text.secondary" mb={3}>
            Street, city, and ZIP code are needed for shipping labels.
          </Typography>

          <UserProfileForm
            profile={profile}
            onSubmit={handleSave}
            onCancel={cancelEditing}
            errorMessage={saveError}
          />
        </Paper>
      );
    }

    if (loading) {
      return (
        <Box
          role="status"
          sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 3 }}
        >
          <CircularProgress size={24} />
          <Typography>Loading profile…</Typography>
        </Box>
      );
    }

    if (error || !profile) {
      return (
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => {
                refetch().catch(() => {
                  // The query error state renders the failure.
                });
              }}
            >
              Retry
            </Button>
          }
        >
          Unable to load your profile. Please try again.
        </Alert>
      );
    }

    return (
      <Paper variant="outlined" sx={cardSx}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h3" component="h2" fontWeight={600}>
              Profile
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Your personal details and shipping information.
            </Typography>
          </Box>

          <Button
            variant="outlined"
            onClick={startEditing}
            sx={{ textTransform: "none" }}
          >
            Edit profile
          </Button>
        </Box>

        {missingShippingFields.length > 0 && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            Your shipping address is incomplete. Add your{" "}
            {missingShippingFields.join(", ")} before shipping labels can be
            created.
          </Alert>
        )}

        <Box
          component="dl"
          sx={{
            m: 0,
            display: "grid",
            gridTemplateColumns: {
              xs: "minmax(0, 1fr)",
              sm: "repeat(2, minmax(0, 1fr))",
            },
            gap: 3,
          }}
        >
          <ReadOnlyField label="First name" value={profile.firstName} />
          <ReadOnlyField label="Last name" value={profile.lastName} />
          <ReadOnlyField label="Email" value={profile.email} />
          <ReadOnlyField label="Phone number" value={profile.phoneNumber} />

          <Box sx={{ gridColumn: "1 / -1" }}>
            <ReadOnlyField label="Shipping address" value={address} />
          </Box>
        </Box>
      </Paper>
    );
  };

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,
        minHeight: "100%",
        color: colors.textPrimary,
      }}
    >
      <Box
        sx={{
          px: { xs: 2.5, sm: 3.5 },
          pt: 3,
          pb: 2.5,
          borderBottom: `1px solid ${colors.borderSubtle}`,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <IconButton
          aria-label="Open navigation"
          onClick={openMobileNav}
          sx={{
            display: { xs: "inline-flex", sm: "none" },
            color: colors.textPrimary,
          }}
        >
          <Menu />
        </IconButton>

        <Box>
          <Typography
            sx={{
              fontSize: "0.7rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: colors.textSecondary,
              mb: 0.5,
            }}
          >
            My Sneakers
          </Typography>

          <Typography
            component="h1"
            fontWeight="bold"
            sx={{
              fontSize: { xs: "1.4rem", sm: "1.75rem", md: "2rem" },
              lineHeight: 1.1,
            }}
          >
            Settings
          </Typography>
        </Box>
      </Box>

      <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1100, mx: "auto" }}>
        <Tabs
          value={activeTab}
          onChange={(_, nextTab) => {
            if (savingRef.current) return;
            setActiveTab(nextTab);
          }}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          aria-label="User settings"
          sx={{
            mb: 3,
            borderBottom: `1px solid ${colors.borderSubtle}`,
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              color: colors.textSecondary,
            },
          }}
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={tab.label}
              id={`settings-tab-${tab.value}`}
              aria-controls={`settings-panel-${tab.value}`}
              disabled={isSaving}
            />
          ))}
        </Tabs>

        {!isLoaded ? (
          <Box role="status" sx={{ display: "flex", gap: 1.5, p: 3 }}>
            <CircularProgress size={24} />
            <Typography>Loading account…</Typography>
          </Box>
        ) : !isSignedIn ? (
          <Alert severity="info">Please sign in to view your settings.</Alert>
        ) : (
          tabs.map((tab) => (
            <Box
              key={tab.value}
              role="tabpanel"
              id={`settings-panel-${tab.value}`}
              aria-labelledby={`settings-tab-${tab.value}`}
              hidden={activeTab !== tab.value}
            >
              {tab.value === "profile" && (
                <>
                  {notice && (
                    <Alert
                      severity={notice.severity}
                      onClose={() => setNotice(null)}
                      sx={{ mb: 2 }}
                    >
                      {notice.message}
                    </Alert>
                  )}

                  {renderProfile()}
                </>
              )}

              {tab.value === "support" && (
                <Paper variant="outlined" sx={cardSx}>
                  <Typography
                    variant="h3"
                    component="h2"
                    fontWeight={600}
                    mb={1}
                  >
                    Support
                  </Typography>

                  <Typography color="text.secondary" mb={3}>
                    Need help with your account or an order?
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: 2,
                    }}
                  >
                    <Button
                      component="a"
                      href={`mailto:${SUPPORT_EMAIL}`}
                      variant="outlined"
                      sx={{
                        textTransform: "none",
                        overflowWrap: "anywhere",
                        maxWidth: "100%",
                      }}
                    >
                      {SUPPORT_EMAIL}
                    </Button>

                    <Button
                      component={RouterLink}
                      to="/faq"
                      sx={{ textTransform: "none" }}
                    >
                      Frequently asked questions
                    </Button>

                    <Button
                      component={RouterLink}
                      to="/user/dashboard"
                      sx={{ textTransform: "none" }}
                    >
                      Back to dashboard
                    </Button>
                  </Box>
                </Paper>
              )}

              {tab.value === "account" && (
                <Paper variant="outlined" sx={cardSx}>
                  <Typography
                    variant="h3"
                    component="h2"
                    fontWeight={600}
                    mb={1}
                  >
                    Account
                  </Typography>

                  <Typography color="text.secondary" mb={3}>
                    You sign in with Google.
                  </Typography>

                  <TextField
                    label="Google account email"
                    value={accountEmail}
                    InputProps={{ readOnly: true }}
                    helperText="Managed through your Google account."
                    fullWidth
                    sx={{ maxWidth: 520 }}
                  />

                  <Box sx={{ mt: 3 }}>
                    <Button
                      variant="outlined"
                      onClick={() => setLogoutOpen(true)}
                      sx={{ textTransform: "none" }}
                    >
                      Log out
                    </Button>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  <Typography variant="h4" component="h3" mb={1}>
                    Your data
                  </Typography>

                  <Typography color="text.secondary" mb={2}>
                    Requests are handled by support. These actions open an email
                    draft; you must send it to make a request.
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      gap: 1.5,
                      alignItems: { xs: "stretch", sm: "center" },
                    }}
                  >
                    <Button
                      variant="outlined"
                      onClick={() => setRequestType("export")}
                      sx={{ textTransform: "none" }}
                    >
                      Request data export
                    </Button>

                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => setRequestType("deletion")}
                      sx={{ textTransform: "none" }}
                    >
                      Request account deletion
                    </Button>
                  </Box>
                </Paper>
              )}

              {tab.value === "appearance" && (
                <Paper variant="outlined" sx={cardSx}>
                  <Typography
                    variant="h3"
                    component="h2"
                    fontWeight={600}
                    mb={1}
                  >
                    Appearance
                  </Typography>

                  <Typography color="text.secondary" mb={3}>
                    Choose the theme you prefer.
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 2,
                    }}
                  >
                    <Box>
                      <Typography fontWeight={600}>Color theme</Typography>

                      <Typography color="text.secondary">
                        Currently using {colors.isDark ? "dark" : "light"} mode.
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        bgcolor: colors.sidebarBg,
                        borderRadius: 2,
                        p: 0.5,
                        display: "inline-flex",
                      }}
                    >
                      <ThemeToggle />
                    </Box>
                  </Box>
                </Paper>
              )}
            </Box>
          ))
        )}
      </Box>

      <LogoutConfirmModal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
      />

      <Dialog
        open={Boolean(requestType)}
        onClose={() => setRequestType(null)}
        aria-labelledby="account-request-title"
        aria-describedby="account-request-description"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="account-request-title">
          {requestType === "deletion"
            ? "Request account deletion?"
            : "Request a data export?"}
        </DialogTitle>

        <DialogContent>
          <DialogContentText id="account-request-description">
            {requestType === "deletion"
              ? "This will open an email draft to support. It will not delete your account or submit a request automatically."
              : "This will open an email draft to support. It will not generate or download an export automatically."}
          </DialogContentText>

          <Typography variant="body2" sx={{ mt: 2 }}>
            Send the email to {SUPPORT_EMAIL}. If your email application does
            not open, contact that address directly from your account email.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, flexWrap: "wrap", gap: 1 }}>
          <Button
            onClick={() => setRequestType(null)}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>

          <Button
            component="a"
            href={requestMailto}
            variant="contained"
            color={requestType === "deletion" ? "error" : "primary"}
            onClick={() => setRequestType(null)}
            sx={{ textTransform: "none" }}
          >
            Open email draft
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserSettingsPage;
