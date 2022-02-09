import Avatar from 'components/Avatar';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Devit({
  id,
  avatar,
  username,
  content,
  createdat,
  timeago,
  imgURL = null,
  userid = null,
}) {
  const router = useRouter();

  const handleNavigation = (event) => {
    event.preventDefault();
    router.push('/status/[id]', `/status/${id}`);
  };

  return (
    <>
      <article onClick={handleNavigation}>
        <div>
          <Avatar alt={`@${username} avatar`} src={avatar} />
        </div>
        <section>
          <header>
            <strong>{username}</strong>
            <span> · </span>
            <Link
              href={{
                pathname: '/status/[id]',
                query: { id },
              }}
              as={`/status/${id}`}
            >
              <a>
                <time className="date" title={createdat}>
                  {timeago}
                </time>
              </a>
            </Link>
          </header>
          <p>{content}</p>
          {imgURL && <img src={imgURL} />}
        </section>
      </article>
      <style jsx>{`
        article {
          border-bottom: 1px solid #eee;
          display: flex;
          padding: 10px 15px;
        }
        article:hover {
          background: #ccc;
          cursor: pointer;
        }
        img {
          border-radius: 10px;
          height: auto;
          margin-top: 10px;
          width: 100%;
        }
        div {
          padding-right: 10px;
        }
        p {
          line-height: 1.3125;
          margin: 0;
        }
        time {
          color: #555;
          font-size: 14px;
        }
        header > a {
          color: #555;
          font-size: 0.9rem;
          text-decoration: none;
        }
        header > a:hover {
          text-decoration: underline;
        }
        a {
          text-decoration: none;
        }
      `}</style>
    </>
  );
}
