import type { VFC } from 'react';
import Padding from '../atoms/Padding';
import Text from '../atoms/Text';

export type TitleProps = {
  position?: string;
  value: string;
};

const Title: VFC<TitleProps> = ({ position, value }) => {
  return (
    <Padding position={position}>
      <Text size="1.3em" value={value} weight="bold" />
    </Padding>
  );
};

export default Title;
