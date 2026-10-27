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

  const categories: { id: Category; label: string }[] = [
    { id: 'all', label: '🍜 Semua Racikan' },
    { id: 'kuah', label: 'Indomie Kuah & Nyemek' },
    { id: 'goreng', label: 'Indomie Goreng & Magelangan' },
    { id: 'minuman_dingin', label: 'Minuman Dingin & Es Teh' },
    { id: 'kopi_panas', label: 'Kopi Tubruk & Vietnam Drip' },
    { id: 'snack_topping', label: 'Roti Bakar & Gorengan' },
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
            placeholder="Cari Indomie Bangladesh, Kopi Vietnam, Es Teh, Mendoan..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-surface border border-border text-sm text-white placeholder:text-ink-muted focus:outline-none focus:ring-1 focus:ring-warm-amber transition-shadow shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-muted hover:text-white"
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
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-warm-amber text-[#12100e] shadow-xs'
                    : 'bg-surface text-ink-body border border-border hover:bg-raised'
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
              className="group bg-surface rounded-2xl border border-border hover:border-warm-amber/60 p-3.5 sm:p-4 flex flex-col justify-between transition-all duration-150 cursor-pointer shadow-xs hover:shadow-md hover:-translate-y-0.5 select-none"
            >
              {/* Card Top: Icon & Badge */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-2xl sm:text-3xl p-1 bg-ground rounded-xl border border-border">
                  {item.imageIcon}
                </span>

                {item.badge && (
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-semibold ${
                      item.badgeType === 'spicy'
                        ? 'bg-status-negative-bg text-status-negative border border-red-900/40'
                        : item.badgeType === 'special'
                        ? 'bg-status-warning-bg text-status-warning border border-amber-900/40'
                        : 'bg-status-positive-bg text-[#a7f3d0] border border-emerald-900/40'
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
                <span className="text-[10px] sm:text-xs text-warm-amber font-mono font-medium uppercase tracking-wider">
                  {item.categoryLabel}
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-2 mt-0.5">
                  {item.name}
                </h3>
                <p className="text-[11px] text-ink-muted line-clamp-2 mt-1">
                  {item.description}
                </p>
              </div>

              {/* Card Bottom: Price & Quick Button */}
              <div className="flex items-center justify-between pt-2.5 border-t border-border">
                <span className="text-xs sm:text-sm font-bold text-warm-amber font-mono tabular-nums">
                  {formatRupiah(item.basePrice)}
                </span>
                <button
                  type="button"
                  className="h-7 px-2.5 rounded-lg bg-raised border border-border flex items-center gap-1 text-white group-hover:bg-warm-amber group-hover:text-[#12100e] transition-colors text-xs font-semibold"
                >
                  <Plus className="w-3 h-3" />
                  <span>Pesan</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
