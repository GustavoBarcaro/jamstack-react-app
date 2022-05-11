import { GetStaticProps } from 'next';
import Head from 'next/head';
import Prismic from '@prismicio/client';
import { useEffect } from 'react';
import { getPrismicClient } from '../services/prismic';
import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { PostItem, Post } from '../components/Post';

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({
  postsPagination,
}: HomeProps): React.ReactElement {
  useEffect(() => {
    console.log(postsPagination);
  }, [postsPagination]);
  return (
    <>
      <Head>
        <title>Home | Spacetraveling</title>
      </Head>
      <main className="main">
        <section className="content">
          {postsPagination?.results?.map(each => (
            <PostItem post={each} />
          ))}
        </section>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
      pageSize: 100,
    }
  );
  console.log(JSON.stringify(postsResponse, null, 2));
  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results: postsResponse.results,
      },
    },
  };
};
