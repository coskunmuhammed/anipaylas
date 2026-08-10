import { prisma } from '@/lib/prisma';
import { HomepageContent, DEFAULT_HOMEPAGE_CONTENT } from '@/types/siteContent';
import { ServiceItem, servicesData } from '@/data/services';

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

/**
 * Fetch all Services content details from DB (with fallback to default servicesData)
 */
export async function getServicesContent(): Promise<ServiceItem[]> {
  try {
    const record = await prisma.siteContent.findUnique({
      where: { section: 'serviceDetails' },
    });

    if (!record || !record.dataJson) {
      return servicesData;
    }

    const parsed: ServiceItem[] = JSON.parse(record.dataJson);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return servicesData;
    }

    return servicesData.map((defaultItem) => {
      const found = parsed.find((item) => item.slug === defaultItem.slug || item.id === defaultItem.id);
      if (found) {
        return {
          ...defaultItem,
          ...found,
          galleryPhotos: found.galleryPhotos || defaultItem.galleryPhotos || [],
        };
      }
      return defaultItem;
    });
  } catch (error) {
    console.error('Failed to load service details from DB:', error);
    return servicesData;
  }
}

/**
 * Save Services content details to DB
 */
export async function updateServicesContent(items: ServiceItem[]): Promise<ServiceItem[]> {
  await prisma.siteContent.upsert({
    where: { section: 'serviceDetails' },
    update: {
      dataJson: JSON.stringify(items),
    },
    create: {
      section: 'serviceDetails',
      dataJson: JSON.stringify(items),
    },
  });

  return items;
}
