import {
  Box,
  Typography,
  Button,
  TextField,
  Modal,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useGroupPageStyles } from "../styles/groupPageStyles";

const GroupPageModals = ({
  canManageGroup = false,
  canLeaveGroup = false,
  editModalOpen,
  setEditModalOpen,
  deleteGroupModalOpen,
  setDeleteGroupModalOpen,
  modalOpen,
  setModalOpen,
  editName,
  setEditName,
  editDescription,
  setEditDescription,
  editAvatar,
  setEditAvatar,
  editGroupError,
  deleteGroupError,
  joinLeaveError,
  updatingGroup,
  deletingGroup,
  leaving,
  handleUpdateGroup,
  handleDeleteGroup,
  handleLeaveGroup,
}) => {
  const {
    colors,
    modalCardSx,
    modalFieldSx,
    secondaryButtonSx,
    primaryButtonSx,
    destructiveButtonSx,
  } = useGroupPageStyles();

  const showEditModal = canManageGroup && editModalOpen;
  const showDeleteGroupModal = canManageGroup && deleteGroupModalOpen;
  const showLeaveModal = canLeaveGroup && modalOpen;

  return (
    <>
      <Modal
        open={showEditModal}
        onClose={() => setEditModalOpen(false)}
        aria-labelledby="edit-group-title"
        aria-describedby="edit-group-description"
      >
        <Box sx={modalCardSx}>
          <form onSubmit={handleUpdateGroup}>
            <Stack spacing={2}>
              <Typography
                id="edit-group-title"
                variant="h6"
                sx={{ fontWeight: 700, color: colors.textPrimary }}
              >
                Edit group details
              </Typography>

              <Typography
                id="edit-group-description"
                variant="body2"
                sx={{ color: colors.textSecondary }}
              >
                Update this group’s basic information.
              </Typography>

              <TextField
                fullWidth
                label="Group name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
                InputLabelProps={{ shrink: true }}
                sx={modalFieldSx}
              />

              <TextField
                fullWidth
                label="Description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                multiline
                minRows={3}
                InputLabelProps={{ shrink: true }}
                sx={modalFieldSx}
              />

              <TextField
                fullWidth
                label="Avatar URL"
                value={editAvatar}
                onChange={(e) => setEditAvatar(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={modalFieldSx}
              />

              {editGroupError && (
                <Typography
                  variant="caption"
                  sx={{ color: colors.status.error }}
                >
                  {editGroupError}
                </Typography>
              )}

              <Stack
                direction={{ xs: "column-reverse", sm: "row" }}
                spacing={1.5}
                justifyContent="flex-end"
              >
                <Button
                  variant="outlined"
                  onClick={() => setEditModalOpen(false)}
                  sx={secondaryButtonSx}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={updatingGroup}
                  sx={primaryButtonSx}
                >
                  {updatingGroup ? (
                    <CircularProgress
                      size={18}
                      sx={{ color: colors.textInverse }}
                    />
                  ) : (
                    "Save changes"
                  )}
                </Button>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Modal>

      <Modal
        open={showDeleteGroupModal}
        onClose={() => setDeleteGroupModalOpen(false)}
        aria-labelledby="delete-group-title"
        aria-describedby="delete-group-description"
      >
        <Box sx={modalCardSx}>
          <Stack spacing={2}>
            <Typography
              id="delete-group-title"
              variant="h6"
              sx={{ fontWeight: 700, color: colors.textPrimary }}
            >
              Delete this group?
            </Typography>

            <Typography
              id="delete-group-description"
              variant="body2"
              sx={{ color: colors.textSecondary, lineHeight: 1.6 }}
            >
              This will remove the group and all of its posts for all members.
              This action cannot be undone.
            </Typography>

            {deleteGroupError && (
              <Typography variant="caption" sx={{ color: colors.status.error }}>
                {deleteGroupError}
              </Typography>
            )}

            <Stack
              direction={{ xs: "column-reverse", sm: "row" }}
              spacing={1.5}
              justifyContent="flex-end"
            >
              <Button
                variant="outlined"
                onClick={() => setDeleteGroupModalOpen(false)}
                sx={secondaryButtonSx}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleDeleteGroup}
                disabled={deletingGroup}
                sx={destructiveButtonSx}
              >
                {deletingGroup ? (
                  <CircularProgress
                    size={18}
                    sx={{ color: colors.textInverse }}
                  />
                ) : (
                  "Yes, delete group"
                )}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>

      <Modal
        open={showLeaveModal}
        onClose={() => setModalOpen(false)}
        aria-labelledby="leave-group-title"
        aria-describedby="leave-group-description"
      >
        <Box sx={modalCardSx}>
          <Stack spacing={2}>
            <Typography
              id="leave-group-title"
              variant="h6"
              sx={{ fontWeight: 700, color: colors.textPrimary }}
            >
              Leave this group?
            </Typography>

            <Typography
              id="leave-group-description"
              variant="body2"
              sx={{ color: colors.textSecondary, lineHeight: 1.6 }}
            >
              You will need to join again to post, like, or comment.
            </Typography>

            {joinLeaveError && (
              <Typography variant="caption" sx={{ color: colors.status.error }}>
                {joinLeaveError}
              </Typography>
            )}

            <Stack
              direction={{ xs: "column-reverse", sm: "row" }}
              spacing={1.5}
              justifyContent="flex-end"
            >
              <Button
                variant="outlined"
                onClick={() => setModalOpen(false)}
                sx={secondaryButtonSx}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleLeaveGroup}
                disabled={leaving}
                sx={destructiveButtonSx}
              >
                {leaving ? (
                  <CircularProgress
                    size={18}
                    sx={{ color: colors.textInverse }}
                  />
                ) : (
                  "Yes, leave group"
                )}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export default GroupPageModals;
