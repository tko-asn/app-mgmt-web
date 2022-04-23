import type { MouseEvent, VFC } from 'react';
import styled from 'styled-components';

export type AnchorProps = {
  activebg?: string;
  background?: string;
  color?: string;
  fontSize?: string;
  handleClick: (event: MouseEvent<HTMLAnchorElement>) => void;
  height?: string;
  name: string;
  position?: string;
  width?: string;
};

const Anchor: VFC<AnchorProps> = ({
  activebg,
  background,
  color,
  fontSize,
  handleClick,
  height,
  name,
  position,
  width,
}) => {
  return (
    <StyledAnchor
      activebg={activebg}
      background={background}
      color={color}
      fontSize={fontSize}
      height={height}
      onClick={handleClick}
      position={position}
      width={width}
    >
      <StyledSpan>{name}</StyledSpan>
    </StyledAnchor>
  );
};

type NavLinkProps = Pick<
  AnchorProps,
  'activebg' | 'background' | 'fontSize' | 'position' | 'height' | 'width'
>;

const StyledAnchor = styled.a<NavLinkProps>`
  align-items: center;
  background: ${(props) => (props.background ? props.background : 'initial')};
  color: ${(props) => (props.color ? props.color : '#fff')};
  display: flex;
  font-size: ${(props) => (props.fontSize ? props.fontSize : 'initial')};
  height: ${(props) => (props.height ? props.height : '50px')};
  justify-content: ${(props) => (props.position ? props.position : 'initial')};
  text-decoration: none;
  width: ${(props) => (props.width ? props.width : '100%')};
  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
  :active {
    background: ${(props) => (props.activebg ? props.activebg : 'initial')};
  }
`;

const StyledSpan = styled.span`
  margin: 0 10px;
`;

export default Anchor;
