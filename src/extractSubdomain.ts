export default function extractSubdomain(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    const match = hostname.match(/\.([^.]+)\./);
    return match ? match[1] : "Error getting domain";
  } catch (e) {
    console.error("Invalid URL ", e);
    return "Error geting domain";
  }
}
