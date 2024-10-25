export function sleep(n: number = 500) {
  return new Promise((r) => setTimeout(r, n));
}
