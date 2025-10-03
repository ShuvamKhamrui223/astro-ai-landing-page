export function slugify(normalString: string) {
  return normalString.toLowerCase().replaceAll(" ", "-");
}
