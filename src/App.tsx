import React, { useEffect } from 'react';
import 'bulma/bulma.sass';
import '@fortawesome/fontawesome-free/css/all.css';
import './App.scss';

import classNames from 'classnames';
import { PostsList } from './components/PostsList';
import { PostDetails } from './components/PostDetails';
import { UserSelector } from './components/UserSelector';
import { Loader } from './components/Loader';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { fetchUsers } from './features/usersSlice';
import { clearPosts, fetchPosts } from './features/postsSlice';
import { currentPostSelector, selectedUserSelector } from './utils/selectors';
import { selectCurrentPostId } from './features/currentPostSlice';

export const App: React.FC = () => {
  const {
    posts,
    postsIsLoading,
    postsIsError,
  } = useAppSelector(state => state.postsState);
  const author = useAppSelector(selectedUserSelector);
  const selectedPost = useAppSelector(currentPostSelector);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  useEffect(() => {
    dispatch(selectCurrentPostId(null));

    if (author) {
      dispatch(fetchPosts(author.id));
    } else {
      dispatch(clearPosts());
    }
  }, [author?.id]);

  return (
    <main className="section">
      <div className="container">
        <div className="tile is-ancestor">
          <div className="tile is-parent">
            <div className="tile is-child box is-success">
              <div className="block">
                <UserSelector />
              </div>

              <div className="block" data-cy="MainContent">
                {!author && (
                  <p data-cy="NoSelectedUser">
                    No user selected
                  </p>
                )}

                {author !== null && postsIsLoading && (
                  <Loader />
                )}

                {author && !postsIsLoading && postsIsError && (
                  <div
                    className="notification is-danger"
                    data-cy="PostsLoadingError"
                  >
                    Something went wrong!
                  </div>
                )}

                {author
                && !postsIsLoading && !postsIsError
                && posts.length === 0 && (
                  <div className="notification is-warning" data-cy="NoPostsYet">
                    No posts yet
                  </div>
                )}

                {author && !postsIsLoading
                && !postsIsError && posts.length > 0 && (
                  <PostsList />
                )}
              </div>
            </div>
          </div>

          <div
            data-cy="Sidebar"
            className={classNames(
              'tile',
              'is-parent',
              'is-8-desktop',
              'Sidebar',
              {
                'Sidebar--open': selectedPost,
              },
            )}
          >
            <div className="tile is-child box is-success ">
              {selectedPost && (
                <PostDetails post={selectedPost} />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
