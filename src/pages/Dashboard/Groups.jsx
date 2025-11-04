import React, { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    InputAdornment,
    Card,
    CardContent,
    Avatar,
} from "@mui/material";
import {
    Search,
} from "@mui/icons-material";

const Groups = () => {
    const [trendingSearch, setTrendingSearch] = useState("");
    const [myGroupsSearch, setMyGroupsSearch] = useState("");

    const trendingGroups = [
        { id: 1, name: "Sneaker Surgeons", members: 40, image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=300&h=300&fit=crop" },
        { id: 2, name: "Tampa Shoe Cleaners", members: 32, image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=300&h=300&fit=crop" },
        { id: 3, name: "West Coast Customs", members: 10, image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=300&h=300&fit=crop" },
        { id: 4, name: "Custom Nike Head", members: 280, image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=300&h=300&fit=crop" },
        { id: 5, name: "Sneaker Surgeons", members: 40, image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=300&h=300&fit=crop" },
        { id: 6, name: "Sneaker Surgeons", members: 40, image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=300&h=300&fit=crop" },
    ];

    const myGroups = [
        { id: 1, name: "Sneaker Surgeons", members: 40, image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=300&h=300&fit=crop" },
        { id: 2, name: "Sneaker Surgeons", members: 40, image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=300&h=300&fit=crop" },
        { id: 3, name: "Sneaker Surgeons", members: 40, image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=300&h=300&fit=crop" },
        { id: 4, name: "Sneaker Surgeons", members: 40, image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=300&h=300&fit=crop" },
        { id: 5, name: "Sneaker Surgeons", members: 40, image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=300&h=300&fit=crop" },
        { id: 6, name: "Sneaker Surgeons", members: 40, image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=300&h=300&fit=crop" },
    ];

    const handleTrendingSearch = (event) => {
        setTrendingSearch(event.target.value);
    };

    const handleMyGroupsSearch = (event) => {
        setMyGroupsSearch(event.target.value);
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#000000",
                color: "#ffffff",
                padding: { xs: 2, sm: 3, md: 4 },
                marginLeft: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                paddingTop: { xs: 4, sm: 6, md: 8 },
            }}
        >
            {/* Header Title - Outside Container */}
            <Typography
                sx={{
                    fontFamily: "Montserrat",
                    fontStyle: "normal",
                    fontWeight: 600,
                    fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4rem", lg: "4.5rem" },
                    lineHeight: { xs: "3rem", sm: "4rem", md: "4.5rem", lg: "5rem" },
                    color: "#FFD100",
                    textAlign: "center",
                    marginBottom: { xs: 4, sm: 5, md: 6 },
                }}
            >
                Groups
            </Typography>

            {/* Main Content Area - Dark Gray Background */}
            <Box
                sx={{
                    width: "100%",
                    maxWidth: { xs: "100%", sm: "900px", md: "1100px", lg: "1300px" },
                    backgroundColor: "rgb(100, 100, 100)", // RGB 100 background
                    borderRadius: { xs: "20px", sm: "25px", md: "30px" },
                    padding: { xs: 3, sm: 4, md: 5 },
                    display: "flex",
                    flexDirection: "column",
                    gap: { xs: 4, sm: 5, md: 6 },
                }}
            >

                {/* Trending Groups Section - Smaller Width, Right Aligned */}
                <Box
                    sx={{
                        width: { xs: "100%", sm: "70%", md: "60%" },
                        alignSelf: "flex-end", // Align to the right
                        backgroundColor: "#808080", // Gray background as specified
                        borderRadius: { xs: "15px", sm: "20px", md: "25px" },
                        padding: { xs: 3, sm: 4, md: 5 },
                    }}
                >
                    <Typography
                        sx={{
                            fontFamily: "Montserrat",
                            fontStyle: "normal",
                            fontWeight: 600,
                            fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2rem" },
                            lineHeight: { xs: "1.8rem", sm: "2.2rem", md: "2.4rem" },
                            color: "#FFD100",
                            marginBottom: { xs: 3, sm: 4 },
                            textAlign: "center",
                        }}
                    >
                        Trending Groups
                    </Typography>

                    {/* Search Bar */}
                    <Box sx={{
                        marginBottom: { xs: 3, sm: 4 },
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        paddingX: { xs: 1, sm: 2, md: 3 },
                    }}>
                        <TextField
                            placeholder="Search for a group"
                            value={trendingSearch}
                            onChange={handleTrendingSearch}
                            sx={{
                                width: "100%",
                                "& .MuiOutlinedInput-root": {
                                    backgroundColor: "#ffffff",
                                    borderRadius: { xs: "20px", sm: "25px", md: "30px" },
                                    "& fieldset": {
                                        border: "none",
                                    },
                                    "&:hover fieldset": {
                                        border: "none",
                                    },
                                    "&.Mui-focused fieldset": {
                                        border: "none",
                                    },
                                },
                                "& .MuiInputBase-input": {
                                    fontFamily: "Montserrat",
                                    fontSize: { xs: "14px", sm: "16px", md: "18px" },
                                    color: "#000000",
                                    padding: { xs: "12px 16px", sm: "14px 20px", md: "16px 24px" },
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search sx={{ color: "#666666", fontSize: { xs: "18px", sm: "20px" } }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    {/* Trending Groups Grid - 3x2 Layout */}
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                            gridTemplateRows: "repeat(3, 1fr)",
                            gap: { xs: 2, sm: 3, md: 4 },
                            maxWidth: "800px",
                            margin: "0 auto",
                        }}
                    >
                        {trendingGroups.map((group) => (
                            <Card
                                key={group.id}
                                sx={{
                                    backgroundColor: "#D9D9D9", // Light gray background for group cards
                                    borderRadius: { xs: "15px", sm: "20px", md: "25px" },
                                    cursor: "pointer",
                                    transition: "transform 0.2s ease-in-out",
                                    "&:hover": {
                                        transform: "translateY(-2px)",
                                    },
                                }}
                            >
                                <CardContent sx={{
                                    padding: { xs: 2, sm: 3 },
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                }}>
                                    <Box sx={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: { xs: 1.5, sm: 2 },
                                        width: "100%",
                                        minHeight: { xs: "50px", sm: "60px", md: "70px" },
                                    }}>
                                        <Box
                                            component="img"
                                            src={group.image}
                                            alt={group.name}
                                            sx={{
                                                width: { xs: "50px", sm: "60px", md: "70px" },
                                                height: { xs: "50px", sm: "60px", md: "70px" },
                                                objectFit: "cover",
                                                borderRadius: "8px",
                                                flexShrink: 0,
                                            }}
                                        />
                                        <Box sx={{
                                            flex: 1,
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "flex-start",
                                            alignItems: "flex-start",
                                            width: "100%",
                                            minHeight: "100%",
                                            paddingLeft: { xs: 0.5, sm: 1 },
                                        }}>
                                            <Typography
                                                sx={{
                                                    fontFamily: "Montserrat",
                                                    fontStyle: "normal",
                                                    fontWeight: 600,
                                                    fontSize: { xs: "14px", sm: "16px", md: "18px" },
                                                    color: "#000000",
                                                    marginBottom: { xs: 0.25, sm: 0.5 },
                                                    width: "100%",
                                                    textAlign: "left",
                                                    lineHeight: 1.2,
                                                    wordBreak: "break-word",
                                                }}
                                            >
                                                {group.name}
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    fontFamily: "Montserrat",
                                                    fontStyle: "normal",
                                                    fontWeight: 400,
                                                    fontSize: { xs: "12px", sm: "14px", md: "16px" },
                                                    color: "#666666",
                                                    width: "100%",
                                                    textAlign: "left",
                                                    lineHeight: 1.3,
                                                    wordBreak: "break-word",
                                                }}
                                            >
                                                {group.members} members
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </Box>

                {/* My Groups Section - Smaller Width, Right Aligned */}
                <Box
                    sx={{
                        width: { xs: "100%", sm: "70%", md: "60%" },
                        alignSelf: "flex-end", // Align to the right
                        backgroundColor: "#808080", // Gray background as specified
                        borderRadius: { xs: "15px", sm: "20px", md: "25px" },
                        padding: { xs: 3, sm: 4, md: 5 },
                    }}
                >
                    <Typography
                        sx={{
                            fontFamily: "Montserrat",
                            fontStyle: "normal",
                            fontWeight: 600,
                            fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2rem" },
                            lineHeight: { xs: "1.8rem", sm: "2.2rem", md: "2.4rem" },
                            color: "#FFD100",
                            marginBottom: { xs: 3, sm: 4 },
                            textAlign: "center",
                        }}
                    >
                        My Groups
                    </Typography>

                    {/* Search Bar */}
                    <Box sx={{
                        marginBottom: { xs: 3, sm: 4 },
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        paddingX: { xs: 1, sm: 2, md: 3 },
                    }}>
                        <TextField
                            placeholder="Search for a group"
                            value={myGroupsSearch}
                            onChange={handleMyGroupsSearch}
                            sx={{
                                width: "100%",
                                "& .MuiOutlinedInput-root": {
                                    backgroundColor: "#ffffff",
                                    borderRadius: { xs: "20px", sm: "25px", md: "30px" },
                                    "& fieldset": {
                                        border: "none",
                                    },
                                    "&:hover fieldset": {
                                        border: "none",
                                    },
                                    "&.Mui-focused fieldset": {
                                        border: "none",
                                    },
                                },
                                "& .MuiInputBase-input": {
                                    fontFamily: "Montserrat",
                                    fontSize: { xs: "14px", sm: "16px", md: "18px" },
                                    color: "#000000",
                                    padding: { xs: "12px 16px", sm: "14px 20px", md: "16px 24px" },
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search sx={{ color: "#666666", fontSize: { xs: "18px", sm: "20px" } }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    {/* My Groups Grid - 3x2 Layout */}
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                            gridTemplateRows: "repeat(3, 1fr)",
                            gap: { xs: 2, sm: 3, md: 4 },
                            maxWidth: "800px",
                            margin: "0 auto",
                        }}
                    >
                        {myGroups.map((group) => (
                            <Card
                                key={group.id}
                                sx={{
                                    backgroundColor: "#D9D9D9", // Light gray background for group cards
                                    borderRadius: { xs: "15px", sm: "20px", md: "25px" },
                                    cursor: "pointer",
                                    transition: "transform 0.2s ease-in-out",
                                    "&:hover": {
                                        transform: "translateY(-2px)",
                                    },
                                }}
                            >
                                <CardContent sx={{
                                    padding: { xs: 2, sm: 3 },
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                }}>
                                    <Box sx={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: { xs: 1.5, sm: 2 },
                                        width: "100%",
                                        minHeight: { xs: "50px", sm: "60px", md: "70px" },
                                    }}>
                                        <Box
                                            component="img"
                                            src={group.image}
                                            alt={group.name}
                                            sx={{
                                                width: { xs: "50px", sm: "60px", md: "70px" },
                                                height: { xs: "50px", sm: "60px", md: "70px" },
                                                objectFit: "cover",
                                                borderRadius: "8px",
                                                flexShrink: 0,
                                            }}
                                        />
                                        <Box sx={{
                                            flex: 1,
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "flex-start",
                                            alignItems: "flex-start",
                                            width: "100%",
                                            minHeight: "100%",
                                            paddingLeft: { xs: 0.5, sm: 1 },
                                        }}>
                                            <Typography
                                                sx={{
                                                    fontFamily: "Montserrat",
                                                    fontStyle: "normal",
                                                    fontWeight: 600,
                                                    fontSize: { xs: "14px", sm: "16px", md: "18px" },
                                                    color: "#000000",
                                                    marginBottom: { xs: 0.25, sm: 0.5 },
                                                    width: "100%",
                                                    textAlign: "left",
                                                    lineHeight: 1.2,
                                                    wordBreak: "break-word",
                                                }}
                                            >
                                                {group.name}
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    fontFamily: "Montserrat",
                                                    fontStyle: "normal",
                                                    fontWeight: 400,
                                                    fontSize: { xs: "12px", sm: "14px", md: "16px" },
                                                    color: "#666666",
                                                    width: "100%",
                                                    textAlign: "left",
                                                    lineHeight: 1.3,
                                                    wordBreak: "break-word",
                                                }}
                                            >
                                                {group.members} members
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Groups;