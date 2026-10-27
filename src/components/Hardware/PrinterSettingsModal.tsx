import React, { useState } from 'react';
import { X, Printer, Bluetooth, RefreshCw, CheckCircle2 } from 'lucide-react';
import { PrinterConfig } from '../../types';

interface PrinterSettingsModalProps {
  config: PrinterConfig;
  onSaveConfig: (newConfig: PrinterConfig) => void;
  onClose: () => void;
}

export const PrinterSettingsModal: React.FC<PrinterSettingsModalProps> = ({
  config,
  onSaveConfig,
  onClose,
}) => {
  const [currentConfig, setCurrentConfig] = useState<PrinterConfig>({ ...config });
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [testPrintDone, setTestPrintDone] = useState<boolean>(false);

  const mockDevices = [
    { name: 'RPP02N-Thermal-58', mac: '66:32:B1:4C:90:11' },
    { name: 'Zjiang-5805DD', mac: '11:22:33:44:55:66' },
    { name: 'Epson-TM-T82X', mac: 'AA:BB:CC:DD:EE:FF' },
  ];

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 1200);
  };

  const handleTestPrint = () => {
    setTestPrintDone(true);
    setTimeout(() => {
      setTestPrintDone(false);
    }, 2000);
  };

  const handleSave = () => {
    onSaveConfig(currentConfig);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#1c1917] rounded-2xl border border-[#2b2520] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#2b2520] flex items-center justify-between bg-[#1a1714]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#26221d] border border-[#383129] flex items-center justify-center text-warm-amber">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Konektivitas Printer Thermal Bluetooth
              </h3>
              <p className="text-xs text-ink-muted">
                Dukungan driver cetak ESC/POS universal 58mm & 80mm
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#26221d] hover:bg-[#383129] flex items-center justify-center text-ink-muted hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 overflow-y-auto max-h-[75vh] text-xs">
          {/* Section: Bluetooth Device Pairing */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-semibold text-warm-amber uppercase tracking-wider text-[11px]">
                Perangkat Bluetooth Terdeteksi
              </label>
              <button
                type="button"
                onClick={handleScan}
                disabled={isScanning}
                className="flex items-center gap-1 text-white font-medium hover:text-warm-amber disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isScanning ? 'animate-spin' : ''}`} />
                <span>{isScanning ? 'Memindai...' : 'Pindai Ulang'}</span>
              </button>
            </div>

            <div className="space-y-2">
              {mockDevices.map((device) => {
                const isConnected = currentConfig.name === device.name && currentConfig.connected;
                return (
                  <div
                    key={device.mac}
                    className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                      isConnected
                        ? 'bg-[#064e3b]/50 border-[#047857]'
                        : 'bg-[#141210] border-border'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          isConnected
                            ? 'bg-[#10b981] text-[#12100e]'
                            : 'bg-[#26221d] text-ink-muted'
                        }`}
                      >
                        <Bluetooth className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-white text-xs">
                          {device.name}
                        </p>
                        <p className="text-[10px] text-ink-muted font-mono">
                          MAC: {device.mac}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setCurrentConfig((prev) => ({
                          ...prev,
                          name: device.name,
                          macAddress: device.mac,
                          connected: !isConnected,
                        }));
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        isConnected
                          ? 'bg-[#881337] text-white border border-red-800 hover:bg-rose-900'
                          : 'bg-warm-amber text-[#12100e] hover:bg-amber-500 font-bold'
                      }`}
                    >
                      {isConnected ? 'Putuskan' : 'Hubungkan'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: Paper Width Selection */}
          <div>
            <label className="font-semibold text-warm-amber uppercase tracking-wider text-[11px] block mb-2">
              Ukuran Lebar Kertas Thermal
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setCurrentConfig((prev) => ({ ...prev, paperSize: '58mm' }))}
                className={`p-3 rounded-xl border text-left transition-all ${
                  currentConfig.paperSize === '58mm'
                    ? 'bg-warm-amber text-[#12100e] border-warm-amber shadow-xs font-bold'
                    : 'bg-[#141210] border-border text-white hover:bg-[#26221d]'
                }`}
              >
                <div className="text-xs">58mm (32 Karakter)</div>
                <div className={`text-[10px] mt-0.5 font-normal ${currentConfig.paperSize === '58mm' ? 'text-[#12100e]/80' : 'text-ink-muted'}`}>
                  Rekomendasi printer saku kasir Bluetooth
                </div>
              </button>

              <button
                type="button"
                onClick={() => setCurrentConfig((prev) => ({ ...prev, paperSize: '80mm' }))}
                className={`p-3 rounded-xl border text-left transition-all ${
                  currentConfig.paperSize === '80mm'
                    ? 'bg-warm-amber text-[#12100e] border-warm-amber shadow-xs font-bold'
                    : 'bg-[#141210] border-border text-white hover:bg-[#26221d]'
                }`}
              >
                <div className="text-xs">80mm (48 Karakter)</div>
                <div className={`text-[10px] mt-0.5 font-normal ${currentConfig.paperSize === '80mm' ? 'text-[#12100e]/80' : 'text-ink-muted'}`}>
                  Standar printer kasir desktop USB/LAN
                </div>
              </button>
            </div>
          </div>

          {/* Section: Receipt Content Toggles */}
          <div className="space-y-2 pt-1 border-t border-border">
            <label className="font-semibold text-warm-amber uppercase tracking-wider text-[11px] block">
              Format Konten Struk
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={currentConfig.printLogo}
                onChange={(e) => setCurrentConfig((prev) => ({ ...prev, printLogo: e.target.checked }))}
                className="w-4 h-4 rounded accent-warm-amber"
              />
              <span className="text-white">Cetak Header Logo Toko</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={currentConfig.printToppingDetails}
                onChange={(e) => setCurrentConfig((prev) => ({ ...prev, printToppingDetails: e.target.checked }))}
                className="w-4 h-4 rounded accent-warm-amber"
              />
              <span className="text-white">Cetak Rincian Racikan Topping & Cabai</span>
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#141210] border-t border-[#2b2520] flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleTestPrint}
            className="px-3.5 py-2 rounded-xl border border-border bg-[#231f1a] hover:bg-[#2c2620] text-xs font-semibold text-white flex items-center gap-1.5 transition-colors"
          >
            {testPrintDone ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-status-positive" />
                <span className="text-status-positive font-bold">Test Berhasil!</span>
              </>
            ) : (
              <>
                <Printer className="w-3.5 h-3.5 text-warm-amber" />
                <span>Test Print</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-ink-muted hover:text-white transition-colors"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-warm-amber hover:bg-amber-500 text-[#12100e] text-xs font-bold shadow-xs transition-colors"
            >
              Simpan Pengaturan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
