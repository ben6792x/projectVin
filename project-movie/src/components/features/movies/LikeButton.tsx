// src/components/LikeButton.tsx
import React, { useState } from 'react';
import {movieService} from "@/service/movieService";
import {HeartFilled, HeartOutlined} from "@ant-design/icons";
import {message} from "antd";


interface LikeButtonProps {
    slug: string;
    initialLiked: boolean;
    onLikeChange?: (isLiked: boolean) => void;
}

const LikeButton: React.FC<LikeButtonProps> = ({
                                                   slug,
                                                   initialLiked,
                                                   onLikeChange
                                               }) => {
    const [isLiked, setIsLiked] = useState(initialLiked);
    const [isLoading, setIsLoading] = useState(false);

    const handleToggleLike = async () => {
        if (!localStorage.getItem('token')) {
            message.error('Please login to like movies');
            return;
        }

        setIsLoading(true);
        try {
            const liked = await movieService.toggleLike(slug);
            setIsLiked(liked);
            onLikeChange?.(liked);
            message.success(liked ? 'Added to favorites' : 'Removed from favorites');
        } catch (error: any) {
            // API instance sẽ tự động xử lý lỗi 401
            if (error.response?.status !== 401) {
                message.error('Failed to update like status');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggleLike}
            disabled={isLoading}
            className="like-button"
        >
            {isLiked ? (
                <HeartFilled style={{ color: '#ff4d4f' }} />
            ) : (
                <HeartOutlined />
            )}
        </button>
    );
};

export default LikeButton;