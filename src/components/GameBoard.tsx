import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { ImageRow } from "./ImageRow";
import { ImageItem } from "../types/game";
import { vietnameseImages, americaImages } from "../data";
import { shuffle } from "../functions/shuffleArray";

/* Hiệu ứng xuất hiện từ giữa */
const fadeInScale = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.5);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.2);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`;

/* Lớp phủ nền mờ */
const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
  z-index: 5;
`;

/* Game Container */
const GameContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 50px;
  background-color: #f0f0f0;
  position: relative;
`;

/* Căn giữa hai hàng ảnh */
const ImageRowsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 100px;
  justify-content: center;
  align-items: center;
  max-width: 95vw;
  overflow: hidden;
  position: relative;
`;

/* Cho phép kéo để cuộn */
const ScrollableRow = styled.div`
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  width: 100%;
  max-width: 95vw;
  cursor: grab;
  user-select: none;
  scroll-behavior: smooth;
  &::-webkit-scrollbar {
    display: none;
  }
`;

/* Container chứa ảnh khớp */
const MatchedContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 20px;
  align-items: center;
  padding: 20px;
  background: rgba(255, 255, 255, 1);
  border-radius: 10px;
  z-index: 10;
  animation: ${fadeInScale} 1s ease-in-out;
  transition: opacity 1s ease-out;
  cursor: pointer;
`;

const MatchedImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MatchedImage = styled.img`
  width: 200px;
  height: 200px;
  object-fit: cover;
  border: 5px solid gold;
  border-radius: 10px;
`;

const MatchedText = styled.p`
  margin-top: 5px;
  font-size: 18px;
  font-weight: bold;
  color: black;
`;

const NotMatchedContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 200px;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 1);
  padding: 20px;
  border-radius: 10px;
  z-index: 10;
  animation: ${fadeInScale} 0.5s ease-in-out;
`;

const NotMatchedIcon = styled.div`
  font-size: 150px;
  color: red;
`;

/* Lấy số khớp từ tên ảnh */
const parseImageName = (name: string): number => {
  const match = name.match(/-(\d+)\.jpg$/);
  return match ? parseInt(match[1], 10) : NaN;
};

/* Khởi tạo danh sách ảnh */
const initImages = (): { topRow: ImageItem[]; bottomRow: ImageItem[] } => ({
  topRow: shuffle(vietnameseImages).map((image, index) => ({
    id: `${index}-${parseImageName(image.src)}`,
    src: image.src,
    name: image.name,
    isSelected: false,
    isMatched: false,
  })),
  bottomRow: shuffle(americaImages).map((image, index) => ({
    id: `${index}-${parseImageName(image.src)}`,
    src: image.src,
    name: image.name,
    isSelected: false,
    isMatched: false,
  })),
});

const GameBoard: React.FC = () => {
  const { topRow: initialTopRow, bottomRow: initialBottomRow } = initImages();
  const [topRow, setTopRow] = useState<ImageItem[]>(initialTopRow);
  const [bottomRow, setBottomRow] = useState<ImageItem[]>(initialBottomRow);
  const [selectedTop, setSelectedTop] = useState<string | null>(null);
  const [selectedBottom, setSelectedBottom] = useState<string | null>(null);
  const [matchedPair, setMatchedPair] = useState<{
    top: ImageItem;
    bottom: ImageItem;
  } | null>(null);
  const [notMatched, setNotMatched] = useState<boolean>(false);

  /* Xử lý chọn ảnh */
  const handleImageClick = (id: string, row: "top" | "bottom") => {
    if (row === "top") {
      setSelectedTop(id);
    } else {
      setSelectedBottom(id);
    }
  };

  /* Xác nhận ghép cặp */
  const handleAutoConfirm = React.useCallback(
    (topId: string, bottomId: string) => {
      const topImage = topRow.find((img) => img.id === topId);
      const bottomImage = bottomRow.find((img) => img.id === bottomId);

      if (topImage && bottomImage) {
        if (parseImageName(topImage.src) === parseImageName(bottomImage.src)) {
          // Nếu match, hiển thị cặp ảnh
          setMatchedPair({ top: topImage, bottom: bottomImage });
        } else {
          setNotMatched(true);

          setTimeout(() => {
            setNotMatched(false);
            setSelectedTop(null);
            setSelectedBottom(null);
          }, 3000);
        }
      }
    },
    [bottomRow, topRow]
  );

  const handleBackdropClick = () => {
    if (matchedPair) {
      // Xóa ảnh đã match khỏi danh sách
      setTopRow((prev) => prev.filter((img) => img.id !== matchedPair.top.id));
      setBottomRow((prev) =>
        prev.filter((img) => img.id !== matchedPair.bottom.id)
      );
      setMatchedPair(null);
    }
  };

  /* Khi cả hai ảnh được chọn, kiểm tra match */
  useEffect(() => {
    if (selectedTop && selectedBottom) {
      setTimeout(() => {
        handleAutoConfirm(selectedTop, selectedBottom);
      }, 1000);
    }
  }, [selectedTop, selectedBottom, handleAutoConfirm]);

  return (
    <>
      {(matchedPair || notMatched) && (
        <Backdrop onClick={handleBackdropClick} />
      )}

      <GameContainer>
        {matchedPair && (
          <MatchedContainer>
            <MatchedImageContainer>
              <MatchedImage src={matchedPair.top.src} alt="Matched Top" />
              <MatchedText>{matchedPair.top.name}</MatchedText>
            </MatchedImageContainer>
            <MatchedImageContainer>
              <MatchedImage src={matchedPair.bottom.src} alt="Matched Bottom" />
              <MatchedText>{matchedPair.bottom.name}</MatchedText>
            </MatchedImageContainer>
          </MatchedContainer>
        )}

        {notMatched && (
          <NotMatchedContainer>
            <NotMatchedIcon>✖</NotMatchedIcon>
          </NotMatchedContainer>
        )}

        <ImageRowsWrapper>
          <ScrollableRow>
            <ImageRow
              images={topRow}
              onImageClick={(id) => handleImageClick(id, "top")}
              selectedImage={selectedTop}
            />
          </ScrollableRow>
          <ScrollableRow>
            <ImageRow
              images={bottomRow}
              onImageClick={(id) => handleImageClick(id, "bottom")}
              selectedImage={selectedBottom}
            />
          </ScrollableRow>
        </ImageRowsWrapper>
      </GameContainer>
    </>
  );
};

export default GameBoard;
