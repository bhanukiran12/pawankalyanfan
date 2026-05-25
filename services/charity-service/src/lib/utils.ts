export function makeSlug(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .slice(0, 72) +
    "-" +
    Date.now().toString(36)
  );
}

export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 6) return "****";
  return `${digits.slice(0, 2)}****${digits.slice(-4)}`;
}

export function publicBloodRequest<T extends Record<string, unknown>>(
  row: T,
  reveal: boolean,
): T & { phone: string; alternatePhone?: string | null; whatsapp?: string | null } {
  const phone = String(row.phone ?? "");
  const alternatePhone = row.alternatePhone ? String(row.alternatePhone) : null;
  const whatsapp = row.whatsapp ? String(row.whatsapp) : null;
  return {
    ...row,
    phone: reveal ? phone : maskPhone(phone),
    alternatePhone: alternatePhone ? (reveal ? alternatePhone : maskPhone(alternatePhone)) : null,
    whatsapp: whatsapp ? (reveal ? whatsapp : maskPhone(whatsapp)) : null,
  };
}

export function urgencyWeight(urgency: string): number {
  if (urgency === "CRITICAL") return 3;
  if (urgency === "URGENT") return 2;
  return 1;
}
