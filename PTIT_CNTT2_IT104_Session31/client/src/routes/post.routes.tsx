import { Navigate, type RouteObject } from 'react-router-dom';
import React from 'react';
import LazyLoader from '../components/base/LazyLoader';

const PostList = React.lazy(() => import('../pages/posts/PostList'));
const PostDetail = React.lazy(() => import('../pages/posts/PostDetail'));
const FormPost = React.lazy(() => import('../pages/posts/FormPost'));

const postRoutes: RouteObject[] = [
    {
        path: '/post-list',
        element: (
            <LazyLoader>
                <PostList />
            </LazyLoader>
        ),
    },
    {
        path: '/post-detail/:id',
        element: (
            <LazyLoader>
                <PostDetail />
            </LazyLoader>
        ),
    },
    {
        path: '/create-post',
        element: (
            <LazyLoader>
                <FormPost />
            </LazyLoader>
        ),
    },
    {
        index: true,
        element: <Navigate to="/post-list" replace />,
    },
];

export default postRoutes;
