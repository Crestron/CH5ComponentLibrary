export const createElement = (tagName: string, clsName: string[] = [], textContent: string = '') => {
  const element = document.createElement(tagName);
  if (clsName.length !== 0) { clsName.forEach((cs: string) => element.classList.add(cs)) }
  if (textContent !== '') { element.textContent = textContent; }
  return element;
};

// Utility: format time
export const formatTime = (seconds: number = 0): string => {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
};