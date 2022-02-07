import Button from 'components/Button';
import { addDevit } from 'fb/client';
import useUser from 'hooks/useUser';
import { useRouter } from 'next/router';
import { useState } from 'react';

const COMPOSE_STATES = {
  ERROR: -1,
  USER_NOT_KNOWN: 0,
  LOADING: 1,
  SUCCESS: 2,
};

export default function ComposeTweet() {
  const { user } = useUser();
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(COMPOSE_STATES.USER_NOT_KNOWN);
  const router = useRouter();

  const handleChange = (event) => {
    setMessage(event.target?.value ?? '');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setStatus(COMPOSE_STATES.LOADING);
    addDevit({
      avatar: user.avatar,
      userName: user.username,
      userId: user.uid,
      content: message,
    })
      .then((data) => {
        setStatus(COMPOSE_STATES.SUCCESS);
        router.push('/home');
      })
      .catch((err) => {
        console.error(err);
        setStatus(COMPOSE_STATES.ERROR);
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="¿Qué está pasando?"
          value={message}
          onChange={handleChange}
        ></textarea>
        <div>
          <Button
            disabled={message.length === 0 || status === COMPOSE_STATES.LOADING}
          >
            Devittear
          </Button>
        </div>
        <div>
          <p>{message.length ?? 0}/200</p>
        </div>
      </form>
      {status === COMPOSE_STATES.ERROR && (
        <div className="error">
          <p>The devit could not be posted</p>
        </div>
      )}

      <style jsx>{`
        textarea {
          outline: 0;
          margin: 0;
          width: 100%;
          min-height: 13rem;
          height: auto;
          border: 0;
          padding: 1rem;
          resize: none;
          font-size: 1.4rem;
        }

        form > div {
          padding: 0 1rem;
          width: 80%;
        }
        .error {
          color: red;
          font-weight: 800;
          text-align: center;
        }
      `}</style>
    </>
  );
}
