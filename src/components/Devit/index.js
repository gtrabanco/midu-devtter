import Avatar from 'components/Avatar';

export default function Devit({ id, avatar, username, message }) {
  return (
    <>
      <article>
        <Avatar alt={username} src={avatar} />
        <p>{message}</p>
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
        }
      `}</style>
    </>
  );
}
