export function capitalize(text: string): string {
  /**
   * Capitalize the first letter in a string
   */
  return text[0].toLocaleUpperCase() + text.substring(1)
}

export function chunk<T>(arr: T[], size: number): T[][] {
  /**
   * Breaks down a large array into smaller array chunks
   */
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}
