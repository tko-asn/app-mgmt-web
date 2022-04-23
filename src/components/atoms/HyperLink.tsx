import type { VFC } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

export type HyperLinkProps = {
  activebg?: string;
  background?: string;
  color?: string;
  fontSize?: string;
  height?: string;
  name: string;
  position?: string;
  to: string;
  width?: string;
};

const HyperLink: VFC<HyperLinkProps> = ({
  activebg,
  background,
  color,
  fontSize,
  height,
  name,
  position,
  to,
  width,
}) => {
  return (
    <StyledLink
      activebg={activebg}
      background={background}
      color={color}
      end
      fontSize={fontSize}
      height={height}
      position={position}
      to={to}
      width={width}
    >
      <StyledSpan>{name}</StyledSpan>
    </StyledLink>
  );
};

type NavLinkProps = Pick<
  HyperLinkProps,
  'activebg' | 'background' | 'fontSize' | 'position' | 'height' | 'width'
>;

const StyledLink = styled(NavLink)<NavLinkProps>`
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
    opacity: 0.7;
  }
  &.active {
    background: ${(props) => (props.activebg ? props.activebg : 'initial')};
  }
`;

const StyledSpan = styled.span`
  margin: 0 10px;
`;

export default HyperLink;
