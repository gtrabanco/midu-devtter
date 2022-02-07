import Devit from 'components/Devit';
import { fetchLatestDevits } from 'fb/client';
import useUser from 'hooks/useUser';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [timeline, setTimeline] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    user &&
      fetchLatestDevits()
        .then((data) => {
          setTimeline(data);
        })
        .catch(() => setTimeline([]));
  }, [setTimeline, user]);
  return (
    <>
      <header>
        <h2>Inicio</h2>
      </header>
      <section>
        {timeline &&
          timeline.map(
            ({ id, avatar, userName, content, userId, createdAt }) => (
              <Devit
                id={id}
                key={id}
                avatar={avatar}
                username={userName}
                content={content}
                userid={userId}
                createdat={createdAt}
              />
            )
          )}
      </section>
      <nav></nav>
      <style jsx>{`
        header {
          align-items: center;
          background: #ffffffaa;
          backdrop-filter: blur(5px);
          border-bottom: 1px solid #eee;
          height: 49px;
          display: flex;
          position: sticky;
          top: 0;
          width: 100%;
        }
        h2 {
          font-size: 21px;
          font-weight: 800;
          padding-left: 15px;
        }
        nav {
          background: #fff;
          bottom: 0;
          border-top: 1px solid #eee;
          height: 49px;
          position: sticky;
          width: 100%;
        }
      `}</style>
    </>
  );
}
