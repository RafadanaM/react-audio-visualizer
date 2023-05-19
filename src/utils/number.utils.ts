function formatProgress(timeSeconds: number) {
  const minute = Math.floor(timeSeconds / 60);
  const minuteString = `${minute < 10 ? "0" : ""}${minute}`;
  const second = Math.floor(timeSeconds % 60);
  const secondString = `${second < 10 ? "0" : ""}${second}`;

  return `${minuteString}:${secondString}`;
}

export { formatProgress };
