import { gql } from '@apollo/client';

export const FETCH_TEAMS = gql`
  query FetchTeams($teamName: String!) {
    getTeamsByTeamName(teamName: $teamName) {
      id
      teamName
    }
  }
`;

export const FETCH_TEAMS_BY_MEMBER_ID = gql`
  query FetchTeamsByMemberId($page: Int!, $memberId: String!) {
    getTeamsByMemberId(page: $page, memberId: $memberId) {
      teams {
        id
        teamName
      }
      count
    }
  }
`;

export const FETCH_TEAM = gql`
  query FetchTeam($id: String!) {
    getTeamById(id: $id) {
      teamName
      description
      invitees {
        id
        username
        icon
      }
      members {
        id
        username
        icon
      }
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_TEAM = gql`
  mutation CreateTeam(
    $teamName: String!
    $description: String
    $inviteeIds: [ID]!
    $memberIds: [ID!]!
  ) {
    createTeam(
      input: {
        teamName: $teamName
        description: $description
        inviteeIds: $inviteeIds
        memberIds: $memberIds
      }
    ) {
      id
      teamName
      description
      createdAt
      updatedAt
      members {
        id
        username
        icon
      }
    }
  }
`;

export const UPDATE_TEAM = gql`
  mutation UpdateTeam(
    $id: ID!
    $teamName: String
    $description: String
    $inviteeIds: [ID]!
    $memberIds: [ID!]!
  ) {
    updateTeam(
      id: $id
      input: {
        teamName: $teamName
        description: $description
        inviteeIds: $inviteeIds
        memberIds: $memberIds
      }
    ) {
      id
      teamName
      description
      createdAt
      updatedAt
      members {
        id
        username
        icon
      }
    }
  }
`;
