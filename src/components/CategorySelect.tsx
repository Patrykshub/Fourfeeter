export const NAV_CATEGORIES = ['HOME', 'MEMORIES', 'INFO'] as const

export type Category = (typeof NAV_CATEGORIES)[number]

export const POST_CATEGORIES = NAV_CATEGORIES.filter(
  (category): category is Exclude<Category, 'HOME'> => category !== 'HOME',
)

export type PostCategory = (typeof POST_CATEGORIES)[number]

interface ICategorySelectProps {
  value: PostCategory
  onChange: (category: PostCategory) => void
}

const CategorySelect = ({ value, onChange }: ICategorySelectProps) => {
  return (
    <select
      className="w-full p-3 rounded bg-black/20"
      value={value}
      onChange={(e) => onChange(e.target.value as PostCategory)}
    >
      {POST_CATEGORIES.map((category) => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
  )
}

export { CategorySelect }
