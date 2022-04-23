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

export const FETCH_OR_CREATE_PROFILE = gql`
  mutation FetchOrCreateProfile($userId: String!, $username: String!) {
    getOrCreateProfile(input: { userId: $userId, username: $username }) {
      id
      userId
      username
      icon
      selfIntro
    }
  }
`;

export const EDIT_PROFILE = gql`
  mutation EditProfile($id: ID!, $username: String!, $selfIntro: String!) {
    updateProfile(
      id: $id,
      input: { username: $username, selfIntro: $selfIntro },
    ) {
      username
      selfIntro
    }
  }
`;

export const EDIT_ICON = gql`
  mutation EditIcon($id: ID!, $icon: String!) {
    updateProfile(id: $id, input: { icon: $icon }) {
      icon
    }
  }
`;
