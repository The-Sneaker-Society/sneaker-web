import React, { useState, useRef } from "react";
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

// Dummy group data (unchanged)
const dummyGroup = {
  name: "Sneakerheads United",
  description: "A group for sneaker customizers and collectors.",
  avatar: "",
  members: [
    { id: 1, name: "Jane" },
    { id: 2, name: "John" },
    { id: 3, name: "Jane" },
    { id: 4, name: "John" },
    { id: 5, name: "Jane" },
    { id: 6, name: "John" },
    { id: 7, name: "Jane" },
    { id: 8, name: "John" },
    { id: 9, name: "Jane" },
    { id: 10, name: "John" },
    { id: 11, name: "Jane" },
    { id: 12, name: "John" },
  ],
};

// Posts from MySociety for consistency
const mysocietyPosts = [
  {
    id: 1,
    username: "Username",
    caption:
      "Just got some new kicks to customize! Can't wait to show the after!",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=300&h=300&fit=crop",
    ],
    likes: 20,
    comments: 10,
    shares: 11,
  },
  {
    id: 2,
    username: "Username",
    caption:
      "Just got some new kicks to customize! Can't wait to show the after!",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=300&h=300&fit=crop",
    ],
    likes: 20,
    comments: 10,
    shares: 11,
  },
];

// Mapped to match the NewGroupPage post data shape
const mockPosts = mysocietyPosts.map((post) => ({
  id: post.id,
  user: { avatar: "", name: post.username },
  content: post.caption,
  images: post.images,
  likes: post.likes,
  comments: post.comments,
  shares: post.shares,
}));

const NewGroupPage = () => {
  const [isJoined, setIsJoined] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

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
          {dummyGroup.name}
        </Typography>
        <Typography fontWeight={600}>
          {dummyGroup.members.length} members
        </Typography>

        {/* Avatars of members */}
        <Stack direction="row" spacing={-1} sx={{ mt: 1 }}>
          <AvatarGroup max={5}>
            {dummyGroup.members.map((member) => (
              <Avatar
                key={member.id}
                src={member.avatar}
                alt={member.name}
                sx={{ border: "2px solid #fff", width: 32, height: 32 }}
              />
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
