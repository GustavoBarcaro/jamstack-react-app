import { GetStaticPaths, GetStaticProps } from 'next';
import { useState, useEffect } from 'react';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import { useRouter } from 'next/router';
import { FiUser, FiCalendar, FiClock } from 'react-icons/fi';
import { format, parseISO } from 'date-fns';
import { getPrismicClient } from '../../services/prismic';
import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: { url: string };
    author: string;
    content: { heading: string; body: { text: string }[] }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const router = useRouter();
  const [timeToRead, setTimeToRead] = useState('');
  useEffect(() => {
    const text = RichText.asText(post.data.content[0].body);
    const textSize = text.split(/\s+/).length;
    const wordsPerMinute = 200;
    const textTime = Math.ceil(textSize / wordsPerMinute);
    setTimeToRead(`${textTime} min`);
  }, [post.data.content]);

  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  return (
    <main className="main">
      <section className={styles.bannerContainer}>
        <figure>
          <img src={post.data.banner.url} alt="post banner" />
        </figure>
      </section>
      <div className="content">
        <section>
          <h2 className={styles.title}>{post.data.title}</h2>
          <div className={styles.infos}>
            <time className={styles.date}>
              <i className={styles.icon}>
                <FiCalendar />
              </i>
              {format(parseISO(post.first_publication_date), 'dd MMM yyyy')}
            </time>
            <address className={styles.author}>
              <i className={styles.icon}>
                <FiUser />
              </i>
              {post.data.author}
            </address>
            <p className={styles.time}>
              <i className={styles.icon}>
                <FiClock />
              </i>
              {timeToRead}
            </p>
          </div>
        </section>
        <section className={styles.content}>
          {post.data.content.map(each => (
            <>
              <h2>{each.heading}</h2>
              <div
                className={styles.postContent}
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: RichText.asHtml(each.body),
                }}
              />
            </>
          ))}
        </section>
      </div>
    </main>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['posts.uid'],
      pageSize: 100,
    }
  );
  const paths = posts?.results?.map(each => ({
    params: {
      slug: each.uid,
    },
  }));
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const prismic = getPrismicClient();
  const response = await prismic.getByUID(
    'posts',
    context.params.slug as string,
    null,
    null
  );
  return {
    props: {
      post: response,
    },
  };
};
