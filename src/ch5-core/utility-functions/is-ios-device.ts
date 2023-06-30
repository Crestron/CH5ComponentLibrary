
export function isIosDevice(): boolean {
  if ((window.navigator.platform === 'iPad' || window.navigator.platform === 'iPhone') && navigator.maxTouchPoints >= 1) {
    if (/iPad|iPhone/.test(window.navigator.userAgent)) {
      return true;
    }
  } else if (window.navigator.platform === 'MacIntel') {
    if (/Macintosh/.test(window.navigator.userAgent)) {
      return true;
    }
  }
  return false;
}