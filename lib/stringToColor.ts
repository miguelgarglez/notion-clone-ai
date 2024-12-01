/**
 * Converts a given string to a hexadecimal color code.
 *
 * This function generates a color code based on the hash of the input string.
 * The same input string will always produce the same color code.
 *
 * @param str - The input string to convert to a color code.
 * @returns A hexadecimal color code in the format `#RRGGBB`.
 */
function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();

  return '#' + '00000'.substring(0, 6 - c.length) + c;
}

export default stringToColor;
