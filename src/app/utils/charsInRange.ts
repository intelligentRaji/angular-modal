export default function charsInRange(start: string, end: string): string[] {
  const result = [];
  let charCode = start.charCodeAt(0);
  const endCharCode = end.charCodeAt(0);

  while (charCode <= endCharCode) {
    result.push(String.fromCharCode(charCode));
    charCode += 1;
  }

  return result;
}
