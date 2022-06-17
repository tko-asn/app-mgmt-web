import { memo, useLayoutEffect, useState, VFC } from 'react';
import styled from 'styled-components';
import { useMutation } from '@apollo/client';
import Card, { CardProps } from '../molecules/Card';
import IconForm, { IconFormProps } from '../molecules/IconForm';
import ModalOverlay from '../atoms/ModalOverlay';
import Padding from '../atoms/Padding';
import { UPDATE_ICON } from '../../queries/profile';
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

const Profile: VFC<ProfileProps> = memo(({
  card1Props,
  card2Props,
  icon,
  iconFormProps,
  profileId,
  username,
}) => {
  const [showsIconForm, setShowsIconForm] = useState(false);

  const [updateIcon, { data }] = useMutation(UPDATE_ICON);

  const { profile, setProfile } = useProfile();

  /*
    Profileがログインユーザー自身のものの場合は関数を返す（アイコンフォームが有効）
    Profileが他のユーザーのものであればundefined（アイコンフォームが無効）
  */
  const showIconForm = (
    profile.id === profileId ? () => setShowsIconForm(true) : undefined);

  const submitIconData = async (image: string) => {
    const variables = { id: profile.id, icon: image };
    await updateIcon({ variables });
    setShowsIconForm(false);
  };

  useLayoutEffect(() => {
    if (data?.changeIcon?.icon) {
      setProfile({ ...profile, icon: data.changeIcon.icon });
    }
  }, [data]);

  return (
    <StyledContainer>
      <StyledWrapper>
        <StyledUserWrapper>
          <Card
            hasIcon
            linkValue={profile.id === profileId ? 'プロフィール編集' : ''}
            showIconForm={showIconForm}
            src={icon}
            textValue={username}
            {...card1Props}
          />
          {showsIconForm && (
            <>
              <ModalOverlay closeOverlay={() => setShowsIconForm(false)} />
              <StyledIconForm
                defaultIcon={icon}
                handleClick={submitIconData}
                toggleIconForm={setShowsIconForm}
                {...iconFormProps}
              />
            </>
          )}
        </StyledUserWrapper>
        <Card linkValue="アプリ一覧" {...card2Props} />
      </StyledWrapper>
    </StyledContainer>
  );
});

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
