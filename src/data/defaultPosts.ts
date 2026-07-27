import type { Post } from '../types'

export const defaultPosts: Post[] = [
  {
    id: '1',
    title: 'Deep dives into modern web architecture',
    content:
      'A short intro on SPA architecture, performance tradeoffs, and UX nuances. Explore client-side routing, hydration, and minimal bundles.',
    image: 'https://picsum.photos/seed/web-architecture/1200/700',
    category: 'INFO',
    date: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Sustainable practices for cities',
    content: 'How small changes in policy and tech can create greener and smarter urban environments.',
    image: 'https://picsum.photos/seed/sustainable-cities/600/400',
    category: 'MEMORIES',
    date: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Culture in a remote-first world',
    content: 'Maintaining creative communities and rituals when teams spread across time zones.',
    image: 'https://picsum.photos/seed/remote-culture/600/400',
    category: 'MEMORIES',
    date: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Tooling that makes dev life easier',
    content: 'Small, practical tips and tool recommendations for daily coding flow.',
    image: 'https://picsum.photos/seed/dev-tooling/600/400',
    category: 'INFO',
    date: new Date().toISOString(),
  },
]
