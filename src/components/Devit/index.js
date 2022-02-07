import Avatar from 'components/Avatar';

export default function Devit({
  id,
  avatar,
  username,
  content,
  userid,
  createdat,
}) {
  return (
    <>
      <article>
        <div>
          <Avatar alt={username} src={avatar} />
        </div>
        <section>
          <strong>@{username}</strong>
          <span> · </span>
          <date>{createdat}</date>
        </section>
        <p>{content}</p>
      </article>
      <style jsx>{`
        article {
          display: flex;
          padding: 0.8rem 1rem;
          border-bottom: 0.1rem solid #eaf7ff;
        }
        div {
          padding-right: 0.6rem;
        }
        p {
          margin: 0;
          line-height: 1.3125;
        }
        span {
          margin: 0 0.5rem;
        }
        date {
          color: #555;
          font-size: 0.9rem;
        }
      `}</style>
    </>
  );
}
