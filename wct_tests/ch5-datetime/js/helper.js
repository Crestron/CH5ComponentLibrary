async function runSinonSetTimeout(time, clock) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
    clock && clock.tick(time);
  });
}

async function runSinonTimer(time, clock) {
  await runSinonSetTimeout(time, clock);
}
