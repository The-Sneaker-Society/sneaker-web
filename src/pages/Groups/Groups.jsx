import { Box, Typography, useTheme } from "@mui/material";
import GroupCreationForm from "./GroupCreationForm";
import GroupDisplay from "./GroupDisplay";
import { useSneakerMember } from "../../context/MemberContext";
import { tokens } from "../../theme/theme";

const GroupsPage = () => {
  const { member, loading } = useSneakerMember();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, md: 3 },
        bgcolor: isDark ? colors.primary[900] : "#fcfcfc",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 1320,
          mx: "auto",
        }}
      >
        <Typography
          variant="h3"
          sx={{
            color: colors.yellowAccent[500],
            fontWeight: 700,
            mb: { xs: 2, md: 2.5 },
            textAlign: "center",
            lineHeight: 0.5,
          }}
        >
          Groups
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              xl: "minmax(0, 1.15fr) minmax(360px, 0.85fr)",
            },
            gap: { xs: 3, lg: 4 },
            alignItems: "start",
          }}
        >
          <Box
            sx={{
              minWidth: 0,
              width: "100%",
              justifySelf: "center",
            }}
          >
            <GroupCreationForm />
          </Box>

          <Box
            sx={{
              minWidth: 0,
              width: "100%",
              display: "flex",
              justifyContent: "center",
              justifySelf: "center",
              transform: { xs: "none", xl: "translateY(-32px)" },
            }}
          >
            <GroupDisplay
              currentUserId={member?.id}
              currentUserLoading={loading}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default GroupsPage;
