import Devit from 'components/Devit';
import Create from 'components/icons/Create';
import Home from 'components/icons/Home';
import Search from 'components/icons/Search';
import { fetchLatestDevits } from 'fb/client';
import useUser from 'hooks/useUser';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { colors } from 'styles/theme';

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
      <Head>
        <title>Inicio / Devter</title>
      </Head>
      <header>
        <h2>Inicio</h2>
      </header>
      <section>
        {timeline &&
          timeline.map(
            ({
              id,
              avatar,
              userName,
              content,
              userId,
              createdAt,
              timeago,
              imgURL = null,
            }) => (
              <Devit
                id={id}
                key={id}
                avatar={avatar}
                username={userName}
                content={content}
                userid={userId}
                createdat={createdAt}
                timeago={timeago}
                imgURL={imgURL}
              />
            )
          )}
      </section>
      <nav>
        <Link href="/home">
          <a>
            <Home width={32} height={32} stroke="#09f" />
          </a>
        </Link>
        <Link href="/search">
          <a>
            <Search width={32} height={32} stroke="#09f" />
          </a>
        </Link>
        <Link href="/compose/create">
          <a>
            <Create width={32} height={32} stroke="#09f" />
          </a>
        </Link>
      </nav>
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
        section {
          flex: 2;
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
          display: flex;
          height: 49px;
          position: sticky;
          width: 100%;
        }
        nav a {
          align-items: center;
          display: flex;
          flex: 1 1 auto;
          height: 100%;
          justify-content: center;
        }
        nav a:hover {
          background: radial-gradient(#0099ff22 15%, transparent 16%);
          background-size: 180px 180px;
          background-position: center;
        }
        nav a:hover > :global(svg) {
          stroke: ${colors.primary};
        }
      `}</style>
    </>
  );
}
