import type { VFC } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import TeamForm from '../organisms/TeamForm';
import { useProfile } from '../../contexts/ProfileContext';
import Template from '../templates/Template';
import MainContainer from '../atoms/MainContainer';
import { CREATE_TEAM } from '../../queries/team';
import { TeamInput } from '../../utils/types';
import {
  descriptionField,
  teamNameField,
  usernameField,
} from './props/teamForm';

const TeamCreationPage: VFC = () => {
  const { profile } = useProfile();
  const [createTeam] = useMutation(CREATE_TEAM);
  const navigate = useNavigate();

  const teamState = {
    teamName: '',
    description: '',
    inviteeIds: [],
    memberIds: [profile.id],
  };

  const submitTeamData = async (variables: TeamInput) => {
    await createTeam({ variables });
    navigate('/top');
  };

  const buttonProps = {
    title: '作成',
  };
  const formCardProps = {
    titleProps: {
      value: 'チーム作成',
    },
  };

  return (
    <Template>
      <MainContainer>
        {profile.id && teamState.memberIds.length && (
          <TeamForm
            buttonProps={buttonProps}
            descriptionField={descriptionField}
            formCardProps={formCardProps}
            submitTeamData={submitTeamData}
            teamNameField={teamNameField}
            teamState={teamState}
            usernameField={usernameField}
          />
        )}
      </MainContainer>
    </Template>
  );
};

export default TeamCreationPage;
