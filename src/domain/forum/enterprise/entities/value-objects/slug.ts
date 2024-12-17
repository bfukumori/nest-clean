export class Slug {
  private constructor(public value: string) {}
  /**
   * Receives a string and normalize it as a slug.
   *
   * Example: "An example title" => "an-example-title"
   *
   * @param text
   */

  static create(slug: string): Slug {
    return new Slug(slug);
  }

  static createFromText(text: string): Slug {
    const slugText = text
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-') // Replace spaces with dashes
      .replace(/[^a-z0-9-]/g, '') // Remove any characters that are not a-z, 0-9, or dashes
      .replace(/-+/g, '-') // Replace consecutive dashes with a single dash
      .replace(/^-+|-+$/g, ''); // Remove leading or trailing dashes
    return new Slug(slugText);
  }
}
