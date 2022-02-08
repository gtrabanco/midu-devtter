import Avatar from 'components/Avatar';

export default function Devit({
  id,
  avatar,
  username,
  content,
  createdat,
  imgURL = null,
  userid = null,
}) {
  return (
    <>
      <article>
        <div>
          <Avatar alt={`@${username} avatar`} src={avatar} />
        </div>
        <section>
          <header>
            <strong>{username}</strong>
            <span> · </span>
            <div className="date" title={createdat}>
              {createdat}
            </div>
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
        .date {
          color: #555;
          font-size: 14px;
        }
      `}</style>
    </>
  );
}
