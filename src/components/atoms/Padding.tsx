import styled from 'styled-components';

const DEFAULT_PADDING = '10px';

export type PaddingProps = {
  bottom?: string;
  left?: string;
  right?: string;
  top?: string;
  position?: string;
};

const Padding = styled.div<PaddingProps>`
  padding-bottom: ${(props) => (props.bottom ? props.bottom : DEFAULT_PADDING)};
  padding-left: ${(props) => (props.left ? props.left : DEFAULT_PADDING)};
  padding-right: ${(props) => (props.right ? props.right : DEFAULT_PADDING)};
  padding-top: ${(props) => (props.top ? props.top : DEFAULT_PADDING)};
  text-align: ${(props) => (props.position ? props.position : 'left')};
`;

export default Padding;
