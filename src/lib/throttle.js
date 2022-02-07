let throttlePause;

export default function throttle(callback, time) {
  if (throttlePause) return;
  throttlePause = true;

  return setTimeout(() => {
    callback();

    throttlePause = false;
  }, time);
}
