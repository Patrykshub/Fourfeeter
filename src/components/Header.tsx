import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { NAV_CATEGORIES as CATEGORIES } from './CategorySelect'
import type { Category } from './CategorySelect'

interface IHeaderProps {
  activeCategory: Category | null
  onSelectCategory: (category: Category | null) => void
}

const Header = ({ activeCategory, onSelectCategory }: IHeaderProps) => {
  const [isMenuOpen, setMenuOpen] = useState(false)

  const select = (category: Category) => {
    onSelectCategory(category === 'HOME' ? null : category)
    setMenuOpen(false)
  }

  const isActive = (category: Category) => {
    return category === 'HOME' ? activeCategory === null : activeCategory === category
  }

  return (
    <header className="pt-8 pb-6">
      <div className="flex items-center justify-between">
        <div className="text-center w-full">
          <div className="logo text-4xl sm:text-5xl font-semibold tracking-tight">Fourfeeter</div>
          <nav className="hidden md:flex justify-center gap-8 mt-4 uppercase text-sm text-gray-300">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => select(category)}
                className={isActive(category) ? 'text-white' : 'hover:text-white'}
              >
                {category}
              </button>
            ))}
          </nav>
        </div>

        <div className="md:hidden absolute right-4 top-6">
          <button
            aria-label="menu"
            onClick={() => setMenuOpen((s) => !s)}
            className="p-2 rounded-md bg-black/20"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <div className="mt-6 h-0.5 bg-neon/40 neon-border" />

      {isMenuOpen && (
        <div className="mt-4 p-4 rounded bg-black/20 md:hidden">
          <nav className="flex flex-col gap-3 uppercase text-sm text-gray-300">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => select(category)}
                className={`text-left ${isActive(category) ? 'text-white' : ''}`}
              >
                {category}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

export { Header }
