import {
  Box,
  Typography,
  Button,
  TextField,
  Modal,
  Stack,
  CircularProgress,
} from "@mui/material";
import {
  modalCardSx,
  modalFieldSx,
  secondaryButtonSx,
  primaryButtonSx,
  destructiveButtonSx,
} from "../styles/groupPageStyles";

const GroupPageModals = ({
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
  return (
    <>
      <Modal
        open={editModalOpen}
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
                sx={{ fontWeight: 700 }}
              >
                Edit group details
              </Typography>

              <Typography
                id="edit-group-description"
                variant="body2"
                sx={{ color: "#aaa" }}
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
                <Typography variant="caption" color="error.main">
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
                    <CircularProgress size={18} sx={{ color: "#111" }} />
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
        open={deleteGroupModalOpen}
        onClose={() => setDeleteGroupModalOpen(false)}
        aria-labelledby="delete-group-title"
        aria-describedby="delete-group-description"
      >
        <Box sx={modalCardSx}>
          <Stack spacing={2}>
            <Typography
              id="delete-group-title"
              variant="h6"
              sx={{ fontWeight: 700 }}
            >
              Delete this group?
            </Typography>

            <Typography
              id="delete-group-description"
              variant="body2"
              sx={{ color: "#aaa", lineHeight: 1.6 }}
            >
              This will remove the group and all of its posts for all members.
              This action cannot be undone.
            </Typography>

            {deleteGroupError && (
              <Typography variant="caption" color="error.main">
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
                  <CircularProgress size={18} sx={{ color: "#fff" }} />
                ) : (
                  "Yes, delete group"
                )}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="leave-group-title"
        aria-describedby="leave-group-description"
      >
        <Box sx={modalCardSx}>
          <Stack spacing={2}>
            <Typography
              id="leave-group-title"
              variant="h6"
              sx={{ fontWeight: 700 }}
            >
              Leave this group?
            </Typography>

            <Typography
              id="leave-group-description"
              variant="body2"
              sx={{ color: "#aaa", lineHeight: 1.6 }}
            >
              You will need to join again to post, like, or comment.
            </Typography>

            {joinLeaveError && (
              <Typography variant="caption" color="error.main">
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
                  <CircularProgress size={18} sx={{ color: "#fff" }} />
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
