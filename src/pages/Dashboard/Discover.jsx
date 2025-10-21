import React, { useState } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Avatar,
    Button,
    Grid,
    IconButton,
    Badge,
} from "@mui/material";
import {
    ThumbUpOutlined,
    ChatBubbleOutlineOutlined,
    ShareOutlined,
    Add,
} from "@mui/icons-material";

const MySociety = () => {
    const [posts, setPosts] = useState([
        {
            id: 1,
            username: "Username",
            caption: "Just got some new kicks to customize! Can't wait to show the after!",
            images: [
                "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop",
                "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=300&h=300&fit=crop"
            ],
            likes: 20,
            comments: 10,
            shares: 11
        },
        {
            id: 2,
            username: "Username",
            caption: "Just got some new kicks to customize! Can't wait to show the after!",
            images: [
                "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop",
                "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=300&h=300&fit=crop"
            ],
            likes: 20,
            comments: 10,
            shares: 11
        }
    ]);

    const handleLike = (postId) => {
        setPosts(posts.map(post =>
            post.id === postId
                ? { ...post, likes: post.likes + 1 }
                : post
        ));
    };

    const handleComment = (postId) => {
        // Handle comment functionality
        console.log("Comment on post:", postId);
    };

    const handleShare = (postId) => {
        // Handle share functionality
        console.log("Share post:", postId);
    };

    const handleCreatePost = () => {
        // Handle create post functionality
        console.log("Create new post");
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#000000",
                color: "#ffffff",
                padding: { xs: 2, sm: 3, md: 4 },
                marginLeft: 0, // Full width layout
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                paddingTop: { xs: 4, sm: 6, md: 8 },
            }}
        >
            {/* Header Section */}
            <Box sx={{
                textAlign: "center",
                marginBottom: { xs: 3, sm: 4, md: 6 },
                width: "100%",
                maxWidth: { xs: "100%", sm: "600px", md: "800px" }
            }}>
                {/* My Society Title */}
                <Typography
                    sx={{
                        fontFamily: "Montserrat",
                        fontStyle: "normal",
                        fontWeight: 600,
                        fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4rem", lg: "4.5rem" },
                        lineHeight: { xs: "3rem", sm: "4rem", md: "4.5rem", lg: "5rem" },
                        color: "#FFD100",
                        marginBottom: { xs: 1, sm: 2 },
                    }}
                >
                    My Society
                </Typography>

                {/* My Posts Subtitle */}
                <Typography
                    sx={{
                        fontFamily: "Montserrat",
                        fontStyle: "normal",
                        fontWeight: 600,
                        fontSize: { xs: "1.5rem", sm: "2rem", md: "2.25rem", lg: "2.5rem" },
                        lineHeight: { xs: "1.8rem", sm: "2.4rem", md: "2.7rem", lg: "3rem" },
                        color: "#FFFFFF",
                    }}
                >
                    My Posts
                </Typography>
            </Box>

            {/* Posts Container */}
            <Box sx={{
                width: "100%",
                maxWidth: { xs: "100%", sm: "500px", md: "600px", lg: "700px" },
                display: "flex",
                flexDirection: "column",
                gap: { xs: 3, sm: 4, md: 5 },
                marginBottom: { xs: 8, sm: 10, md: 12 }, // Space for create post button
            }}>
                {posts.map((post, index) => (
                    <Box
                        key={post.id}
                        sx={{
                            width: "100%",
                            backgroundColor: "#D9D9D9",
                            borderRadius: { xs: "20px", sm: "25px", md: "30px", lg: "34px" },
                            padding: { xs: 2, sm: 3, md: 4 },
                            position: "relative",
                        }}
                    >
                        {/* User Info Section */}
                        <Box sx={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: { xs: 2, sm: 3 },
                            gap: { xs: 2, sm: 3 }
                        }}>
                            {/* Avatar */}
                            <Box
                                sx={{
                                    width: { xs: "32px", sm: "36px", md: "40px" },
                                    height: { xs: "32px", sm: "36px", md: "40px" },
                                    backgroundColor: "#000000",
                                    borderRadius: "50%",
                                    flexShrink: 0,
                                }}
                            />

                            {/* Username */}
                            <Typography
                                sx={{
                                    fontFamily: "Montserrat",
                                    fontStyle: "normal",
                                    fontWeight: 400,
                                    fontSize: { xs: "14px", sm: "15px", md: "16px" },
                                    lineHeight: { xs: "18px", sm: "19px", md: "20px" },
                                    color: "#000000",
                                }}
                            >
                                {post.username}
                            </Typography>
                        </Box>

                        {/* Caption */}
                        <Typography
                            sx={{
                                fontFamily: "Montserrat",
                                fontStyle: "normal",
                                fontWeight: 400,
                                fontSize: { xs: "14px", sm: "15px", md: "16px" },
                                lineHeight: { xs: "18px", sm: "19px", md: "20px" },
                                color: "#000000",
                                marginBottom: { xs: 3, sm: 4 },
                                wordWrap: "break-word",
                            }}
                        >
                            {post.caption}
                        </Typography>

                        {/* Images Container */}
                        <Box sx={{
                            display: "flex",
                            gap: { xs: 2, sm: 3 },
                            marginBottom: { xs: 3, sm: 4 },
                            justifyContent: "center",
                        }}>
                            <Box
                                component="img"
                                src={post.images[0]}
                                alt="Post image 1"
                                sx={{
                                    width: { xs: "40%", sm: "45%", md: "50%" },
                                    height: { xs: "120px", sm: "140px", md: "160px" },
                                    objectFit: "cover",
                                    borderRadius: { xs: "8px", sm: "10px", md: "12px" },
                                    border: "2px solid #e0e0e0",
                                }}
                            />
                            <Box
                                component="img"
                                src={post.images[1]}
                                alt="Post image 2"
                                sx={{
                                    width: { xs: "40%", sm: "45%", md: "50%" },
                                    height: { xs: "120px", sm: "140px", md: "160px" },
                                    objectFit: "cover",
                                    borderRadius: { xs: "8px", sm: "10px", md: "12px" },
                                    border: "2px solid #e0e0e0",
                                }}
                            />
                        </Box>

                        {/* Engagement Stats */}
                        <Box sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: { xs: 2, sm: 3 },
                            flexWrap: "wrap",
                            gap: { xs: 1, sm: 2 }
                        }}>
                            <Typography
                                sx={{
                                    fontFamily: "Montserrat",
                                    fontStyle: "normal",
                                    fontWeight: 400,
                                    fontSize: { xs: "11px", sm: "12px" },
                                    lineHeight: { xs: "14px", sm: "15px" },
                                    color: "#000000",
                                }}
                            >
                                {post.likes} likes
                            </Typography>
                            <Typography
                                sx={{
                                    fontFamily: "Montserrat",
                                    fontStyle: "normal",
                                    fontWeight: 400,
                                    fontSize: { xs: "11px", sm: "12px" },
                                    lineHeight: { xs: "14px", sm: "15px" },
                                    color: "#000000",
                                }}
                            >
                                {post.comments} comments
                            </Typography>
                            <Typography
                                sx={{
                                    fontFamily: "Montserrat",
                                    fontStyle: "normal",
                                    fontWeight: 400,
                                    fontSize: { xs: "11px", sm: "12px" },
                                    lineHeight: { xs: "14px", sm: "15px" },
                                    color: "#000000",
                                }}
                            >
                                {post.shares} shares
                            </Typography>
                        </Box>

                        {/* Divider Line */}
                        <Box
                            sx={{
                                width: "100%",
                                height: "2px",
                                backgroundColor: "#000000",
                                marginBottom: { xs: 2, sm: 3 },
                            }}
                        />

                        {/* Action Buttons */}
                        <Box sx={{
                            display: "flex",
                            justifyContent: "space-around",
                            gap: { xs: 1, sm: 2 }
                        }}>
                            <Button
                                onClick={() => handleLike(post.id)}
                                sx={{
                                    fontFamily: "Montserrat",
                                    fontStyle: "normal",
                                    fontWeight: 400,
                                    fontSize: { xs: "14px", sm: "15px", md: "16px" },
                                    lineHeight: { xs: "18px", sm: "19px", md: "20px" },
                                    color: "#000000",
                                    textTransform: "none",
                                    minWidth: "auto",
                                    padding: { xs: "4px 8px", sm: "6px 12px" },
                                    "&:hover": {
                                        backgroundColor: "rgba(0,0,0,0.1)",
                                    },
                                }}
                            >
                                Like
                            </Button>
                            <Button
                                onClick={() => handleComment(post.id)}
                                sx={{
                                    fontFamily: "Montserrat",
                                    fontStyle: "normal",
                                    fontWeight: 400,
                                    fontSize: { xs: "14px", sm: "15px", md: "16px" },
                                    lineHeight: { xs: "18px", sm: "19px", md: "20px" },
                                    color: "#000000",
                                    textTransform: "none",
                                    minWidth: "auto",
                                    padding: { xs: "4px 8px", sm: "6px 12px" },
                                    "&:hover": {
                                        backgroundColor: "rgba(0,0,0,0.1)",
                                    },
                                }}
                            >
                                Comment
                            </Button>
                            <Button
                                onClick={() => handleShare(post.id)}
                                sx={{
                                    fontFamily: "Montserrat",
                                    fontStyle: "normal",
                                    fontWeight: 400,
                                    fontSize: { xs: "14px", sm: "15px", md: "16px" },
                                    lineHeight: { xs: "18px", sm: "19px", md: "20px" },
                                    color: "#000000",
                                    textTransform: "none",
                                    minWidth: "auto",
                                    padding: { xs: "4px 8px", sm: "6px 12px" },
                                    "&:hover": {
                                        backgroundColor: "rgba(0,0,0,0.1)",
                                    },
                                }}
                            >
                                Share
                            </Button>
                        </Box>
                    </Box>
                ))}
            </Box>

            {/* Create Post Button - Fixed at bottom center */}
            <Box
                sx={{
                    position: "fixed",
                    bottom: { xs: 20, sm: 30, md: 40 },
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 1000,
                }}
            >
                <Button
                    onClick={handleCreatePost}
                    sx={{
                        backgroundColor: "#FFD100",
                        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                        borderRadius: { xs: "20px", sm: "25px", md: "30px" },
                        fontFamily: "Montserrat",
                        fontStyle: "normal",
                        fontWeight: 800,
                        fontSize: { xs: "16px", sm: "18px", md: "20px" },
                        lineHeight: { xs: "20px", sm: "22px", md: "24px" },
                        color: "#000000",
                        textTransform: "none",
                        padding: { xs: "10px 20px", sm: "12px 24px", md: "14px 28px" },
                        minWidth: { xs: "180px", sm: "200px", md: "220px" },
                        "&:hover": {
                            backgroundColor: "#E6BC00",
                            boxShadow: "0px 6px 8px rgba(0, 0, 0, 0.3)",
                        },
                    }}
                >
                    Create Post
                </Button>
            </Box>
        </Box>
    );
};

export default MySociety;
