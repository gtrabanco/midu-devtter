export default function Button({ children, onClick, ...props }) {
  return (
    <>
      <button onClick={onClick} {...props}>
        {children}
      </button>
      <style jsx>{`
        button {
          background: var(--color-black);
          color: var(--color-white);
          font-weight: 800;
          font-size: 1rem;
          border: none;
          border-radius: 99rem;
          cursor: pointer;
          padding: 0.3rem 1.2rem;
          transition: opacity 0.3s ease;
          display: inline-block;
          user-select: none;
        }

        button:hover {
          opacity: 0.7;
          background: radial-gradient(var(--color-black), #666);
        }

        button > :global(svg) {
          margin-right: 0.5rem;
        }

        button[disabled] {
          background: #ccc;
          cursor: not-allowed;
          pointer-events: none;
        }
      `}</style>
    </>
  );
}
