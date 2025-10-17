export const slugify = (value: string): string => {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .replace(/[^a-z0-9]+/g, "-") // non-alphanum to hyphen
    .replace(/^-+|-+$/g, ""); // trim hyphens
};

