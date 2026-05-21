import { prisma } from "@pkf/database";

export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  const row = await prisma.siteSetting.findUnique({ where: { key } });
  if (!row?.value) return fallback;
  try {
    return JSON.parse(row.value) as T;
  } catch {
    return fallback;
  }
}

export async function setSetting(key: string, value: unknown): Promise<void> {
  const payload = JSON.stringify(value);
  await prisma.siteSetting.upsert({
    where: { key },
    create: { key, value: payload },
    update: { value: payload },
  });
}
