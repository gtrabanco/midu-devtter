export default function Spinner({
  size = '5',
  unit = 'rem',
  strokeColor = '#0ac8a6',
  strokeSize = 10,
}) {
  return (
    <>
      <svg>
        <circle cx="100" cy="100" r={`${50 - strokeSize / 2}`}></circle>
      </svg>
      <style jsx>{`
        svg {
          viewbox: 0 0 100 100;
          max-width: 100%;
          fill: transparent;
          overflow: hidden;
        }
        circle {
          max-width: 100%;
          animation: 1.4s ease-in-out infinite both circle-animation;
          display: block;
          fill: transparent;
          stroke: ${strokeColor};
          stroke-position: inside;
          stroke-linecap: round;
          stroke-dasharray: 283;
          stroke-dashoffset: 280;
          stroke-width: 0.5rem;
          transform-origin: 50% 50%;
        }
        @keyframes circle-animation {
          25% {
            stroke-dashoffset: 270;
          }

          50% {
            stroke-dashoffset: 75;
          }

          75% {
            stroke-dashoffset: 280;
          }
          0% {
            stroke-dashoffset: 360;
          }
        }
      `}</style>
    </>
  );
}
