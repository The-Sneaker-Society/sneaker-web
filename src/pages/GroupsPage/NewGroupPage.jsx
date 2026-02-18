import { useState, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Divider,
  TextField,
  Modal,
  Stack,
  AvatarGroup,
} from "@mui/material";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";

const GET_GROUP = gql`
  query GetGroup($id: ID!) {
    groupById(id: $id) {
      id
      name
      description
      avatar
      members {
        id
        firstName
        lastName
        email
      }
      createdAt
    }
  }
`;

const NewGroupPage = () => {
  const { id } = useParams();
  const skip = !id;

  const { data, loading, error } = useQuery(GET_GROUP, {
    variables: { id },
    skip,
  });

  const group = data?.groupById;

  const [isJoined, setIsJoined] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  if (loading) {
    return (
      <Box sx={{ bgcolor: "#e4e4e4", minHeight: "100vh", p: 3 }}>
        <Typography>Loading group...</Typography>
      </Box>
    );
  }

  if (error || !group) {
    return (
      <Box sx={{ bgcolor: "#e4e4e4", minHeight: "100vh", p: 3 }}>
        <Typography color="error">Unable to load group.</Typography>
      </Box>
    );
  }

  const memberCount = group.members?.length || 0;

  const handleLeaveGroup = () => {
    setModalOpen(false);
    setIsJoined(false);
  };

  const fileInputRef = useRef(null);
  const [imageSrcs, setImageSrcs] = useState([]);
  const [postContent, setPostContent] = useState("");

  const handleFileInputChange = (event) => {
    const files = event.target.files;
    if (files.length) {
      const urls = Array.from(files).map((file) => URL.createObjectURL(file));
      setImageSrcs(urls);
    }
  };

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handlePostSubmit = () => {
    // Here you'd send postContent and imageSrcs to backend
    console.log("Post content:", postContent);
    console.log("Images:", imageSrcs);
    // Clear after posting
    setPostContent("");
    setImageSrcs([]);
  };

  return (
    <Box sx={{ bgcolor: "#e4e4e4", minHeight: "100vh", p: 3 }}>
      {/* Header */}
      <Box
        sx={{ bgcolor: "#000", color: "#fff", borderRadius: 2, p: 3, mb: 2 }}
      >
        <Typography variant="h4" fontWeight={600}>
          {group.name}
        </Typography>
        <Typography fontWeight={600}>{memberCount} members</Typography>

        {/* Avatars of members */}
        <Stack direction="row" spacing={-1} sx={{ mt: 1 }}>
          <AvatarGroup max={5}>
            {group.members.map((member) => (
              <Avatar
                key={member.id}
                alt={`${member.firstName} ${member.lastName}`}
                sx={{ border: "2px solid #fff", width: 32, height: 32 }}
              >
                {member.firstName?.[0]}
              </Avatar>
            ))}
          </AvatarGroup>
        </Stack>

        {isJoined && (
          <Button
            sx={{
              mt: 2,
              backgroundColor: "#FFD100",
              color: "black",
            }}
            variant="contained"
            onClick={() => setModalOpen(true)}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {isHovering ? "Leave Group" : "Joined"}
          </Button>
        )}
        {!isJoined && (
          <Button
            sx={{ mt: 2, backgroundColor: "#FFD100", color: "black" }}
            variant="contained"
            onClick={() => setIsJoined(true)}
          >
            Joined
          </Button>
        )}
      </Box>

      {/* Leave Group Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography>Are you sure you want to leave this group?</Typography>
          <Button
            onClick={handleLeaveGroup}
            sx={{ mt: 2, mr: 2 }}
            color="primary"
            variant="contained"
          >
            Yes, leave group
          </Button>
          <Button
            onClick={() => setModalOpen(false)}
            sx={{ mt: 2 }}
            color="inherit"
            variant="outlined"
          >
            Cancel
          </Button>
        </Box>
      </Modal>

      {/* Write a post */}
      {isJoined && (
        <Box
          sx={{
            bgcolor: "black",
            p: 2,
            borderRadius: 2,
            mb: 2,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <TextField
            variant="filled"
            fullWidth
            placeholder="Write a post"
            sx={{ bgcolor: "gray" }}
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            multiline
          />
          <InsertPhotoIcon
            onClick={handleIconClick}
            sx={{ cursor: "pointer", color: "#fff" }}
          />
          <Button
            variant="contained"
            onClick={handlePostSubmit}
            disabled={!postContent.trim() && imageSrcs.length === 0}
            sx={{ backgroundColor: "blue", whiteSpace: "nowrap" }}
          >
            Post
          </Button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileInputChange}
            multiple
          />
        </Box>
      )}

      {/* Add image preview right here: */}
      {imageSrcs.length > 0 && (
        <Stack direction="row" spacing={2} mb={2}>
          {imageSrcs.map((src, i) => (
            <Box
              component="img"
              key={i}
              src={src}
              alt={`preview-${i}`}
              sx={{
                width: 90,
                height: 90,
                borderRadius: 1,
                objectFit: "cover",
              }}
            />
          ))}
        </Stack>
      )}

      {/* Posts */}
      <Box>
        {mockPosts.length === 0 ? (
          <Typography textAlign="center" color="textSecondary">
            No posts yet
          </Typography>
        ) : (
          mockPosts.map((post) => (
            <Box
              key={post.id}
              sx={{ bgcolor: "black", p: 2, borderRadius: 2, mb: 2 }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar src={post.user.avatar} />
                <Typography fontWeight={600}>{post.user.name}</Typography>
              </Stack>
              <Typography mt={1}>{post.content}</Typography>
              {post.images && post.images.length > 0 && (
                <Stack direction="row" spacing={2} mt={2}>
                  {post.images.map((img, i) => (
                    <Box
                      component="img"
                      key={i}
                      src={img}
                      sx={{
                        width: 90,
                        height: 90,
                        borderRadius: 1,
                        objectFit: "cover",
                      }}
                    />
                  ))}
                </Stack>
              )}
              <Divider sx={{ my: 2 }} />
              <Stack direction="row" justifyContent="space-between">
                <Typography fontSize={14}>{post.likes} likes</Typography>
                <Typography fontSize={14}>{post.comments} comments</Typography>
                <Typography fontSize={14}>{post.shares} shares</Typography>
              </Stack>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

export default NewGroupPage;
