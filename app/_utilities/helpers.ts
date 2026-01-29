export function capitalize(text: string): string {
  /**
   * Capitalize the first letter in a string
   */
  return text[0].toLocaleUpperCase() + text.substring(1)
}
