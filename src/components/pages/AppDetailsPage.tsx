import { useEffect, useLayoutEffect, useMemo, useState, VFC } from 'react';
import styled from 'styled-components';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useProfile } from '../../contexts/ProfileContext';
import AppCard from '../molecules/AppCard';
import CardList from '../organisms/CardList';
import Padding from '../atoms/Padding';
import Template from '../templates/Template';
import { FETCH_SVC } from '../../queries/svc';
import { getDatetime } from '../../utils/app';
import Card from '../molecules/Card';
import Button from '../atoms/Button';
import Text from '../atoms/Text';
import { baseCardObj, DEFAULT_SIZE } from './props/detailsPage';
import { Profile } from '../../utils/types';
import {
  CREATE_COMMENT,
  DELETE_COMMENT,
  DISLIKE_COMMENT,
  FETCH_COMMENTS_BY_COMMENT_ID,
  FETCH_COMMENTS_BY_COMMENT_IDS,
  FETCH_COMMENTS_BY_SVC_ID,
  LIKE_COMMENT,
  REMOVE_DISLIKE,
  REMOVE_LIKE,
  UPDATE_COMMENT,
} from '../../queries/comment';
import CommentCard, { CommentCardProps } from '../molecules/CommentCard';
import TextArea from '../atoms/TextArea';
import ModalOverlay from '../atoms/ModalOverlay';
import { whiteSpaceExists } from '../../utils/form';
import { ACCEPT, CANCEL, DELETE } from '../../utils/colors';
import { SVC_NOT_FOUND } from '../../utils/errors';

