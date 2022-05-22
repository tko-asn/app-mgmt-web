import type { MouseEvent, VFC } from 'react';
import { useState } from 'react';
import styled from 'styled-components';

const DEFAULT_SIZE = '100px';

export type IconProps = {
  className?: string;
  handleClick?: (event: MouseEvent<HTMLDivElement>) => void;
  imageSize?: string;
  src?: string;
};

const Icon: VFC<IconProps> = ({ className, handleClick, imageSize, src }) => {
  const isButton = typeof handleClick === 'function';
  const [isShowOverlay, setIsShowOverlay] = useState(false);

  return (
    <StyledDiv
      className={className}
      imageSize={imageSize}
      isPointer={isButton}
      onClick={isButton ? handleClick : () => {}}
      onMouseEnter={() => setIsShowOverlay(true)}
      onMouseLeave={() => setIsShowOverlay(false)}
    >
      <StyledImage alt="" imageSize={imageSize} src={src} />
      {isButton && isShowOverlay && <StyledOverlay>編集</StyledOverlay>}
    </StyledDiv>
  );
};

const StyledDiv = styled.div<Pick<IconProps, 'imageSize'> & { isPointer: boolean }>`
  background: silver;
  border-radius: 50%;
  cursor: ${(props) => (props.isPointer ? 'pointer' : 'default')};
  display: inline-block;
  height: ${(props) => (props.imageSize ? props.imageSize : DEFAULT_SIZE)};
  overflow: hidden;
  position: relative;
  width: ${(props) => (props.imageSize ? props.imageSize : DEFAULT_SIZE)};
`;

const StyledImage = styled.img<Pick<IconProps, 'imageSize'>>`
  height: ${(props) => (props.imageSize ? props.imageSize : DEFAULT_SIZE)};
  object-fit: cover;
  width: ${(props) => (props.imageSize ? props.imageSize : DEFAULT_SIZE)};
`;

const StyledOverlay = styled.div`
  background: rgba(0, 0, 0, 0.4);
  bottom: 0;
  color: #fff;
  height: 40%;
  position: absolute;
  text-align: center;
  width: 100%;
`;

export default Icon;
