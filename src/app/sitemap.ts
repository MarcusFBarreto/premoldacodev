import { MetadataRoute } from 'next'
import { products, projects, articles } from '@/lib/data'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.premoldaco.com.br';

  const productUrls = products.map(product => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const projectUrls = projects.map(project => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const articleUrls = articles.map(article => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
        url: `${baseUrl}/recommendations`,
        lastModified: new Date(),
        changeFrequency: 'yearly' as const,
        priority: 0.8,
    },
    {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
  ]
 
  return [
    ...staticUrls,
    ...productUrls,
    ...projectUrls,
    ...articleUrls
  ];
}
