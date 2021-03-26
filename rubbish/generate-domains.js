const asciiStart = 97;
const asciiCount = 26;

const makeElements = count => new Array(count)
  .fill(null)
  .map((_, index) => index);

const { domains } = makeElements(20000).reduce(({ cursor, domains }, n) => ({
  domains: domains.concat(`${domains[cursor] || ''}${String.fromCharCode(asciiStart + n % asciiCount)}`),
  cursor: cursor + ((n + 1) % asciiCount ? 0 : 1),
}), { cursor: -1, domains: [] })

console.log(domains.map(d => `${d}.com`).join('\n'));
