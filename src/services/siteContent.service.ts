import { prisma } from '@/lib/prisma';
import { HomepageContent, DEFAULT_HOMEPAGE_CONTENT } from '@/types/siteContent';

export { DEFAULT_HOMEPAGE_CONTENT };
export type { HomepageContent };

/**
 * Fetch all Homepage content sections from DB (with fallback to defaults)
 */
export async function getHomepageContent(): Promise<HomepageContent> {
  try {
    const record = await prisma.siteContent.findUnique({
      where: { section: 'homepage' },
    });

    if (!record || !record.dataJson) {
      return DEFAULT_HOMEPAGE_CONTENT;
    }

    const parsed = JSON.parse(record.dataJson);
    return {
      ...DEFAULT_HOMEPAGE_CONTENT,
      ...parsed,
      hero: { ...DEFAULT_HOMEPAGE_CONTENT.hero, ...(parsed.hero || {}) },
      services: { ...DEFAULT_HOMEPAGE_CONTENT.services, ...(parsed.services || {}) },
      serviceArea: { ...DEFAULT_HOMEPAGE_CONTENT.serviceArea, ...(parsed.serviceArea || {}) },
      concepts: { ...DEFAULT_HOMEPAGE_CONTENT.concepts, ...(parsed.concepts || {}) },
      testimonials: { ...DEFAULT_HOMEPAGE_CONTENT.testimonials, ...(parsed.testimonials || {}) },
      contact: { ...DEFAULT_HOMEPAGE_CONTENT.contact, ...(parsed.contact || {}) },
    };
  } catch (error) {
    console.error('Failed to load site content from DB, returning defaults:', error);
    return DEFAULT_HOMEPAGE_CONTENT;
  }
}

/**
 * Save Homepage content sections to DB
 */
export async function updateHomepageContent(data: Partial<HomepageContent>): Promise<HomepageContent> {
  const current = await getHomepageContent();
  const updated: HomepageContent = {
    ...current,
    ...data,
    hero: { ...current.hero, ...(data.hero || {}) },
    services: { ...current.services, ...(data.services || {}) },
    serviceArea: { ...current.serviceArea, ...(data.serviceArea || {}) },
    concepts: { ...current.concepts, ...(data.concepts || {}) },
    testimonials: { ...current.testimonials, ...(data.testimonials || {}) },
    contact: { ...current.contact, ...(data.contact || {}) },
  };

  await prisma.siteContent.upsert({
    where: { section: 'homepage' },
    update: {
      dataJson: JSON.stringify(updated),
    },
    create: {
      section: 'homepage',
      dataJson: JSON.stringify(updated),
    },
  });

  return updated;
}
