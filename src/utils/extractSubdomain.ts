export default function extractSubdomain(url: string): string {
  const hostname = new URL(url).hostname;
  const match = hostname.match(/\.([^.]+)\./);

  if (!match) {
    throw new Error(`Error getting domain from ${hostname}`);
  }

  return match[1];
}
