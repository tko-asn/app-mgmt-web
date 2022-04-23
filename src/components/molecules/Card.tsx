import type { MouseEvent, VFC } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Icon, { IconProps } from '../atoms/Icon';
import Padding from '../atoms/Padding';
import Text from '../atoms/Text';

type ParentProps = {
  alignItems?: string;
  minHeight?: string;
  maxWidth?: string;
};

type StyledIconProps = {
  hasIcon?: boolean;
} & IconProps;

export type CardProps = {
  hasIcon?: boolean;
  imageSize?: string;
  linkValue?: string;
  parentProps?: ParentProps;
  showIconForm?: (event: MouseEvent<HTMLDivElement>) => void;
  sidePadding?: string;
  src?: string;
  subTextValue?: string;
  textFontSize?: string;
  textValue: string;
  to?: string;
};

const Card: VFC<CardProps> = ({
  hasIcon,
  imageSize,
  linkValue,
  parentProps,
  showIconForm,
  sidePadding,
  src,
  subTextValue,
  textFontSize,
  textValue,
  to,
}) => {
  return (
    <StyledContainer
      left={sidePadding}
      right={sidePadding}
      bottom="0"
      top="0"
      {...parentProps}
    >
      {hasIcon && showIconForm && (
        <StyledIcon
          handleClick={showIconForm}
          hasIcon={hasIcon}
          imageSize={imageSize}
          src={src}
        />
      )}
      {hasIcon && !showIconForm && (
        <StyledIcon hasIcon={hasIcon} imageSize={imageSize} src={src} />
      )}
      <StyledWrapper left={sidePadding} right={sidePadding} bottom="0" top="0">
        <Text size={textFontSize || '1.7em'} value={textValue} weight="bold" />
        {subTextValue && (
          <Padding>
            <Text color="#444444" value={subTextValue} />
          </Padding>
        )}
        {linkValue && to && <StyledLink to={to}>{linkValue}</StyledLink>}
      </StyledWrapper>
    </StyledContainer>
  );
};

const StyledContainer = styled(Padding)<ParentProps>`
  align-items: ${(props) => (props.alignItems ? props.alignItems : 'center')};
  display: flex;
  min-height: ${(props) => (props.minHeight ? props.minHeight : '150px')};
  max-width: ${(props) => (props.maxWidth ? props.maxWidth : '300px')};
`;

const StyledIcon = styled(Icon)<StyledIconProps>`
  display: ${(props) => (props.hasIcon ? 'initial' : 'none')};
  margin-right: 20px;
`;

const StyledWrapper = styled(Padding)`
  flex: 1;
  overflow: hidden;
`;

const StyledLink = styled(Link)`
  color: #0066ff;
`;

export default Card;
