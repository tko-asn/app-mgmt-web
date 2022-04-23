import type { MouseEvent, VFC } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import AppIcon, { AppIconProps } from '../atoms/AppIcon';
import Padding, { PaddingProps } from '../atoms/Padding';
import Text, { TextProps } from '../atoms/Text';

export type LinkProps = {
  to: string;
  value: string;
};

export type AppCardProps = {
  appIconProps: AppIconProps;
  externalLink?: boolean; // リンクが外部のURLかどうか
  handleClick?: (event: MouseEvent<HTMLDivElement>) => void;
  isButton?: boolean;
  linkProps: LinkProps;
  textProps: Pick<TextProps, 'className' | 'value'>;
};

const AppCard: VFC<AppCardProps> = ({
  appIconProps,
  externalLink,
  handleClick,
  isButton,
  linkProps,
  textProps,
}) => {
  return (
    <StyledContainer
      isButton={isButton}
      onClick={
        isButton && typeof handleClick === 'function' ? handleClick : () => {}
      }
    >
      <AppIcon {...appIconProps} />
      <Padding left="30px">
        <Text size="1.4em" weight="bold" {...textProps} />
        {externalLink ? (
          <a href={linkProps.to}>{linkProps.value}</a>
        ) : (
          <Link to={linkProps.to}>{linkProps.value}</Link>
        )}
      </Padding>
    </StyledContainer>
  );
};

type StyledContainerProps = {
  isButton?: boolean;
} & PaddingProps;

const StyledContainer = styled(Padding)<StyledContainerProps>`
  align-items: center;
  border-bottom: 1px solid silver;
  display: flex;
  &:hover {
    background: ${(props) => (props.isButton ? '#BBBBBB' : 'initial')};
    cursor: ${(props) => (props.isButton ? 'pointer' : 'initial')};
  }
`;

export default AppCard;
