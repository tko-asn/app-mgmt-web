import { useState, VFC } from 'react';
import styled from 'styled-components';
import { useMutation } from '@apollo/client';
import Card, { CardProps } from '../molecules/Card';
import IconForm, { IconFormProps } from '../molecules/IconForm';
import ModalOverlay from '../atoms/ModalOverlay';
import Padding from '../atoms/Padding';
import { EDIT_ICON } from '../../queries/profile';
import { useProfile } from '../../contexts/ProfileContext';

export type ProfileProps = {
  card1Props: Pick<CardProps, 'parentProps' | 'to'>;
  card2Props: Pick<
    CardProps,
    'parentProps' | 'subTextValue' | 'textValue' | 'to'
  >;
  icon: string;
  iconFormProps: Pick<IconFormProps, 'className' | 'iconProps'>;
  profileId?: string;
  username: string;
};

const Profile: VFC<ProfileProps> = ({
  card1Props,
  card2Props,
  icon,
  iconFormProps,
  profileId,
  username,
}) => {
  const [isShowIconForm, setIsShowIconForm] = useState(false);

  const [editIcon] = useMutation(EDIT_ICON);

  const { profile, setProfile } = useProfile();

  /*
    Profileがログインユーザー自身のものの場合は関数を返す（アイコンフォームが有効）
    Profileが他のユーザーのものであればundefined（アイコンフォームが無効）
  */
  const showIconForm = (
    profile.id === profileId ? () => setIsShowIconForm(true) : undefined);

  const submitIconData = async (image: string) => {
    const variables = { id: profile.id, icon: image };
    const {
      data: { updateProfile: result },
    } = await editIcon({ variables });
    setProfile({ ...profile, ...result });
    setIsShowIconForm(false);
  };

  return (
    <StyledContainer>
      <StyledWrapper>
        <StyledUserWrapper>
          <Card
            hasIcon
            linkValue="プロフィール編集"
            showIconForm={showIconForm}
            src={icon}
            textValue={username}
            {...card1Props}
          />
          {isShowIconForm && (
            <>
              <ModalOverlay closeOverlay={() => setIsShowIconForm(false)} />
              <StyledIconForm
                defaultIcon={icon}
                handleClick={submitIconData}
                toggleIconForm={setIsShowIconForm}
                {...iconFormProps}
              />
            </>
          )}
        </StyledUserWrapper>
        <Card linkValue="アプリ一覧" {...card2Props} />
      </StyledWrapper>
    </StyledContainer>
  );
};

const StyledContainer = styled(Padding)`
  background: #fff;
  box-shadow: 0 2px 2px silver;
  display: flex;
  justify-content: center;
`;

const StyledWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  position: relative;
  width: 80%;
`;

const StyledUserWrapper = styled.div`
  position: relative;
`;

const StyledIconForm = styled(IconForm)`
  position: absolute;
  z-index: 50;
`;

export default Profile;
