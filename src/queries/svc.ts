import { gql } from '@apollo/client';

export const FETCH_SVC = gql`
  query FetchSvc($id: String!) {
    getSvcById(id: $id) {
      id
      name
      description
      icon
      url
      createdAt
      updatedAt
      developer {
        id
        username
        icon
      }
      team {
        id
        teamName
        members {
          id
        }
      }
    }
  }
`;

export const FETCH_SVCS = gql`
  query FetchSvcs($page: Int!) {
    getSvcs(page: $page) {
      svcs {
        id
        name
        url
        icon
      }
      count
    }
  }
`;

export const FETCH_SVCS_BY_PROFILE_ID = gql`
  query FetchSvcsByProfileId($page: Int!, $profileId: String!) {
    getSvcsByProfileId(page: $page, profileId: $profileId) {
      svcs {
        id
        name
        url
        icon
      }
      count
    }
  }
`;

export const CREATE_SVC = gql`
  mutation CreateSvc(
    $name: String!
    $description: String
    $icon: String
    $url: String!
    $developerId: String
    $teamId: String
  ) {
    createSvc(
      input: {
        name: $name
        description: $description
        icon: $icon
        url: $url
        developerId: $developerId
        teamId: $teamId
      }
    ) {
      id
      name
      description
      url
      developer {
        id
        username
        icon
      }
      team {
        id
        teamName
      }
    }
  }
`;

export const UPDATE_SVC = gql`
  mutation UpdateSvc(
    $id: ID!
    $name: String
    $description: String
    $icon: String
    $url: String
  ) {
    updateSvc(
      id: $id
      input: { name: $name, description: $description, icon: $icon, url: $url }
    ) {
      id
      name
      description
      url
      developer {
        id
        username
        icon
      }
      team {
        id
        teamName
      }
    }
  }
`;
