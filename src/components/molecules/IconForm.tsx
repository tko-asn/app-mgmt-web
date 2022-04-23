import { ChangeEvent, useState, VFC } from 'react';
import styled from 'styled-components';
import Button from '../atoms/Button';
import FileForm from '../atoms/FileForm';
import Icon, { IconProps } from '../atoms/Icon';
import Padding from '../atoms/Padding';
import { imageHandler } from '../../utils/form';

export type IconFormProps = {
  className: string;
  defaultIcon: string;
  iconProps: IconProps;
  handleClick: (icon: string) => void;
  toggleIconForm: (show: boolean) => void;
};

const IconForm: VFC<IconFormProps> = ({
  className,
  defaultIcon,
  handleClick,
  iconProps,
  toggleIconForm,
}) => {
  const [fileData, setFileData] = useState({
    file: {},
    src: defaultIcon,
  });

  const handleChange = async (
    e: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const compressedFile = await imageHandler(e);
    setFileData(compressedFile);
  };

  const { src } = fileData;

  return (
    <StyledContainer className={className} position="center">
      <Icon src={src} {...iconProps} />
      <Padding bottom="0" left="0" position="center" right="0">
        <FileForm handleChange={handleChange} />
      </Padding>
      <StyeldWrapper>
        <StyledPadding left="0" right="5px">
          <Button
            background="silver"
            fontSize="0.6em"
            handleClick={() => toggleIconForm(false)}
            title="キャンセル"
          />
        </StyledPadding>
        <StyledPadding left="5px" right="0">
          <Button handleClick={() => handleClick(src)} title="保存" />
        </StyledPadding>
      </StyeldWrapper>
    </StyledContainer>
  );
};

const StyledContainer = styled(Padding)`
  background: gray;
  border: 2px solid silver;
  border-radius: 5px;
`;

const StyeldWrapper = styled.div`
  display: flex;
`;

const StyledPadding = styled(Padding)`
  flex: 1;
`;

export default IconForm;
