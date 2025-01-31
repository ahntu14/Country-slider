import React from "react";
import styled from "styled-components";

interface ImageCardProps {
  src: string;
  isSelected: boolean;
  isMatched: boolean;
  onClick: () => void;
}

const Card = styled.div<{ isSelected: boolean; isMatched: boolean }>`
  border: 3px solid
    ${({ isMatched, isSelected }) =>
      isMatched ? "green" : isSelected ? "blue" : "transparent"};
  border-radius: 5px;
  padding: 5px;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const Image = styled.img`
  width: 200px;
  height: 200px;
  object-fit: cover;
`;

const ImageCard: React.FC<ImageCardProps> = ({
  src,
  isSelected,
  isMatched,
  onClick,
}) => {
  return (
    <Card isSelected={isSelected} isMatched={isMatched} onClick={onClick}>
      <Image src={src} alt="game-item" />
    </Card>
  );
};

export default ImageCard;
