export function formatCommonName(commonName: string): string {
  return commonName.toLowerCase().replace(/\s/g, '-');
}
