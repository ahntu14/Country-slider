import React, { useRef, useState } from "react";
import styled from "styled-components";
import ImageCard from "./ImageCard";
import { ImageItem } from "../types/game";

interface ImageRowProps {
  images: ImageItem[];
  onImageClick: (id: string) => void;
  selectedImage: string | null; // Định danh ảnh đang được chọn
}

const RowContainer = styled.div`
  width: 90%; /* Mở rộng chiều rộng */
  overflow-x: auto; /* Bật cuộn ngang */
  white-space: nowrap;
  display: flex;
  gap: 10px;
  padding: 10px;
  cursor: grab;
  user-select: none;
  scroll-behavior: smooth;

  &:active {
    cursor: grabbing;
  }

  &::-webkit-scrollbar {
    display: none; /* Ẩn thanh cuộn */
  }
`;

export const ImageRow: React.FC<ImageRowProps> = ({
  images,
  onImageClick,
  selectedImage,
}) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasMoved, setHasMoved] = useState(false); // Xác định xem có kéo không

  // Xử lý khi bắt đầu kéo chuột
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!rowRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - rowRef.current.offsetLeft);
    setScrollLeft(rowRef.current.scrollLeft);
    setHasMoved(false);
  };

  // Xử lý kéo chuột
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !rowRef.current) return;
    const x = e.pageX - rowRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    rowRef.current.scrollLeft = scrollLeft - walk;
    if (Math.abs(walk) > 5) {
      setHasMoved(true); // Nếu di chuyển nhiều hơn 5px => xác định là kéo
    }
  };

  // Khi nhả chuột
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Hỗ trợ cảm ứng trên mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!rowRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - rowRef.current.offsetLeft);
    setScrollLeft(rowRef.current.scrollLeft);
    setHasMoved(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !rowRef.current) return;
    const x = e.touches[0].pageX - rowRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    rowRef.current.scrollLeft = scrollLeft - walk;
    if (Math.abs(walk) > 5) {
      setHasMoved(true);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <RowContainer
      ref={rowRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {images.map((image) => (
        <ImageCard
          key={image.id}
          src={image.src}
          isSelected={selectedImage === image.id}
          isMatched={image.isMatched}
          onClick={() => {
            if (!hasMoved) onImageClick(image.id);
          }}
        />
      ))}
    </RowContainer>
  );
};
