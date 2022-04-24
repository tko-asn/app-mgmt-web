import { useEffect, useState, VFC } from 'react';
import { useLazyQuery } from '@apollo/client';
import {
  FETCH_PROFILES_BY_IDS,
  FETCH_PROFILES_BY_USERNAME,
} from '../../queries/profile';
import { stateSetter } from '../../utils/form';
import { TeamInput } from '../../utils/types';
import Button, { ButtonProps } from '../atoms/Button';
import Padding from '../atoms/Padding';
import FormCard, { FormCardProps } from '../molecules/FormCard';
import InputForm, { InputFormProps } from '../molecules/InputForm';
import TextAreaForm, { TextAreaFormProps } from '../molecules/TextAreaForm';
import Label from '../atoms/Label';
import UserCardList from './UserCardList';

type InputFieldProps = Pick<InputFormProps, 'inputProps' | 'labelProps'>;

type TeamFormProps = {
  buttonProps: Pick<
    ButtonProps,
    'background' | 'color' | 'fontSize' | 'height' | 'title' | 'width'
  >;
  descriptionField: Pick<TextAreaFormProps, 'labelProps' | 'textAreaProps'>;
  formCardProps: Pick<FormCardProps, 'titleProps' | 'width'>;
  submitTeamData: (variables: TeamInput) => Promise<void>;
  teamNameField: InputFieldProps;
  teamState?: TeamInput;
  usernameField: InputFieldProps;
};

const TeamForm: VFC<TeamFormProps> = ({
  buttonProps,
  descriptionField,
  formCardProps,
  submitTeamData,
  teamNameField,
  teamState,
  usernameField,
}) => {
  const [fetchProfilesByUsername] = useLazyQuery(FETCH_PROFILES_BY_USERNAME);
  const [fetchProfilesByIds] = useLazyQuery(FETCH_PROFILES_BY_IDS);

  type Profile = {
    id: string;
    icon: string;
    username: string;
  };

  type UsersState = {
    candidates: Profile[];
    invitees: Profile[];
    members: Profile[];
  };

  const initialTeamState = teamState || {
    teamName: '',
    description: '',
    inviteeIds: [],
    memberIds: [],
  };
  const initialUsersState = {
    candidates: [],
    invitees: [],
    members: [],
  };

  /*
    stateSetterではネストされたオブジェクトの値を更新できないので
    useStateをteam用とそれ以外で複数回使用する
  */
  const [team, setTeam] = useState<TeamInput>(initialTeamState);

  /*
    usernameとcandidates(users)を分けているのは、両方を一緒に管理した際
    useEffectでusername更新後にcandidatesの値をを更新すると
    同時にusernameも更新され無限ループに陥ってしまうため
  */
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState<UsersState>(initialUsersState);

  const setTeamState = stateSetter<TeamInput>(team, setTeam);

  const addUserToInviteeIds = (profileId: string) => {
    if (!team.inviteeIds.includes(profileId)) {
      const newInviteeIds = [...team.inviteeIds, profileId];
      setTeam({ ...team, inviteeIds: newInviteeIds });
    }
  };

  const removeUserFromInviteeIds = (profileId: string) => {
    if (team.inviteeIds.includes(profileId)) {
      const newInviteeIds = team.inviteeIds.filter(
        (inviteeId) => inviteeId !== profileId,
      );
      setTeam({ ...team, inviteeIds: newInviteeIds });
    }
  };

  const removeUserFromMemberIds = (profileId: string) => {
    if (team.memberIds.length !== 1 && team.memberIds.includes(profileId)) {
      const newMemberIds = team.memberIds.filter(
        (memberId) => memberId !== profileId,
      );
      setTeam({ ...team, memberIds: newMemberIds });
    }
  };

  const teamNameInputProps = {
    ...teamNameField.inputProps,
    value: team.teamName,
  };
  const descriptionTextAreaProps = {
    ...descriptionField.textAreaProps,
    value: team.description,
  };
  const usernameInputProps = {
    ...usernameField.inputProps,
    value: username,
  };

  useEffect(() => {
    Promise.all([
      fetchProfilesByUsername({
        variables: { username },
      }),
      fetchProfilesByIds({ variables: { ids: team.inviteeIds } }),
      fetchProfilesByIds({ variables: { ids: team.memberIds } }),
    ]).then((values) => {
      const candidates = values[0].data.getProfilesByUsername.filter(
        (candidate: Profile) => !team.memberIds.includes(candidate.id),
      );
      const invitees = values[1].data.getProfilesByIds;
      const members = values[2].data.getProfilesByIds;
      setUsers({ ...users, candidates, invitees, members });
    });
  }, [username, team.inviteeIds, team.memberIds]);

  const candidateCards = users.candidates.map((user) => {
    const isInvitee = team.inviteeIds.includes(user.id);
    return {
      user,
      button: {
        background: isInvitee ? '#FF0000' : '#0066FF',
        fontSize: '0.8em',
        handleClick: isInvitee
          ? () => removeUserFromInviteeIds(user.id)
          : () => addUserToInviteeIds(user.id),
        height: '25px',
        title: isInvitee ? '取り消し' : '招待',
        width: isInvitee ? '70px' : '40px',
      },
    };
  });

  const inviteeCards = users.invitees.map((user) => ({
    user,
    button: {
      background: '#FF0000',
      fontSize: '0.8em',
      handleClick: () => removeUserFromInviteeIds(user.id),
      height: '25px',
      title: '取り消し',
      width: '70px',
    },
  }));

  const memberCards = users.members.map((user) => ({
    user,
    button: {
      background: '#FF0000',
      disabled: users.members.length === 1,
      fontSize: '0.8em',
      handleClick: () => removeUserFromMemberIds(user.id),
      height: '25px',
      title: '外す',
      width: '70px',
    },
  }));

  return (
    <FormCard width="65%" {...formCardProps}>
      <>
        <Padding top="5px">
          <InputForm
            labelProps={teamNameField.labelProps}
            inputProps={teamNameInputProps}
            stateKey="teamName"
            stateSetter={setTeamState}
          />
        </Padding>
        <Padding top="5px">
          <TextAreaForm
            labelProps={descriptionField.labelProps}
            stateKey="description"
            stateSetter={setTeamState}
            textAreaProps={descriptionTextAreaProps}
          />
        </Padding>
        <Padding top="5px">
          <InputForm
            labelProps={usernameField.labelProps}
            inputProps={usernameInputProps}
            scalarTypeStateSetter={setUsername}
          />
          <UserCardList
            cards={candidateCards}
            noCardText="ユーザーが存在しません"
          />
        </Padding>

        <Padding top="5px">
          <Label value="招待しているユーザー" />
          <UserCardList
            cards={inviteeCards}
            noCardText="招待しているユーザーがいません"
          />
        </Padding>

        <Padding top="5px">
          <Label value="メンバー" />
          <UserCardList cards={memberCards} noCardText="メンバーがいません" />
        </Padding>
        <Padding>
          <Button handleClick={() => submitTeamData(team)} {...buttonProps} />
        </Padding>
      </>
    </FormCard>
  );
};

export default TeamForm;
