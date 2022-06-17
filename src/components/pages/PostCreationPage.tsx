import styled from 'styled-components';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState, VFC } from 'react';
import { useProfile } from '../../contexts/ProfileContext';
import { CREATE_SVC } from '../../queries/svc';
import { FETCH_TEAMS_BY_TEAM_NAME_AND_MEMBER_ID } from '../../queries/team';
import { AppFormState, SimpleTeam } from '../../utils/types';
import Input from '../atoms/Input';
import Padding from '../atoms/Padding';
import PostForm from '../organisms/PostForm';
import RadioInputFormList from '../organisms/RadioInputFormList';
import UserCardList from '../organisms/UserCardList';
import Template from '../templates/Template';
import { descriptionField, nameField, urlField } from './props/postForm';
import Label from '../atoms/Label';
import TeamLinkList from '../organisms/TeamLinkList';
import { validateAppDataAndGetErrorMessages } from '../../utils/form';
import { useMessages } from '../../hooks/useMessages';

const PostCreationPage: VFC = () => {
  const [fetchTeams] = useLazyQuery(FETCH_TEAMS_BY_TEAM_NAME_AND_MEMBER_ID);
  const [createSvc] = useMutation(CREATE_SVC);
  const { profile } = useProfile();
  const { messages, setErrorMessages, initializeErrorMessages } = useMessages();

  const initialFormOptionsState = {
    checkedValue: 'developer',
    searchedTeam: '',
  };

  type TeamData = {
    selectedTeam?: SimpleTeam;
    candidateTeams: SimpleTeam[];
  };

  const initialTeamData = {
    selectedTeam: undefined,
    candidateTeams: [],
  };

  const navigate = useNavigate();

  const [formOptions, setFormOptions] = useState(initialFormOptionsState);
  const [teamData, setTeamData] = useState<TeamData>(initialTeamData);

  const submitPostData = async (variables: AppFormState) => {
    const errors = validateAppDataAndGetErrorMessages(variables);
    if (formOptions.checkedValue === 'team' && !teamData.selectedTeam) {
      errors.push('チームを選択してください。');
    }
    if (errors.length) {
      setErrorMessages(errors);
      return;
    }
    const { data: { createSvc: { id } } } = await createSvc({ variables });
    navigate(`/app/${id}`);
  };

  const getTeamMenu = (teams: SimpleTeam[], isAllowToSetData?: boolean) => {
    return teams.map((team: SimpleTeam) => ({
      color: '#000',
      name: team.teamName,
      handleClick: isAllowToSetData
        ? () => setTeamData({ ...teamData, selectedTeam: team })
        : () => {},
      height: '40px',
    }));
  };

  const buttonProps = {
    title: '投稿',
  };

  const formCardProps = {
    titleProps: {
      value: 'アプリを投稿',
    },
  };

  const radioInputForms = useMemo(() => [
    {
      labelProps: {
        fontSize: '0.8em',
        htmlFor: 'developer',
        value: '個人',
      },
      radioInputProps: {
        id: 'developer',
        checked: formOptions.checkedValue === 'developer',
        handleChange: () => setFormOptions({
          checkedValue: 'developer',
          searchedTeam: '',
        }),
      },
    },
    {
      labelProps: {
        fontSize: '0.8em',
        htmlFor: 'team',
        value: 'チーム',
      },
      radioInputProps: {
        id: 'team',
        checked: formOptions.checkedValue === 'team',
        handleChange: () => setFormOptions(
          { ...formOptions, checkedValue: 'team' },
        ),
      },
    },
  ], [formOptions.checkedValue]);

  const teamNameInputProps = {
    id: 'teamName',
    placeholder: 'チーム名から検索',
    value: formOptions.searchedTeam,
  };

  const cards = [{ user: profile }];

  useEffect(() => {
    if (formOptions.checkedValue === 'team') {
      const variables = {
        teamName: formOptions.searchedTeam,
        memberId: profile.id,
      };
      fetchTeams({ variables }).then(
        ({ data: { getTeamsByTeamNameAndMemberId: result } }) => {
          setTeamData({ ...teamData, candidateTeams: result });
        },
      );
      // 開発者を「個人」に切り替えたときはteamDataを初期化
    } else if (formOptions.checkedValue === 'developer') {
      setTeamData(initialTeamData);
    }
  }, [formOptions, profile.id]);

  return (
    <Template messages={messages} deleteErrorMessages={initializeErrorMessages}>
      <StyledContainer>
        <PostForm
          buttonProps={buttonProps}
          descriptionField={descriptionField}
          formCardProps={formCardProps}
          nameField={nameField}
          submitPostData={submitPostData}
          teamId={teamData.selectedTeam ? teamData.selectedTeam.id : ''}
          urlField={urlField}
        >
          <Padding top="5px">
            <>
              <RadioInputFormList
                radioInputForms={radioInputForms}
                title="開発者"
              />
              {formOptions.checkedValue === 'developer' && (
                <UserCardList cards={cards} />
              )}
              {formOptions.checkedValue === 'team' && (
                <>
                  <Input
                    handleChange={(value: string) => setFormOptions(
                      { ...formOptions, searchedTeam: value },
                    )}
                    {...teamNameInputProps}
                  />
                  <TeamLinkList
                    maxHeight="150px"
                    menuList={getTeamMenu(teamData.candidateTeams, true)}
                    noTeamText="チームが存在しません"
                  />
                  <Padding bottom="0px" top="5px" left="0px" right="0px">
                    <Label value="選択中のチーム" />
                    <TeamLinkList
                      maxHeight="150px"
                      menuList={(teamData.selectedTeam
                        ? getTeamMenu([teamData.selectedTeam]) : [])}
                      noTeamText="選択中のチームがありません"
                    />
                  </Padding>
                </>
              )}
            </>
          </Padding>
        </PostForm>
      </StyledContainer>
    </Template>
  );
};

const StyledContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 60px;
`;

export default PostCreationPage;
