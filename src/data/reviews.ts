/**
 * Customer reviews for the gallery's feedback section.
 *
 * Only real reviews go here, each with the customer's consent to publish
 * it: their words unchanged, first name and initial (or initials), the town,
 * the month, and the service. The section shows the cards as soon as this
 * list has entries; while it is empty it only invites customers to send one.
 * (Invented or edited testimonials are misleading and not allowed.)
 */
export interface Review {
  text: string;
  /** e.g. "Markus S." */
  name: string;
  /** e.g. "Wuppertal-Barmen" */
  place: string;
  /** e.g. "März 2026" */
  date: string;
  /** service slug, e.g. "horizontalsperre" */
  service?: string;
  /** 1 to 5, only if the customer gave stars */
  stars?: number;
}

export const REVIEWS: Review[] = [];
