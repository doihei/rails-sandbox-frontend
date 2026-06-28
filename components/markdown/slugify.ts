export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w぀-ヿ㐀-鿿豈-﫿-]/g, '')
}
