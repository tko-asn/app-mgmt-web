import { ChangeEvent, MouseEvent, useState, VFC } from 'react';
import styled from 'styled-components';

const DEFAULT_SIZE = '100px';

type HandleClickType = (event: MouseEvent<HTMLDivElement>) => void;

export type AppIconProps = {
  handleChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  handleClick?: HandleClickType;
  height?: string;
  href?: string;
  initial: string;
  initialSize?: string;
  isAllowedToEdit?: boolean;
  src?: string;
  width?: string;
};

const AppIcon: VFC<AppIconProps> = ({
  handleChange,
  handleClick,
  height,
  href,
  initial,
  initialSize,
  isAllowedToEdit,
  src,
  width,
}) => {
  const [isAbleToShowOverlay, setIsAbleToShowOverlay] = useState(false);

  const appIcon = src ? (
    <StyledImage alt="" height={height} src={src} width={width} />
  ) : (
    <StyledLink href={href} initialSize={initialSize}>
      {initial}
    </StyledLink>
  );
  return (
    <StyledDiv
      height={height}
      isButton={handleClick}
      onClick={typeof handleClick === 'function' ? handleClick : () => {}}
      onMouseEnter={() => setIsAbleToShowOverlay(true)}
      onMouseLeave={() => setIsAbleToShowOverlay(false)}
      width={width}
    >
      {appIcon}
      {isAllowedToEdit && isAbleToShowOverlay && (
        <>
          <StyledOverlay htmlFor="appIcon">編集</StyledOverlay>
          <StyledInput id="appIcon" type="file" onChange={handleChange} />
        </>
      )}
    </StyledDiv>
  );
};

const StyledDiv = styled.div<
  Pick<AppIconProps, 'height' | 'width'> & {
    isButton?: HandleClickType;
  }
>`
  background: gray;
  border-radius: 5%;
  height: ${(props) => (props.height ? props.height : DEFAULT_SIZE)};
  overflow: hidden;
  position: relative;
  width: ${(props) => (props.width ? props.width : DEFAULT_SIZE)};
  &:hover {
    cursor: ${(props) => (
    typeof props.isButton === 'function' ? 'pointer' : 'initial')};
    opacity: ${(props) => (
    typeof props.isButton === 'function' ? '0.8' : 'initial')};
  }
`;

const StyledLink = styled.a<Pick<AppIconProps, 'initialSize'>>`
  align-items: center;
  color: #fff;
  display: flex;
  font-size: ${(props) => (props.initialSize ? props.initialSize : '8vw')};
  height: 100%;
  justify-content: center;
`;

const StyledImage = styled.img<Pick<AppIconProps, 'height' | 'width'>>`
  height: ${(props) => (props.height ? props.height : DEFAULT_SIZE)};
  object-fit: cover;
  width: ${(props) => (props.width ? props.width : DEFAULT_SIZE)};
`;

const StyledOverlay = styled.label`
  align-items: center;
  background: rgba(0, 0, 0, 0.4);
  bottom: 0;
  color: #fff;
  display: flex;
  height: 100%;
  justify-content: center;
  position: absolute;
  width: 100%;
  :hover {
    cursor: pointer;
  }
`;

const StyledInput = styled.input`
  display: none;
`;

export default AppIcon;
