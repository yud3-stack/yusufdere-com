function normalizeEmail(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

export function isAdminEmail(email: string | null | undefined) {
  const adminEmail = normalizeEmail(process.env.ADMIN_EMAIL);
  const userEmail = normalizeEmail(email);

  if (!adminEmail || !userEmail) {
    return false;
  }

  return adminEmail === userEmail;
}
