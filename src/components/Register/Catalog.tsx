import React, { useState, useMemo } from 'react';
import { Search, Plus, Sparkles, Flame } from 'lucide-react';
import { MenuItem, Category } from '../../types';
import { MENU_ITEMS } from '../../data/mockData';
import { formatRupiah } from '../../utils/format';

interface CatalogProps {
  onSelectItem: (item: MenuItem) => void;
}

export const Catalog: React.FC<CatalogProps> = ({ onSelectItem }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories: { id: Category; label: string; count?: number }[] = [
    { id: 'all', label: 'Semua Menu' },
    { id: 'kuah', label: 'Indomie Kuah' },
    { id: 'goreng', label: 'Indomie Goreng' },
    { id: 'minuman_dingin', label: 'Minuman Dingin' },
    { id: 'kopi_panas', label: 'Kopi & Teh Panas' },
    { id: 'snack_topping', label: 'Gorengan & Camilan' },
  ];

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden p-4 sm:p-6 bg-ground">
      {/* Top Filter Bar: Search & Categories */}
      <div className="space-y-3 mb-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari mie, kopi, es teh, racikan topping..."
            className="w-full h-10 pl-10 pr-4 rounded-lg bg-surface border border-border text-sm placeholder:text-ink-muted/60 focus:outline-none focus:ring-1 focus:ring-accent transition-shadow shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-muted hover:text-ink"
            >
              Hapus
            </button>
          )}
        </div>

        {/* Category Horizontal Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-accent text-white shadow-xs'
                    : 'bg-surface text-ink border border-border hover:bg-raised'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Grid */}
      <div className="flex-1 overflow-y-auto pr-1">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 pb-12">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="group bg-surface rounded-xl border border-border hover:border-ink/20 p-3 sm:p-4 flex flex-col justify-between transition-all duration-150 cursor-pointer shadow-xs hover:shadow-sm hover:-translate-y-0.5 select-none"
            >
              {/* Card Top: Icon & Badge */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-2xl sm:text-3xl p-1 bg-ground rounded-lg border border-border/50">
                  {item.imageIcon}
                </span>

                {item.badge && (
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] sm:text-xs font-semibold ${
                      item.badgeType === 'spicy'
                        ? 'bg-status-negative-bg text-status-negative'
                        : item.badgeType === 'special'
                        ? 'bg-status-warning-bg text-status-warning'
                        : 'bg-status-positive-bg text-status-positive'
                    }`}
                  >
                    {item.badgeType === 'spicy' ? (
                      <Flame className="w-2.5 h-2.5" />
                    ) : (
                      <Sparkles className="w-2.5 h-2.5" />
                    )}
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Title & Desc */}
              <div className="flex-1 mb-3">
                <span className="text-[10px] sm:text-xs text-ink-muted font-medium uppercase tracking-wider">
                  {item.categoryLabel}
                </span>
                <h3 className="text-xs sm:text-sm font-semibold text-ink leading-snug line-clamp-2 mt-0.5">
                  {item.name}
                </h3>
                <p className="text-[11px] text-ink-muted line-clamp-1 mt-1">
                  {item.description}
                </p>
              </div>

              {/* Card Bottom: Price & Quick Button */}
              <div className="flex items-center justify-between pt-2 border-t border-rule">
                <span className="text-xs sm:text-sm font-bold text-ink font-mono tabular-nums">
                  {formatRupiah(item.basePrice)}
                </span>
                <button
                  type="button"
                  className="w-7 h-7 rounded-md bg-ground border border-border flex items-center justify-center text-ink group-hover:bg-accent group-hover:text-white transition-colors"
                  title="Tambah item"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
