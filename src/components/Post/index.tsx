import Link from 'next/link';
import { FiUser, FiCalendar } from 'react-icons/fi';
import { format, parseISO } from 'date-fns';
import styles from './post.module.scss';

export type Post = {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle?: string;
    author: string;
  };
};

interface PostProps {
  post: Post;
}

export function PostItem({ post }: PostProps): JSX.Element {
  return (
    <Link href={`/post/${post?.uid}`}>
      <article className={styles.article}>
        <h2 className={styles.title}>{post.data.title}</h2>
        <p className={styles.description}>{post.data.subtitle}</p>
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
        </div>
      </article>
    </Link>
  );
}
