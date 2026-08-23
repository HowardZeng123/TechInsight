"use client"

import type React from "react"

import { useState } from "react"
import { Upload } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface BasicInformationProps {
  formData: {
    laptopName: string
    brand: string
    operatingSystem: string
    weight: string
    dimensions: string
    price: string
    originalPrice: string
  }
  onChange: (field: string, value: string) => void
  onFocus: (field: string) => void
  fieldErrors: Record<string, boolean>
  showValidation: boolean
}

export default function BasicInformation({
  formData,
  onChange,
  onFocus,
  fieldErrors,
  showValidation,
}: BasicInformationProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      setSelectedFiles((prev) => [...prev, ...filesArray])
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Basic Information</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="laptop-name" className="flex items-center gap-1">
            Laptop Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="laptop-name"
            placeholder="e.g. MacBook Pro 16"
            value={formData.laptopName}
            onChange={(e) => onChange("laptopName", e.target.value)}
            onFocus={() => onFocus("laptopName")}
            className={showValidation && fieldErrors.laptopName ? "border-red-500" : ""}
          />
          {showValidation && fieldErrors.laptopName && (
            <p className="text-sm text-red-500 mt-1">Laptop name is required</p>
          )}
        </div>

        <div>
          <Label htmlFor="brand" className="flex items-center gap-1">
            Brand <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.brand}
            onValueChange={(value) => onChange("brand", value)}
            onOpenChange={() => onFocus("brand")}
          >
            <SelectTrigger id="brand" className={showValidation && fieldErrors.brand ? "border-red-500" : ""}>
              <SelectValue placeholder="Select Brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="dell">Dell</SelectItem>
              <SelectItem value="hp">HP</SelectItem>
              <SelectItem value="lenovo">Lenovo</SelectItem>
              <SelectItem value="asus">Asus</SelectItem>
              <SelectItem value="acer">Acer</SelectItem>
              <SelectItem value="microsoft">Microsoft</SelectItem>
              <SelectItem value="msi">MSI</SelectItem>
              <SelectItem value="razer">Razer</SelectItem>
              <SelectItem value="samsung">Samsung</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {showValidation && fieldErrors.brand && <p className="text-sm text-red-500 mt-1">Brand is required</p>}
        </div>

        <div>
          <Label htmlFor="os">Operating System</Label>
          <Input
            id="os"
            placeholder="e.g. Windows 11 Home"
            value={formData.operatingSystem}
            onChange={(e) => onChange("operatingSystem", e.target.value)}
            onFocus={() => onFocus("operatingSystem")}
            className={showValidation && fieldErrors.operatingSystem ? "border-red-500" : ""}
          />
          {showValidation && fieldErrors.operatingSystem && (
            <p className="text-sm text-red-500 mt-1">Operation System is required</p>
          )}
        </div>
        

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="weight">Weight</Label>
            <Input
              id="weight"
              placeholder="e.g. 2.1 kg"
              value={formData.weight}
              onChange={(e) => onChange("weight", e.target.value)}
              onFocus={() => onFocus("weight")}
              className={showValidation && fieldErrors.weight ? "border-red-500" : ""}
            />
            {showValidation && fieldErrors.weight && (
            <p className="text-sm text-red-500 mt-1">Weight is required</p>
          )}
          </div>
          <div>
            <Label htmlFor="dimensions">Dimensions</Label>
            <Input
              id="dimensions"
              placeholder="e.g. 355.7 × 248.1 × 16.8 mm"
              value={formData.dimensions}
              onChange={(e) => onChange("dimensions", e.target.value)}
              onFocus={() => onFocus("dimensions")}
              className={showValidation && fieldErrors.dimensions ? "border-red-500" : ""}
            />
             {showValidation && fieldErrors.dimensions && (
            <p className="text-sm text-red-500 mt-1">Dimemsions is required</p>
          )}
            
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="weight">Price</Label>
            <Input
              id="price"
              placeholder="17.000.000"
              value={formData.price}
              onChange={(e) => onChange("price", e.target.value)}
              onFocus={() => onFocus("price")}
              className={showValidation && fieldErrors.price ? "border-red-500" : ""}
            />
            {showValidation && fieldErrors.price && (
            <p className="text-sm text-red-500 mt-1">Price is required</p>
          )}
          </div>
          <div>
            <Label htmlFor="dimensions">Original Price</Label>
            <Input
              id="originalPrice"
              placeholder="19.000.000"
              value={formData.originalPrice}
              onChange={(e) => onChange("originalPrice", e.target.value)}
              onFocus={() => onFocus("originalPrice")}
              className={showValidation && fieldErrors.originalPrice ? "border-red-500" : ""}
            />
             {showValidation && fieldErrors.originalPrice && (
            <p className="text-sm text-red-500 mt-1">Original Price is required</p>
          )}
            
          </div>
        </div>

        <div>
          <Label htmlFor="laptop-images">Laptop Images</Label>
          <div className="border border-dashed rounded-md p-6 mt-1 text-center">
            <div className="flex flex-col items-center justify-center space-y-2">
              <Upload className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Drag and drop images here</p>
              <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
              <Button
                variant="secondary"
                className="mt-2"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                Browse Files
              </Button>
              <input
                id="file-upload"
                type="file"
                multiple
                accept="image/png,image/jpeg,image/gif"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>
          {selectedFiles.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-muted-foreground">{selectedFiles.length} file(s) selected</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
