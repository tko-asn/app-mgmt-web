import { gql } from '@apollo/client';

export const FETCH_COMMENTS_BY_SVC_ID = gql`
  query FetchCommentsBySvcId($svcId: ID!, $page: Int, $all: Boolean) {
    getCommentsBySvcId(svcId: $svcId, page: $page, all: $all) {
      comments {
        id
        content
        createdAt
        updatedAt
        likes {
          id
        }
        dislikes {
          id
        }
        author {
          id
          username
          icon
        }
      }
      count
      page
    }
  }
`;

export const FETCH_COMMENTS_BY_COMMENT_IDS = gql`
  query FetchCommentsByCommentIds($commentIds: [ID]!, $page: Int) {
    getCommentsByCommentIds(commentIds: $commentIds, page: $page) {
      commentId
      comments {
        id
        content
        createdAt
        updatedAt
        likes {
          id
        }
        dislikes {
          id
        }
        author {
          id
          username
          icon
        }
      }
      count
      page
    }
  }
`;

export const FETCH_COMMENTS_BY_COMMENT_ID = gql`
  query FetchCommentsByCommentId($commentId: ID!, $page: Int, $all: Boolean) {
    getCommentsByCommentId(commentId: $commentId, page: $page, all: $all) {
      comments {
        id
        content
        createdAt
        updatedAt
        likes {
          id
        }
        dislikes {
          id
        }
        author {
          id
          username
          icon
        }
      }
      count
      page
    }
  }
`;

export const CREATE_COMMENT = gql`
  mutation CreateComment(
    $content: String!
    $authorId: ID!
    $svcId: ID
    $commentId: ID
  ) {
    createComment(
      input: {
        content: $content
        authorId: $authorId
        svcId: $svcId
        commentId: $commentId
      }
    ) {
      id
      content
    }
  }
`;

export const UPDATE_COMMENT = gql`
  mutation UpdateComment($id: ID!, $content: String!) {
    updateComment(id: $id, content: $content) {
      id
      content
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation DeleteComment($id: ID!) {
    deleteComment(id: $id) {
      content
    }
  }
`;

export const LIKE_COMMENT = gql`
  mutation LikeComment($id: ID!, $profileId: ID!) {
    likeComment(id: $id, profileId: $profileId) {
      id
    }
  }
`;

export const DISLIKE_COMMENT = gql`
  mutation DislikeComment($id: ID!, $profileId: ID!) {
    dislikeComment(id: $id, profileId: $profileId) {
      id
    }
  }
`;

export const REMOVE_LIKE = gql`
  mutation RemoveLike($id: ID!, $profileId: ID!) {
    removeLike(id: $id, profileId: $profileId) {
      id
    }
  }
`;

export const REMOVE_DISLIKE = gql`
  mutation RemoveDisLike($id: ID!, $profileId: ID!) {
    removeDislike(id: $id, profileId: $profileId) {
      id
    }
  }
`;
