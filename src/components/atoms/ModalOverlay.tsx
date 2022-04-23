import type { MouseEvent, VFC } from 'react';
import styled from 'styled-components';

export type ModalOverlayProps = {
  closeOverlay: (event: MouseEvent<HTMLDivElement>) => void;
};

const ModalOverlay: VFC<ModalOverlayProps> = ({ closeOverlay }) => {
  return <StyledDiv onClick={closeOverlay} />;
};

const StyledDiv = styled.div`
  background: rgba(0, 0, 0, 0.5);
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
`;

export default ModalOverlay;
