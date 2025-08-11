export interface FeaturedCategory {
  name: string;
  imageUrl: string;
}

export interface HeroBanner {
  id?: string;
  imageUrl: string;
  title?: string;
  buttonText?: string;
  buttonLink?: string;
  featuredCategories?: FeaturedCategory[];
  lastUpdated?: Date;
}
