import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/site-config'
import { fetchTaskPosts } from '@/lib/task-data'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'

export const FOOTER_OVERRIDE_ENABLED = true


const getCategoryLabel = (value: string) => {
  const normalized = normalizeCategory(value)
  return CATEGORY_OPTIONS.find((item) => item.slug === normalized)?.name || value
}


export async function FooterOverride() {
  const posts = await fetchTaskPosts('mediaDistribution', 200, { allowMockFallback: false })
  const categories = Array.from(
    new Map(
      posts
        .map((post) => {
          const content = post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
          const raw = typeof content.category === 'string' ? content.category.trim() : ''
          if (!raw) return null
          const slug = normalizeCategory(raw)
          return { slug, name: getCategoryLabel(raw) }
        })
        .filter((item): item is { slug: string; name: string } => Boolean(item))
        .map((item) => [item.slug, item])
    ).values()
  ).slice(0, 8)

  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-neutral-600 sm:px-6">

        {categories.length ? (
          <div className="mb-8 pb-8 border-b border-neutral-200">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-3">Categories</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/press-wire?category=${category.slug}`}
                  className="text-neutral-600 underline-offset-4 transition hover:text-neutral-900 hover:underline"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/about" className="hover:text-neutral-900 transition">About</Link>
            <Link href="/contact" className="hover:text-neutral-900 transition">Contact</Link>
            <Link href="/privacy" className="hover:text-neutral-900 transition">Privacy</Link>
            <Link href="/terms" className="hover:text-neutral-900 transition">Terms</Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
