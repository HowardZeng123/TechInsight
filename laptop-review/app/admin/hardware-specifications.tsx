"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface HardwareSpecificationsProps {
  formData: {
    cpu: string
    gpu: string
    ram: string
    storage: string
    graphicsCard: string
    ports: string
    display: string
    colorGamut: string
    battery: string
    charging: string
  }
  onChange: (field: string, value: string) => void
  onFocus: (field: string) => void
  fieldErrors: Record<string, boolean>
  showValidation: boolean
}

export default function HardwareSpecifications({
  formData,
  onChange,
  onFocus,
  fieldErrors,
  showValidation,
}: HardwareSpecificationsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Hardware Specifications</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="cpu" className="flex items-center gap-1">
              CPU / Processor <span className="text-red-500">*</span>
            </Label>
            <Input
              id="cpu"
              placeholder="e.g. Intel Core i7-12700H"
              value={formData.cpu}
              onChange={(e) => onChange("cpu", e.target.value)}
              onFocus={() => onFocus("cpu")}
              className={showValidation && fieldErrors.cpu ? "border-red-500" : ""}
            />
            {showValidation && fieldErrors.cpu && (
              <p className="text-sm text-red-500 mt-1">CPU / Processor is required</p>
            )}
          </div>
          <div>
            <Label htmlFor="gpu">GPU</Label>
            <Input
              id="gpu"
              placeholder="e.g. NVIDIA GeForce RTX 3060"
              value={formData.gpu}
              onChange={(e) => onChange("gpu", e.target.value)}
              onFocus={() => onFocus("gpu")}
              className={showValidation && fieldErrors.gpu ? "border-red-500" : ""}
            />
            {showValidation && fieldErrors.gpu && (
              <p className="text-sm text-red-500 mt-1">GPU is required</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="ram" className="flex items-center gap-1">
              RAM <span className="text-red-500">*</span>
            </Label>
            <Input
              id="ram"
              placeholder="e.g. 16GB DDR4 3200MHz"
              value={formData.ram}
              onChange={(e) => onChange("ram", e.target.value)}
              onFocus={() => onFocus("ram")}
              className={showValidation && fieldErrors.ram ? "border-red-500" : ""}
            />
            {showValidation && fieldErrors.ram && <p className="text-sm text-red-500 mt-1">RAM is required</p>}
          </div>
          <div>
            <Label htmlFor="storage" className="flex items-center gap-1">
              Hard Drive / Storage <span className="text-red-500">*</span>
            </Label>
            <Input
              id="storage"
              placeholder="e.g. 512GB NVMe SSD"
              value={formData.storage}
              onChange={(e) => onChange("storage", e.target.value)}
              onFocus={() => onFocus("storage")}
              className={showValidation && fieldErrors.storage ? "border-red-500" : ""}
            />
            {showValidation && fieldErrors.storage && <p className="text-sm text-red-500 mt-1">Storage is required</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="graphics-card">Graphics Card</Label>
            <Input
              id="graphics-card"
              placeholder="e.g. NVIDIA GeForce RTX 3060 6G"
              value={formData.graphicsCard}
              onChange={(e) => onChange("graphicsCard", e.target.value)}
              onFocus={() => onFocus("graphicsCard")}
              className={showValidation && fieldErrors.graphicsCard ? "border-red-500" : ""}
            />
            {showValidation && fieldErrors.graphicsCard && (
                <p className="text-sm text-red-500 mt-1">Graphics Card is required</p>
              )}
          </div>
          <div>
            <Label htmlFor="ports">Ports</Label>
            <Input
              id="ports"
              placeholder="e.g. 2x USB-C, 2x USB-A, HDMI, SD"
              value={formData.ports}
              onChange={(e) => onChange("ports", e.target.value)}
              onFocus={() => onFocus("ports")}
              className={showValidation && fieldErrors.ports ? "border-red-500" : ""}
            />
             {showValidation && fieldErrors.ports && (
                <p className="text-sm text-red-500 mt-1">Graphics Card is required</p>
              )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="display" className="flex items-center gap-1">
              Screen / Display <span className="text-red-500">*</span>
            </Label>
            <Input
              id="display"
              placeholder="e.g. 15.6-inch FHD (1920 × 1080) 144Hz"
              value={formData.display}
              onChange={(e) => onChange("display", e.target.value)}
              onFocus={() => onFocus("display")}
              className={showValidation && fieldErrors.display ? "border-red-500" : ""}
            />
            {showValidation && fieldErrors.display && <p className="text-sm text-red-500 mt-1">Display is required</p>}
          </div>
          <div>
            <Label htmlFor="color-gamut" className="flex items-center gap-1">Color Gamut</Label>
            <Input
              id="color-gamut"
              placeholder="e.g. 100% sRGB"
              value={formData.colorGamut}
              onChange={(e) => onChange("colorGamut", e.target.value)}
              onFocus={() => onFocus("colorGamut")}
              className={showValidation && fieldErrors.colorGamut ? "border-red-500" : ""}
            />
            {showValidation && fieldErrors.colorGamut && (
                  <p className="text-sm text-red-500 mt-1">Color Gamut is required</p>
                )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="battery">Battery</Label>
            <Input
              id="battery"
              placeholder="e.g. 80Wh, 4-cell Li-ion"
              value={formData.battery}
              onChange={(e) => onChange("battery", e.target.value)}
              onFocus={() => onFocus("battery")}
              className={showValidation && fieldErrors.battery ? "border-red-500" : ""}
            />
            {showValidation && fieldErrors.battery && (
                <p className="text-sm text-red-500 mt-1">Battery is required</p>
              )}
          </div>
          <div>
            <Label htmlFor="charging">Charging</Label>
            <Input
              id="charging"
              placeholder="e.g. 95W USB-C PD 3.0"
              value={formData.charging}
              onChange={(e) => onChange("charging", e.target.value)}
              onFocus={() => onFocus("charging")}
              className={showValidation && fieldErrors.charging ? "border-red-500" : ""}
            />
             {showValidation && fieldErrors.charging && (
                <p className="text-sm text-red-500 mt-1">Charging is required</p>
              )}
          </div>
        </div>
      </div>
    </div>
  )
}
