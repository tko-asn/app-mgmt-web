import type { ChangeEvent, VFC } from 'react';
import styled from 'styled-components';

export type FileFormProps = {
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const FileForm: VFC<FileFormProps> = ({ handleChange }) => {
  return (
    <StyledLabel>
      <StyledInput onChange={handleChange} type="file" />
      ファイルを選択
    </StyledLabel>
  );
};

const StyledLabel = styled.label`
  background: #384878;
  border-radius: 4px;
  color: #fff;
  padding: 3px 10px;
  &:hover {
    cursor: pointer;
    opacity: 0.9;
  }
`;

const StyledInput = styled.input`
  display: none;
`;

export default FileForm;
