import React, { useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Box,
} from "@mui/material";
import Rating from "@mui/material/Rating";

const ReviewSystem = () => {
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState("");

    const handleSubmit = () => {
        if (rating > 0 && reviewText.trim() !== "") {
            const newReview = {
                id: Date.now(),
                rating,
                text: reviewText,
            };
            setReviews([newReview, ...reviews]);
            setRating(0);
            setReviewText("");
        }
    };

    return (
        <Box sx={{ maxWidth: 500, margin: "auto", mt: 5 }}>
            <Card sx={{ padding: 2 }}>
                <Typography variant="h5" gutterBottom>
                    Leave a Review
                </Typography>
                <Rating
                    value={rating}
                    onChange={(event, newValue) => setRating(newValue)}
                    precision={0.5}
                />
                <TextField
                    fullWidth
                    multiline
                    rows={3}
                    variant="outlined"
                    label="Write your review"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    sx={{ my: 2 }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={rating === 0 || reviewText.trim() === ""}
                >
                    Submit Review
                </Button>
            </Card>

            <Box sx={{ mt: 3 }}>
                {reviews.map((review) => (
                    <Card key={review.id} sx={{ my: 2, padding: 2 }}>
                        <CardContent>
                            <Rating value={review.rating} readOnly precision={0.5} />
                            <Typography variant="body1" sx={{ mt: 1 }}>
                                {review.text}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Box>
    );
};

export default ReviewSystem;
