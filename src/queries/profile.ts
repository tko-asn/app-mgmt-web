import { gql } from '@apollo/client';

export const FETCH_PROFILE = gql`
  query FetchProfile($id: String!) {
    getProfileById(id: $id) {
      id
      username
      icon
      selfIntro
      inviters {
        id
        teamName
      }
      teams {
        id
        teamName
      }
    }
  }
`;

export const FETCH_PROFILES_BY_IDS = gql`
  query FetchProfilesByIds($ids: [ID!]!) {
    getProfilesByIds(ids: $ids) {
      id
      username
      icon
    }
  }
`;

export const FETCH_PROFILES_BY_USERNAME = gql`
  query FetchProfilesByUsername($username: String!) {
    getProfilesByUsername(username: $username) {
      id
      username
      icon
    }
  }
`;

export const FETCH_PROFILE_BY_USER_ID = gql`
  query FetchProfileByUserId($userId: String!) {
    getProfileByUserId(userId: $userId) {
      id
      username
      selfIntro
      userId
    }
  }
`;

export const CREATE_PROFILE = gql`
  mutation CreateProfile($username: String!, $selfIntro: String, $userId: String!) {
    createProfile(input: { username: $username, selfIntro: $selfIntro, userId: $userId }) {
      id
      username
      selfIntro
      icon
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($id: ID!, $username: String!, $selfIntro: String!) {
    updateProfile(
      id: $id,
      input: { username: $username, selfIntro: $selfIntro },
    ) {
      username
      selfIntro
    }
  }
`;

export const UPDATE_ICON = gql`
  mutation UpdateIcon($id: ID!, $icon: String!) {
    changeIcon(id: $id, icon: $icon) {
      icon
    }
  }
`;
