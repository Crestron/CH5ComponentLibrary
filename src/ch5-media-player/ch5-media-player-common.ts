export const createElement = (tagName: string, clsName: string[] = [], textContent: string = '') => {
  const element = document.createElement(tagName);
  if (clsName.length !== 0) { clsName.forEach((cs: string) => element.classList.add(cs)) }
  if (textContent !== '') { element.textContent = textContent; }
  return element;
};

// Utility: format time
export const formatTime = (seconds: number = 0): string => {
  const secs = Math.max(0, Math.floor(Number(seconds) || 0));
  const hr = Math.floor(secs / 3600);
  const min = Math.floor((secs % 3600) / 60);
  const sec = secs % 60;
  const toTwoDigits = (n: number) => (n < 10 ? '0' + n : String(n));
  return hr > 0 ? `${toTwoDigits(hr)}:${toTwoDigits(min)}:${toTwoDigits(sec)}` : `${toTwoDigits(min)}:${toTwoDigits(sec)}`;
};
