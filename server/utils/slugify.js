const slugify = (value = "") =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

export const generateUniqueSlug = async (
  repository,
  sourceValue,
  excludeId,
) => {
  const baseSlug = slugify(sourceValue) || "item";
  let slug = baseSlug;
  let counter = 1;

  while (await repository.existsBySlug(slug, excludeId)) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return slug;
};

export default slugify;
