import React, { useState } from 'react';
import { X, Flame, Check, Plus, Minus } from 'lucide-react';
import { MenuItem, SelectedCustomization, Topping } from '../../types';
import { TOPPINGS_AVAILABLE, EGGS_AVAILABLE } from '../../data/mockData';
import { formatRupiah } from '../../utils/format';

interface ToppingModalProps {
  item: MenuItem;
  onClose: () => void;
  onConfirm: (customization: SelectedCustomization) => void;
}

export const ToppingModal: React.FC<ToppingModalProps> = ({
  item,
  onClose,
  onConfirm,
}) => {
  const isMie = item.category === 'kuah' || item.category === 'goreng';

  const [doneness, setDoneness] = useState<SelectedCustomization['doneness']>(
    item.name.toLowerCase().includes('nyemek') || item.name.toLowerCase().includes('bangladesh') 
      ? 'Nyemek Kental Gurih' 
      : 'Kenyal (Standar)'
  );
  const [selectedEggId, setSelectedEggId] = useState<string>('egg_ceplok_half');
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([
    TOPPINGS_AVAILABLE[0], // default Kornet
  ]);
  const [spicinessLevel, setSpicinessLevel] = useState<number>(3);
  const [notes, setNotes] = useState<string>('');

  const selectedEgg = EGGS_AVAILABLE.find((e) => e.id === selectedEggId);
  const eggPrice = selectedEgg ? selectedEgg.price : 0;
  const toppingsPrice = selectedToppings.reduce((sum, t) => sum + t.price, 0);
  const totalPrice = item.basePrice + eggPrice + toppingsPrice;

  const toggleTopping = (topping: Topping) => {
    setSelectedToppings((prev) =>
      prev.some((t) => t.id === topping.id)
        ? prev.filter((t) => t.id !== topping.id)
        : [...prev, topping]
    );
  };

  const handleSave = () => {
    onConfirm({
      doneness,
      egg: selectedEgg?.name,
      eggPrice,
      toppings: selectedToppings,
      spicinessLevel,
      notes,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#1c1917] rounded-2xl border border-[#2b2520] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[#2b2520] flex items-center justify-between bg-[#1a1714] sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl p-1 bg-[#26221d] rounded-lg border border-[#383129]">{item.imageIcon}</span>
            <div>
              <h2 className="text-base font-bold text-white">
                Racikan Warisan: {item.name}
              </h2>
              <p className="text-xs text-ink-muted">
                Kustomisasi kematangan, telur bebek/ayam, dan level cabai rawit
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#26221d] hover:bg-[#383129] flex items-center justify-center text-ink-muted hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-sm">
          {/* Section: Kematangan Mie */}
          {isMie && (
            <div>
              <label className="block text-xs font-semibold text-warm-amber uppercase tracking-wider mb-2">
                Konsistensi Kuah & Kematangan
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['Kenyal (Standar)', 'Matang Lembut', 'Kering / Tiris', 'Nyemek Kental Gurih'] as const).map(
                  (level) => {
                    const isSelected = doneness === level;
                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setDoneness(level)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-warm-amber text-[#12100e] border-warm-amber shadow-xs'
                            : 'bg-[#26221d] text-ink-body border-[#383129] hover:bg-[#2d2822]'
                        }`}
                      >
                        {level}
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          )}

          {/* Section: Level Pedas Cabai Rawit */}
          <div className="bg-[#141210] rounded-xl p-3.5 border border-[#2b2520]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-status-negative" />
                Level Pedas Cabai Rawit Merah
              </span>
              <span className="text-xs font-bold font-mono text-status-negative px-2 py-0.5 rounded bg-status-negative-bg border border-red-900/40">
                {spicinessLevel === 0 ? 'Lv.0 (Santai)' : `Lv.${spicinessLevel} (${spicinessLevel} Rawit 🔥)`}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={spicinessLevel <= 0}
                onClick={() => setSpicinessLevel((p) => Math.max(0, p - 1))}
                className="w-8 h-8 rounded-lg bg-[#26221d] border border-[#383129] flex items-center justify-center text-white hover:bg-[#383129] disabled:opacity-40"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <input
                type="range"
                min="0"
                max="10"
                value={spicinessLevel}
                onChange={(e) => setSpicinessLevel(Number(e.target.value))}
                className="flex-1 accent-status-negative cursor-pointer"
              />

              <button
                type="button"
                disabled={spicinessLevel >= 10}
                onClick={() => setSpicinessLevel((p) => Math.min(10, p + 1))}
                className="w-8 h-8 rounded-lg bg-[#26221d] border border-[#383129] flex items-center justify-center text-white hover:bg-[#383129] disabled:opacity-40"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex justify-between text-[10px] text-ink-muted mt-1 px-1">
              <span>0 (Anak Bawang)</span>
              <span>3 (Sedang)</span>
              <span>5 (Nampol)</span>
              <span className="text-status-negative font-semibold">10 (Kesurupan 🔥)</span>
            </div>
          </div>

          {/* Section: Pilihan Telur */}
          {isMie && (
            <div>
              <label className="block text-xs font-semibold text-warm-amber uppercase tracking-wider mb-2">
                Pilihan Racikan Telur
              </label>
              <div className="space-y-1.5">
                {EGGS_AVAILABLE.map((egg) => {
                  const isSelected = selectedEggId === egg.id;
                  return (
                    <button
                      key={egg.id}
                      type="button"
                      onClick={() => setSelectedEggId(egg.id)}
                      className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                        isSelected
                          ? 'bg-[#2d2822] border-warm-amber text-white font-semibold'
                          : 'bg-[#231f1a] border-[#2b2520] text-ink-body hover:bg-[#28231d]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-warm-amber bg-warm-amber text-[#12100e]' : 'border-[#383129]'
                          }`}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5" />}
                        </div>
                        <span>{egg.name}</span>
                      </div>
                      <span className="font-mono text-warm-amber">
                        +{formatRupiah(egg.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section: Ekstra Topping */}
          <div>
            <label className="block text-xs font-semibold text-warm-amber uppercase tracking-wider mb-2">
              Ekstra Topping Tambahan (Bisa Pilih Banyak)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TOPPINGS_AVAILABLE.map((top) => {
                const isSelected = selectedToppings.some((t) => t.id === top.id);
                return (
                  <button
                    key={top.id}
                    type="button"
                    onClick={() => toggleTopping(top)}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                      isSelected
                        ? 'bg-[#2d2822] border-warm-amber text-white font-semibold'
                        : 'bg-[#231f1a] border-[#2b2520] text-ink-body hover:bg-[#28231d]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center ${
                          isSelected ? 'border-warm-amber bg-warm-amber text-[#12100e]' : 'border-[#383129]'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5" />}
                      </div>
                      <span className="line-clamp-1">{top.name}</span>
                    </div>
                    <span className="font-mono text-warm-amber shrink-0 ml-1">
                      +{formatRupiah(top.price)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Catatan Khusus */}
          <div>
            <label className="block text-xs font-semibold text-warm-amber uppercase tracking-wider mb-1.5">
              Catatan Masakan (Opsional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Kuah dibanyakin, taburan bawang goreng dobel..."
              className="w-full h-9 px-3 rounded-xl bg-[#141210] border border-[#2b2520] text-xs text-white placeholder:text-ink-muted focus:outline-none focus:ring-1 focus:ring-warm-amber"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#141210] border-t border-[#2b2520] flex items-center justify-between gap-3">
          <div>
            <span className="text-[11px] text-ink-muted block leading-none">
              Harga Satuan Racikan
            </span>
            <span className="text-base font-bold text-warm-amber font-mono tabular-nums">
              {formatRupiah(totalPrice)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-warm-amber hover:bg-amber-500 text-[#12100e] text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center gap-2"
          >
            <span>Tambahkan ke Tiket</span>
          </button>
        </div>
      </div>
    </div>
  );
};
