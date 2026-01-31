// List of admin emails
export const ADMIN_EMAILS = [
  "jitendra.choudhary@flame.edu.in",
  "prajas.naik@flame.edu.in",
];

export function isAdmin(email: string | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