const AppDetailsPage: VFC = () => {
  type Comment = {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    likes: {
      id: string;
    }[];
    dislikes: {
      id: string;
    }[];
    author: Profile;
  };

  type FetchCommentsResult = {
    comments: Comment[];
    count: number;
    page: number;
  };

  type SimpleCommentsOnCommentObj = {
    commentId: string;
  } & FetchCommentsResult;

  type CommentsOnCommentObj = {
    isAllowedToShowComments: boolean;
    isAllowedToShowCreateForm: boolean;
    userComment: string;
  } & SimpleCommentsOnCommentObj;

  type CustomCommentCard = {
    id: string;
  } & CommentCardProps;

  type Options = {
    newCommentOnSvc: string;
    updateOptions: {
      isAllowedToShowUpdateForm: boolean;
      targetComment: Pick<Comment, 'id' | 'content'>;
    };
    deleteOptions: {
      isAllowedToShowDeleteForm: boolean;
      targetComment: Pick<Comment, 'id' | 'content'>;
    };
  };

  const [fetchSvc, { data: svcData, error: fetchSvcError }] = useLazyQuery(FETCH_SVC);
  const [fetchCommentsBySvcId] = useLazyQuery(FETCH_COMMENTS_BY_SVC_ID);
  const [fetchCommentsByCommentId] = useLazyQuery(FETCH_COMMENTS_BY_COMMENT_ID);
  const [fetchCommentsByCommentIds] = useLazyQuery(
    FETCH_COMMENTS_BY_COMMENT_IDS,
  );
  const [createComment, { loading: createCommentLoading }] =
    useMutation(CREATE_COMMENT);
  const [updateComment, { loading: updateCommentLoading }] =
    useMutation(UPDATE_COMMENT);
  const [deleteComment, { loading: deleteCommentLoading }] =
    useMutation(DELETE_COMMENT);
  const [likeComment] = useMutation(LIKE_COMMENT);
  const [dislikeComment] = useMutation(DISLIKE_COMMENT);
  const [removeLike] = useMutation(REMOVE_LIKE);
  const [removeDislike] = useMutation(REMOVE_DISLIKE);

  const { profile } = useProfile();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const { appId } = useParams();
  const navigate = useNavigate();

  const initialCommentsOnSvcState = {
    comments: [],
    count: 0,
    page: 1,
  };
  const initialOptionsState = {
    newCommentOnSvc: '',
    updateOptions: {
      isAllowedToShowUpdateForm: false,
      targetComment: {
        id: '',
        content: '',
      },
    },
    deleteOptions: {
      isAllowedToShowDeleteForm: false,
      targetComment: {
        id: '',
        content: '',
      },
    },
  };

  // 後からコメントを追加できるようにアプリへのコメントをstateで管理
  const [commentsOnSvc, setCommentsOnSvc] = useState<FetchCommentsResult>(
    initialCommentsOnSvcState,
  );
  const [commentsOnCommentObjs, setCommentsOnCommentObjs] = useState<
    CommentsOnCommentObj[]
  >([]);
  const [options, setOptions] = useState<Options>(initialOptionsState);
  const initializeUpdateOptions = () =>
    setOptions({
      ...options,
      updateOptions: initialOptionsState.updateOptions,
    });
  const initializeDeleteOptions = () =>
    setOptions({
      ...options,
      deleteOptions: initialOptionsState.deleteOptions,
    });
  const openCommentUpdateForm = (comment: Comment) =>
    setOptions({
      ...options,
      updateOptions: {
        isAllowedToShowUpdateForm: true,
        targetComment: {
          id: comment.id,
          content: comment.content,
        },
      },
      /*
      deleteOptionsのisAllowedToShowDeleteFormをfalseに設定する必要は
      本来はないが、useMemoを使用しているcommentsOnSvcCards内でこの関数を
      使用する際にoptionsの値が古いことがある
      （例えばisAllowedToShowDeleteForm: true）
      解決策は以下の二つ
        1. useMemoの依存配列にこの関数を含める
        2. この関数ないでisAllowedToShowDeleteFormをfalseにする
      1の場合optionsが変更されるたびにuseMemoの処理が実行されてしまい、メモ化の意味があまりないので、2を採用

      ちなみに以下のopenCommentDeleteFormも同様
    */
      deleteOptions: {
        ...options.deleteOptions,
        isAllowedToShowDeleteForm: false,
      },
    });
  const openCommentDeleteForm = (comment: Comment) =>
    setOptions({
      ...options,
      updateOptions: {
        ...options.updateOptions,
        isAllowedToShowUpdateForm: false,
      },
      deleteOptions: {
        isAllowedToShowDeleteForm: true,
        targetComment: {
          id: comment.id,
          content: comment.content,
        },
      },
    });

  const getTargetCommentObjAndOthers = (commentId: string) => {
    let target: CommentsOnCommentObj | undefined;
    const others: CommentsOnCommentObj[] = [];
    for (const commentsOnCommentObj of commentsOnCommentObjs) {
      if (commentsOnCommentObj.commentId === commentId) {
        target = commentsOnCommentObj;
      } else {
        others.push(commentsOnCommentObj);
      }
    }
    return { target, others };
  };

  const showOrHideCommentCreationFormForComment = (
    commentId: string,
    state: boolean,
  ) => {
    const { target, others: newArray } =
      getTargetCommentObjAndOthers(commentId);
    if (target) {
      target.isAllowedToShowCreateForm = state;
      if (!state) {
        target.userComment = '';
      }
      newArray.push(target);
      setCommentsOnCommentObjs(newArray);
    }
  };

  const showCommentsOnComment = async (commentId: string) => {
    const { target, others: newArray } =
      getTargetCommentObjAndOthers(commentId);
    if (target) {
      target.isAllowedToShowComments = true;
      newArray.push(target);
      setCommentsOnCommentObjs(newArray);
    } else {
      const variables = { commentId, page: 1, all: false };
      const {
        data: { getCommentsByCommentId: result },
      } = await fetchCommentsByCommentId({ variables });
      const newCommentsOnCommentObj = {
        ...result,
        commentId,
        isAllowedToShowComments: true,
        isAllowedToShowCreateForm: false,
        userComment: '',
      };
      setCommentsOnCommentObjs([
        ...commentsOnCommentObjs,
        newCommentsOnCommentObj,
      ]);
    }
  };

  const hideCommentsOnComment = (commentId: string) => {
    const { target, others: newArray } =
      getTargetCommentObjAndOthers(commentId);
    if (target) {
      target.isAllowedToShowComments = false;
      newArray.push(target);
      setCommentsOnCommentObjs(newArray);
    }
  };

  const setMoreCommentsOnSvc = async () => {
    const variables = {
      svcId: appId,
      page: commentsOnSvc.page + 1,
      all: false,
    };
    const {
      data: { getCommentsBySvcId: result },
    } = await fetchCommentsBySvcId({ variables });
    setCommentsOnSvc({
      ...result,
      comments: commentsOnSvc.comments.concat(result.comments),
    });
  };

  const setMoreCommentsOnComment = async (commentId: string) => {
    const { target, others: newArray } =
      getTargetCommentObjAndOthers(commentId);
    if (target) {
      const newPage = target.page + 1;
      const variables = {
        commentId,
        page: newPage,
        all: false, // addNewCommentOnComment後の場合、指定しないとall=trueになってしまう
      };
      const {
        data: {
          getCommentsByCommentId: { comments, count, page },
        },
      } = await fetchCommentsByCommentId({ variables });
      target.comments = target.comments.concat(comments);
      target.count = count;
      target.page = page;
      newArray.push(target);
      setCommentsOnCommentObjs(newArray);
    }
  };

  const addNewCommentOnSvc = async () => {
    const createCommentVariables = {
      content: options.newCommentOnSvc,
      authorId: profile.id,
      svcId: app.id,
    };
    await createComment({ variables: createCommentVariables });
    setOptions({ ...options, newCommentOnSvc: '' });
    await fetchAndSetCommentsOnSvc(commentsOnSvc.page, true);
  };

  const addNewCommentOnComment = async (commentId: string) => {
    const { target, others: newArray } =
      getTargetCommentObjAndOthers(commentId);
    if (target) {
      const createCommentVariables = {
        content: target.userComment,
        authorId: profile.id,
        commentId,
      };
      await createComment({ variables: createCommentVariables });
      const getCommentsByCommentIdVariables = {
        commentId,
        page: target.page,
        all: true,
      };
      const {
        data: {
          getCommentsByCommentId: { comments, count },
        },
      } = await fetchCommentsByCommentId({
        variables: getCommentsByCommentIdVariables,
      });
      newArray.push({
        ...target,
        comments,
        count,
        userComment: '',
        isAllowedToShowCreateForm: false,
      });
      setCommentsOnCommentObjs(newArray);
    }
  };

  const app = svcData
    ? svcData.getSvcById
    : {
      description: '',
      id: '',
      icon: '',
      name: '',
      url: '',
      createdAt: '',
      updatedAt: '',
      developer: undefined,
      team: undefined,
    };

  const appCardProps = useMemo(
    () => ({
      appIconProps: {
        height: '200px',
        initialSize: '15vw',
        initial: app.name[0],
        src: app.icon,
        width: '200px',
      },
      externalLink: true,
      linkProps: { to: app.url, value: 'アプリを見る' },
      textProps: { value: app.name },
    }),
    [app.name, app.icon, app.url],
  );

  const baseDeveloperCardObj = {
    imageSize: '70px',
    parentProps: {
      minHeight: '75px',
    },
    sidePadding: '0px',
    textFontSize: '1.5em',
  };

  const developerCardProps = useMemo(
    () => ({
      ...baseDeveloperCardObj,
      src: app.developer?.icon,
      textValue: app.developer?.username,
      to: `/user/${app.developer?.id}`,
    }),
    [app.developer],
  );

  const teamCardProps = useMemo(
    () => ({
      ...baseDeveloperCardObj,
      textValue: app.team?.teamName,
      to: `/team/${app.team?.id}`,
    }),
    [app.team],
  );

  const cardList = useMemo(
    () => [
      {
        ...baseCardObj,
        subTextValue: app.description,
        textValue: 'アプリの説明',
      },
      {
        ...baseCardObj,
        subTextValue: getDatetime(app.createdAt),
        textValue: '作成日',
      },
      {
        ...baseCardObj,
        subTextValue: getDatetime(app.updatedAt),
        textValue: '最終更新日',
      },
    ],
    [app.description, app.createdAt, app.updatedAt],
  );

  const searchCommentsOnCommentObjFromSubCommentId = (commentId: string) => {
    return commentsOnCommentObjs.find((commentsOnCommentObj) =>
      commentsOnCommentObj.comments.some((comment) => comment.id === commentId));
  };

  const updateCommentOnSvc = async (commentId: string, content: string) => {
    await updateComment({ variables: { id: commentId, content } });
    await fetchAndSetCommentsOnSvc(commentsOnSvc.page, true);
    initializeUpdateOptions();
  };

  const updateCommentOnComment = async (commentId: string, content: string) => {
    await updateComment({ variables: { id: commentId, content } });
    const targetCommentsOnCommentObj =
      searchCommentsOnCommentObjFromSubCommentId(commentId);
    if (targetCommentsOnCommentObj) {
      const { commentId: parentCommentId, page } = targetCommentsOnCommentObj;
      const variables = { commentId: parentCommentId, page, all: true };
      const {
        data: {
          getCommentsByCommentId: { comments, count },
        },
      } = await fetchCommentsByCommentId({ variables });
      const { target, others: newArray } = getTargetCommentObjAndOthers(
        targetCommentsOnCommentObj.commentId,
      );
      if (target) {
        target.comments = comments;
        target.count = count;
        newArray.push(target);
        setCommentsOnCommentObjs(newArray);
      }
    }
    initializeUpdateOptions();
  };

  // コメント一覧への変更後にページ数の値が正確か検証し、正しいページ数を返す
  const checkAndGetPage = (page: number, count: number) => {
    let newPage = page;
    /*
      コメント総数が現在のページの範囲を出た場合
      ex) page: 2, count: 11（変更前） -> 10（変更後）
          11: 11 ~ 20（2ページ目の範囲）
          10: 0 ~ 10（1ページ目の範囲）
    */
    if (page * 10 - count >= 10) {
      const p = count > 0 ? (count - 1) / 10 : 0;
      // 正確なページ数をセットする
      newPage = Math.floor(p) + 1;
    }
    return newPage;
  };

  const deleteCommentOnSvc = async (commentId: string) => {
    await deleteComment({ variables: { id: commentId } });
    await fetchAndSetCommentsOnSvc(commentsOnSvc.page, true, true);
    initializeDeleteOptions();
  };

  const deleteCommentOnComment = async (commentId: string) => {
    await deleteComment({ variables: { id: commentId } });
    const targetCommentsOnCommentObj =
      searchCommentsOnCommentObjFromSubCommentId(commentId);
    if (targetCommentsOnCommentObj) {
      const { commentId: parentCommentId, page } = targetCommentsOnCommentObj;
      const variables = { commentId: parentCommentId, page, all: true };
      const {
        data: {
          getCommentsByCommentId: { comments, count },
        },
      } = await fetchCommentsByCommentId({ variables });
      const newPage = checkAndGetPage(page, count);
      const { target, others: newArray } = getTargetCommentObjAndOthers(
        targetCommentsOnCommentObj.commentId,
      );
      if (target) {
        target.comments = comments;
        target.page = newPage;
        target.count = count;
        newArray.push(target);
        setCommentsOnCommentObjs(newArray);
      }
    }
    initializeDeleteOptions();
  };

  const newCommentOnCommentTextAreaProps = (commentId: string) => {
    const { target, others: newArray } =
      getTargetCommentObjAndOthers(commentId);
    if (target) {
      const updateUserComment = (value: string) => {
        target.userComment = value;
        newArray.push(target);
        setCommentsOnCommentObjs(newArray);
      };
      return {
        handleChange: updateUserComment,
        value: target.userComment,
      };
    }
    return {
      handleChange: () => {},
      value: '',
    };
  };

  /*
    コンポーネントの描画中にnavigateすると警告が出るため、エラーハンドリングに
    useEffectを使用して描画が終わってからnavigateするようにする
  */
  useEffect(() => {
    if (fetchSvcError) {
      if (fetchSvcError.message === SVC_NOT_FOUND) {
        navigate('/error/notFound');
      } else {
        navigate('/error');
      }
    }
  }, [fetchSvcError]);

  useLayoutEffect(() => {
    const svcVariables = { id: appId };
    const getCommentsBySvcIdVariables = { svcId: appId, page: 1, all: false };
    Promise.all([
      fetchSvc({ variables: svcVariables }),
      fetchCommentsBySvcId({ variables: getCommentsBySvcIdVariables }),
    ]).then(async (values) => {
      const commentOnSvcData = values[1].data.getCommentsBySvcId;
      setCommentsOnSvc(commentOnSvcData);

      const commentIds = commentOnSvcData.comments.map(
        (comment: Comment) => comment.id,
      );
      const getCommentsByCommentIdsVariables = { commentIds, page: 1 };

      // アプリについた全コメントへのコメントを1ページ分取得
      const {
        data: { getCommentsByCommentIds: getCommentsByCommentIdsResult },
      } = await fetchCommentsByCommentIds({
        variables: getCommentsByCommentIdsVariables,
      });
      const newCommentsOnCommentObjs = getCommentsByCommentIdsResult.map(
        (commentData: SimpleCommentsOnCommentObj) => ({
          ...commentData,
          isAllowedToShowComments: false,
          isAllowedToShowCreateForm: false,
          userComment: '',
        }),
      );
      setCommentsOnCommentObjs(newCommentsOnCommentObjs);
    });
  }, [appId]);

  type createCommentCardPropsKwargs = {
    anchorText?: string;
    handleAnchorClick?: () => void;
    thumbsUpColor?: string;
    thumbsDownColor?: string;
    handleFilePenClick?: () => void;
    handleTrashCanClick?: () => void;
  };

  const createCommentCardProps = (
    comment: Comment,
    // CommentCardコンポーンネントの必須のPropsは位置引数として設定
    countOfLikes: number,
    handleThumbsUpClick: () => Promise<void>,
    countOfDislikes: number,
    handleThumbsDownClick: () => Promise<void>,
    kwargs: createCommentCardPropsKwargs = {},
  ) => {
    const { content, createdAt, author, id } = comment;
    return {
      content,
      datetime: getDatetime(createdAt),
      handleUserBlockClick: () => navigate(`/user/${author.id}`),
      countOfLikes,
      handleThumbsUpClick: isAuthenticated
        ? handleThumbsUpClick
        : loginWithRedirect,
      countOfDislikes,
      handleThumbsDownClick: isAuthenticated
        ? handleThumbsDownClick
        : loginWithRedirect,
      id,
      userData: {
        icon: author.icon,
        username: author.username,
      },
      ...kwargs,
    };
  };

  type FavorabilityFuncVariables = {
    id: string;
    profileId: string;
  };

  // CommentsOnSvc変更後に再セットする関数
  const fetchAndSetCommentsOnSvc = async (
    page: number,
    all: boolean,
    // checksPage=trueならば現在のページが正確かどうかをチェックする
    checksPage?: boolean,
  ) => {
    const {
      data: {
        getCommentsBySvcId: { comments, count },
      },
    } = await fetchCommentsBySvcId({ variables: { svcId: app.id, page, all } });
    if (checksPage) {
      const newPage = checkAndGetPage(commentsOnSvc.page, count);
      setCommentsOnSvc({ comments, count, page: newPage });
    } else {
      setCommentsOnSvc({ comments, count, page });
    }
  };

  const getAddOrRemoveLikeFunction = (
    variables: FavorabilityFuncVariables,
    hasLiked: boolean,
    hasDisliked: boolean,
  ) => {
    const likeFunc: any = hasLiked ? removeLike : likeComment;
    if (hasDisliked) {
      return async () => {
        await removeDislike({ variables });
        await likeFunc({ variables });
      };
    }
    return async () => {
      await likeFunc({ variables });
    };
  };

  const getAddOrRemoveDislikeFunction = (
    variables: FavorabilityFuncVariables,
    hasLiked: boolean,
    hasDisliked: boolean,
  ) => {
    const dislikeFunc: any = hasDisliked ? removeDislike : dislikeComment;
    if (hasLiked) {
      return async () => {
        await removeLike({ variables });
        await dislikeFunc({ variables });
      };
    }
    return async () => {
      await dislikeFunc({ variables });
    };
  };

  const commentsOnSvcCards = useMemo(
    () =>
      commentsOnSvc.comments.map((comment: Comment) => {
        const subComments = commentsOnCommentObjs.find(
          (commentsOnCommentObj) =>
            commentsOnCommentObj.commentId === comment.id,
        );
        const count = subComments?.count;
        const isAllowedToShowComments = subComments?.isAllowedToShowComments;

        const kwargs: createCommentCardPropsKwargs = {};
        if (count) {
          kwargs.anchorText = isAllowedToShowComments
            ? '閉じる'
            : `返信をみる(${count})`;
          kwargs.handleAnchorClick = isAllowedToShowComments
            ? () => hideCommentsOnComment(comment.id)
            : () => showCommentsOnComment(comment.id);
        }

        if (profile.id === comment.author.id) {
          kwargs.handleFilePenClick = () => openCommentUpdateForm(comment);
          kwargs.handleTrashCanClick = () => openCommentDeleteForm(comment);
        }

        const countOfLikes = comment.likes.length;
        const countOfDislikes = comment.dislikes.length;
        const hasLiked = comment.likes.some(({ id }) => id === profile.id);
        const hasDisliked = comment.dislikes.some(
          ({ id }) => id === profile.id,
        );
        if (hasLiked) {
          kwargs.thumbsUpColor = 'black';
        }
        if (hasDisliked) {
          kwargs.thumbsDownColor = 'black';
        }
        const variables = {
          id: comment.id,
          profileId: profile.id,
        };
        const handleThumbsUpClick = async () => {
          const addOrRemoveLike = getAddOrRemoveLikeFunction(
            variables,
            hasLiked,
            hasDisliked,
          );
          await addOrRemoveLike();
          await fetchAndSetCommentsOnSvc(commentsOnSvc.page, true);
        };
        const handleThumbsDownClick = async () => {
          const addOrRemoveDislike = getAddOrRemoveDislikeFunction(
            variables,
            hasLiked,
            hasDisliked,
          );
          await addOrRemoveDislike();
          await fetchAndSetCommentsOnSvc(commentsOnSvc.page, true);
        };
        return createCommentCardProps(
          comment,
          countOfLikes,
          handleThumbsUpClick,
          countOfDislikes,
          handleThumbsDownClick,
          kwargs,
        );
        /*
      app.idを依存配列に入れないとコメントにグッド・バッドした時に
      メモリリークのエラーが発生する
      原因はapp.idの初期値が空文字列であり、app.idを依存配列に含めないと
      このスコープ内ではapp.idを空文字列として（fetchAndSetCommentsOnSvc内で）参照してしまうため
      解決策は以下の二つ
        1. このuseMemoの依存配列にapp.idを含める
        2. app.idの初期値にURLから取得したappIdを設定する
        3. app.idを使用しているfetchAndSetCommentsOnSvcをメモ化して依存配列に含める
      今回はコードの読みやすさを重視して1を採用
    */
      }),
    [commentsOnSvc, commentsOnCommentObjs, profile, app.id],
  );

  const getCommentsOnCommentCards = (commentId: string) => {
    const commentsOnComment = commentsOnCommentObjs.find(
      ({ commentId: id, isAllowedToShowComments }) =>
        id === commentId && isAllowedToShowComments,
    );
    if (commentsOnComment) {
      return commentsOnComment.comments.map((comment) => {
        const countOfLikes = comment.likes.length;
        const countOfDislikes = comment.dislikes.length;
        const hasLiked = comment.likes.some(({ id }) => id === profile.id);
        const hasDisliked = comment.dislikes.some(
          ({ id }) => id === profile.id,
        );
        const variables = {
          id: comment.id,
          profileId: profile.id,
        };

        const fetchCommentsByCommentIdVariables = {
          commentId,
          page: commentsOnComment.page,
          all: true,
        };

        const handleThumbsUpClick = async () => {
          const addOrRemoveLike = getAddOrRemoveLikeFunction(
            variables,
            hasLiked,
            hasDisliked,
          );
          await addOrRemoveLike();
          const {
            data: {
              getCommentsByCommentId: { comments, count },
            },
          } = await fetchCommentsByCommentId({
            variables: fetchCommentsByCommentIdVariables,
          });
          const { target, others: newArray } =
            getTargetCommentObjAndOthers(commentId);
          if (target) {
            target.comments = comments;
            target.count = count;
            newArray.push(target);
            setCommentsOnCommentObjs(newArray);
          } else {
            throw new Error('This CommentsOnCommentObj does not exist');
          }
        };

        const handleThumbsDownClick = async () => {
          const addOrRemoveDislike = getAddOrRemoveDislikeFunction(
            variables,
            hasLiked,
            hasDisliked,
          );
          await addOrRemoveDislike();
          const {
            data: {
              getCommentsByCommentId: { comments, count },
            },
          } = await fetchCommentsByCommentId({
            variables: fetchCommentsByCommentIdVariables,
          });
          const { target, others: newArray } =
            getTargetCommentObjAndOthers(commentId);
          if (target) {
            target.comments = comments;
            target.count = count;
            newArray.push(target);
            setCommentsOnCommentObjs(newArray);
          } else {
            throw new Error('This CommentsOnCommentObj does not exist');
          }
        };
        const kwargs: createCommentCardPropsKwargs = {};
        if (profile.id === comment.author.id) {
          kwargs.handleFilePenClick = () => openCommentUpdateForm(comment);
          kwargs.handleTrashCanClick = () => openCommentDeleteForm(comment);
        }
        if (hasLiked) {
          kwargs.thumbsUpColor = 'black';
        }
        if (hasDisliked) {
          kwargs.thumbsDownColor = 'black';
        }
        return createCommentCardProps(
          comment,
          countOfLikes,
          handleThumbsUpClick,
          countOfDislikes,
          handleThumbsDownClick,
          kwargs,
        );
      });
    }
    return [];
  };

  const isYourApp = () => {
    if (app.developer && app.developer.id === profile.id) {
      return true;
    }
    return (
      app.team &&
      app.team.members.map((member: Profile) => member.id).includes(profile.id)
    );
  };

  const isCommentOnSvc = (commentId: string) =>
    commentsOnSvc.comments.some((comment) => comment.id === commentId);

  const canCommentOnComment = (commentId: string) =>
    commentsOnCommentObjs.some(
      ({ commentId: id, isAllowedToShowCreateForm }) =>
        id === commentId && isAllowedToShowCreateForm,
    );

  const disablesCommentOnSvcCreation = () => {
    const newComment = options.newCommentOnSvc;
    const containsWhiteSpace = whiteSpaceExists(newComment);
    return !newComment || containsWhiteSpace || createCommentLoading;
  };

  const disablesCommentOnCommentCreation = (commentId: string) => {
    const commentsOnCommentObj = commentsOnCommentObjs.find(
      ({ commentId: id }) => id === commentId,
    );
    if (commentsOnCommentObj) {
      const newComment = commentsOnCommentObj.userComment;
      const containsWhiteSpace = whiteSpaceExists(newComment);
      return !newComment || containsWhiteSpace || createCommentLoading;
    }
    return true;
  };

  const disablesCommentEditing = () => {
    const newComment = options.updateOptions.targetComment.content;
    const containsWhiteSpace = whiteSpaceExists(newComment);
    return !newComment || containsWhiteSpace || updateCommentLoading;
  };

  const haveMoreCommentsOnSvc = commentsOnSvc.page * 10 < commentsOnSvc.count;

  const hasMoreCommentsOnComment = (commentId: string) => {
    const target = commentsOnCommentObjs.find(
      (commentsOnCommentObj) => commentsOnCommentObj.commentId === commentId,
    );
    if (target) {
      return target.page * 10 < target.count && target.isAllowedToShowComments;
    }
    return false;
  };

  const canShowModalWindow =
    options.updateOptions.isAllowedToShowUpdateForm ||
    options.deleteOptions.isAllowedToShowDeleteForm;

  return (
    <Template>
      <>
        <StyledContainer>
          <AppCard {...appCardProps} />
          {isYourApp() && (
            <Padding bottom="20px">
              <Button
                fontSize="0.9em"
                handleClick={() => navigate(`/edit/app/${appId}`)}
                height="30px"
                title="アプリを編集"
                width="200px"
              />
            </Padding>
          )}
          <Padding left="0px" right="0px" bottom="0px">
            <Text size={DEFAULT_SIZE} value="作成者" weight="bold" />
            <Padding bottom="50px" top="0px">
              {app.developer && (
                <Card
                  hasIcon
                  linkValue="ユーザーを見る"
                  {...developerCardProps}
                />
              )}
              {app.team && <Card linkValue="チームを見る" {...teamCardProps} />}
            </Padding>
          </Padding>
          <CardList cardList={cardList} />
          <Text
            size={DEFAULT_SIZE}
            value={`コメント(${commentsOnSvc.count})`}
            weight="bold"
          />
          {isAuthenticated ? (
            <Padding>
              <Padding left="0px" right="0px">
                <TextArea
                  handleChange={(value) =>
                    setOptions({ ...options, newCommentOnSvc: value })
                  }
                  placeholder="アプリへのコメントを入力"
                  id="commentOnSvc"
                  value={options.newCommentOnSvc}
                />
              </Padding>
              <Button
                disabled={disablesCommentOnSvcCreation()}
                handleClick={() => addNewCommentOnSvc()}
                title="コメントする"
              />
            </Padding>
          ) : (
            <Padding left="0px" right="0px">
              <Button
                background="navy"
                handleClick={loginWithRedirect}
                title="ログインしてコメントする"
              />
            </Padding>
          )}
          <StyledCommentBlock>
            {commentsOnSvc.count > 0 && (
              <div>
                <StyledCommentUl>
                  {commentsOnSvcCards.map(
                    (commentsOnSvcCard: CustomCommentCard) => {
                      const { id, ...commentCardProps } = commentsOnSvcCard;
                      return (
                        <li key={id}>
                          <Padding left="0px" right="0px">
                            <CommentCard {...commentCardProps} />
                            {canCommentOnComment(id) ? (
                              <div>
                                <Padding left="0px" right="0px">
                                  <TextArea
                                    placeholder="コメントへ返信する"
                                    id="commentOnComment"
                                    height="80px"
                                    {...newCommentOnCommentTextAreaProps(id)}
                                  />
                                </Padding>
                                <StyledTwoButtonContainer>
                                  <Button
                                    background={CANCEL}
                                    fontSize="0.9em"
                                    handleClick={() =>
                                      showOrHideCommentCreationFormForComment(
                                        id,
                                        false,
                                      )
                                    }
                                    height="30px"
                                    title="キャンセル"
                                    width="100px"
                                  />
                                  <Padding top="0px" right="0px" bottom="0px">
                                    <Button
                                      background={ACCEPT}
                                      disabled={disablesCommentOnCommentCreation(
                                        id,
                                      )}
                                      fontSize="0.9em"
                                      handleClick={() =>
                                        addNewCommentOnComment(id)
                                      }
                                      height="30px"
                                      title="コメント"
                                      width="100px"
                                    />
                                  </Padding>
                                </StyledTwoButtonContainer>
                              </div>
                            ) : (
                              <Padding left="0px" right="0px">
                                {isAuthenticated ? (
                                  <Button
                                    background="green"
                                    fontSize="0.9em"
                                    handleClick={() =>
                                      showOrHideCommentCreationFormForComment(
                                        id,
                                        true,
                                      )
                                    }
                                    height="25px"
                                    title="コメントする"
                                    width="100px"
                                  />
                                ) : (
                                  <Button
                                    background="navy"
                                    fontSize="0.8em"
                                    handleClick={loginWithRedirect}
                                    height="25px"
                                    title="ログインしてコメントする"
                                    width="180px"
                                  />
                                )}
                              </Padding>
                            )}
                            <StyledSubCommentUl>
                              {getCommentsOnCommentCards(id).map(
                                (commentsOnCommentCard) => {
                                  const {
                                    id: subCommentId,
                                    ...subCommentCardProps
                                  } = commentsOnCommentCard;
                                  return (
                                    <li key={subCommentId}>
                                      <CommentCard {...subCommentCardProps} />
                                    </li>
                                  );
                                },
                              )}
                              {hasMoreCommentsOnComment(id) && (
                                <a
                                  href="/not/navigate"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setMoreCommentsOnComment(id);
                                  }}
                                >
                                  もっとみる
                                </a>
                              )}
                            </StyledSubCommentUl>
                          </Padding>
                        </li>
                      );
                    },
                  )}
                  {haveMoreCommentsOnSvc && (
                    <a
                      href="/not/navigate"
                      onClick={(e) => {
                        e.preventDefault();
                        setMoreCommentsOnSvc();
                      }}
                    >
                      もっとみる
                    </a>
                  )}
                </StyledCommentUl>
              </div>
            )}
          </StyledCommentBlock>
        </StyledContainer>
        {canShowModalWindow && (
          <>
            <ModalOverlay
              closeOverlay={() =>
                setOptions({
                  ...options,
                  updateOptions: initialOptionsState.updateOptions,
                  deleteOptions: initialOptionsState.deleteOptions,
                })
              }
            />
            {options.updateOptions.isAllowedToShowUpdateForm && (
              <StyledModalWindow>
                <Text size="1.7em" value="投稿を編集する" weight="bold" />
                <StyledCommentUpdateFormContainer>
                  <TextArea
                    handleChange={(value) =>
                      setOptions({
                        ...options,
                        updateOptions: {
                          ...options.updateOptions,
                          targetComment: {
                            ...options.updateOptions.targetComment,
                            content: value,
                          },
                        },
                      })
                    }
                    id="updatedComment"
                    placeholder="コメントを入力"
                    value={options.updateOptions.targetComment.content}
                  />
                </StyledCommentUpdateFormContainer>
                <Padding>
                  <StyledTwoButtonContainer>
                    <Button
                      background={CANCEL}
                      fontSize="0.9em"
                      handleClick={() => initializeUpdateOptions()}
                      height="30px"
                      title="キャンセル"
                      width="100px"
                    />
                    <Padding top="0px" right="0px" bottom="0px">
                      <Button
                        background="green"
                        disabled={disablesCommentEditing()}
                        fontSize="0.9em"
                        handleClick={() => {
                          const targetCommentId =
                            options.updateOptions.targetComment.id;
                          const targetCommentContent =
                            options.updateOptions.targetComment.content;
                          return isCommentOnSvc(targetCommentId)
                            ? updateCommentOnSvc(
                              targetCommentId,
                              targetCommentContent,
                            )
                            : updateCommentOnComment(
                              targetCommentId,
                              targetCommentContent,
                            );
                        }}
                        height="30px"
                        title="保存"
                        width="70px"
                      />
                    </Padding>
                  </StyledTwoButtonContainer>
                </Padding>
              </StyledModalWindow>
            )}
            {options.deleteOptions.isAllowedToShowDeleteForm && (
              <StyledModalWindow>
                <Text size="1.7em" value="投稿を削除する" weight="bold" />
                <Padding>
                  <p>この投稿を削除しますか?</p>
                  <StyledP>
                    {options.deleteOptions.targetComment.content}
                  </StyledP>
                  <StyledTwoButtonContainer>
                    <Button
                      background={CANCEL}
                      fontSize="0.9em"
                      handleClick={() => initializeDeleteOptions()}
                      height="30px"
                      title="キャンセル"
                      width="100px"
                    />
                    <Padding top="0px" right="0px" bottom="0px">
                      <Button
                        background={DELETE}
                        disabled={deleteCommentLoading}
                        fontSize="0.9em"
                        handleClick={() => {
                          const targetCommentId =
                            options.deleteOptions.targetComment.id;
                          return isCommentOnSvc(targetCommentId)
                            ? deleteCommentOnSvc(targetCommentId)
                            : deleteCommentOnComment(targetCommentId);
                        }}
                        height="30px"
                        title="削除"
                        width="70px"
                      />
                    </Padding>
                  </StyledTwoButtonContainer>
                </Padding>
              </StyledModalWindow>
            )}
          </>
        )}
      </>
    </Template>
  );
};

const StyledContainer = styled.div`
  margin: 0 auto;
  padding: 35px 0;
  width: 80%;
`;

const StyledCommentBlock = styled.div`
  margin-top: 25px;
`;

const StyledCommentUl = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const StyledSubCommentUl = styled(StyledCommentUl)`
  margin: 0 0 20px auto;
  width: 95%;
`;

const StyledTwoButtonContainer = styled.div`
  display: flex;
  justify-content: end;
`;

const StyledModalWindow = styled.div`
  position: fixed;
  background: #fff;
  border-radius: 5px;
  overflow-y: scroll;
  height: 300px;
  width: 50%;
  inset: 0;
  margin: auto;
  padding: 20px;
`;

const StyledCommentUpdateFormContainer = styled.div`
  height: 170px;
  margin: 20px 0;
`;

const StyledP = styled.p`
  white-space: pre-wrap;
  min-height: 130px;
`;

export default AppDetailsPage;
