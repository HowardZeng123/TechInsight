"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"

interface DetailedAnalysis {
  formData: {
    geekBenchV6Single: string
    geekBenchV6Multi: string
    cineBenchR23Single: string
    cineBenchR23Multi: string

    _3DMarkTimeSpy: string
    _3DMarkWildlifeExtrme: string
    geekBenchCompute: string

    pluggedInG6Single: string
    pluggedInG6Multi: string
    pluggedInCinebenchR23Single: string
    pluggedInCinebenchR23Multi: string

    unpluggedG6Single: string
    unpluggedG6Multi: string
    unpluggedCinebenchR23Single: string
    unpluggedCinebenchR23Multi: string


  }
  onChange: (field: string, value: string) => void
  onFocus: (field: string) => void
  fieldErrors: Record<string, boolean>
  showValidation: boolean
}

export default function DetailedAnalysis(
  {
    formData,
    onChange,
    onFocus,
    fieldErrors,
    showValidation,
  }: DetailedAnalysis
) {
  const [performanceRating, setPerformanceRating] = useState(8.0)

  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Detailed Analysis</h2>

        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">1. Performance</h3>
              <span className="font-medium">{performanceRating.toFixed(1)}/10</span>
            </div>
            <Slider
              value={[performanceRating]}
              min={1}
              max={10}
              step={0.1}
              onValueChange={(value) => setPerformanceRating(value[0])}
              className="py-4"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">CPU Benchmarks</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="geekbench-single">Geekbench v6 (Single)</Label>
                <Input id="geekbench-single" placeholder="e.g. 3150"
                  value={formData.geekBenchV6Single}
                  onChange={(e) => onChange("geekBenchV6Single", e.target.value)}
                  onFocus={() => onFocus("geekBenchV6Single")}
                  className={showValidation && fieldErrors.geekBenchV6Single ? "border-red-500" : ""}
                />
                {showValidation && fieldErrors.geekBenchV6Single && (
                  <p className="text-sm text-red-500 mt-1">Geekbench v6 (Single) is required</p>
                )}
              </div>
              <div>
                <Label htmlFor="geekbench-multi">Geekbench v6 (Multi)</Label>
                <Input id="geekbench-multi" placeholder="e.g. 15200"
                  value={formData.geekBenchV6Multi}
                  onChange={(e) => onChange("geekBenchV6Multi", e.target.value)}
                  onFocus={() => onFocus("geekBenchV6Multi")}
                  className={showValidation && fieldErrors.geekBenchV6Multi ? "border-red-500" : ""} />
                {showValidation && fieldErrors.geekBenchV6Multi && (
                  <p className="text-sm text-red-500 mt-1">Geekbench v6 (Multi) is required</p>
                )}
              </div>
              <div>
                <Label htmlFor="cinebench-single">Cinebench R23 (Single)</Label>
                <Input id="cinebench-single" placeholder="e.g. 1950"
                  value={formData.cineBenchR23Single}
                  onChange={(e) => onChange("cineBenchR23Single", e.target.value)}
                  onFocus={() => onFocus("cineBenchR23Single")}
                  className={showValidation && fieldErrors.cineBenchR23Single ? "border-red-500" : ""} />
                {showValidation && fieldErrors.cineBenchR23Single && (
                  <p className="text-sm text-red-500 mt-1">Cinebench R23 (Single) is required</p>
                )}
              </div>
              <div>
                <Label htmlFor="cinebench-multi">Cinebench R23 (Multi)</Label>
                <Input id="cinebench-multi" placeholder="e.g. 14800"
                  value={formData.cineBenchR23Multi}
                  onChange={(e) => onChange("cineBenchR23Multi", e.target.value)}
                  onFocus={() => onFocus("cineBenchR23Multi")}
                  className={showValidation && fieldErrors.cineBenchR23Multi ? "border-red-500" : ""} />
                {showValidation && fieldErrors.cineBenchR23Multi && (
                  <p className="text-sm text-red-500 mt-1">Cinebench R23 (Multi) is required</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">GPU Benchmarks</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="timespy">3DMark Time Spy (Graphics)</Label>
                <Input id="timespy" placeholder="e.g. 5876"
                  value={formData._3DMarkTimeSpy}
                  onChange={(e) => onChange("_3DMarkTimeSpy", e.target.value)}
                  onFocus={() => onFocus("_3DMarkTimeSpy")}
                  className={showValidation && fieldErrors._3DMarkTimeSpy ? "border-red-500" : ""} />
                {showValidation && fieldErrors._3DMarkTimeSpy && (
                  <p className="text-sm text-red-500 mt-1">3DMark Time Spy (Graphics) is required</p>
                )}
              </div>
              <div>
                <Label htmlFor="wildlife">3DMark Wildlife Extreme</Label>
                <Input id="wildlife" placeholder="e.g. 9750"
                  value={formData._3DMarkWildlifeExtrme}
                  onChange={(e) => onChange("_3DMarkWildlifeExtrme", e.target.value)}
                  onFocus={() => onFocus("_3DMarkWildlifeExtrme")}
                  className={showValidation && fieldErrors._3DMarkWildlifeExtrme ? "border-red-500" : ""} />
                {showValidation && fieldErrors._3DMarkWildlifeExtrme && (
                  <p className="text-sm text-red-500 mt-1">3DMark Wildlife Extreme is required</p>
                )}
              </div>
              <div>
                <Label htmlFor="geekbench-compute">Geekbench Compute</Label>
                <Input id="geekbench-compute" placeholder="e.g. 21345"
                  value={formData.geekBenchCompute}
                  onChange={(e) => onChange("geekBenchCompute", e.target.value)}
                  onFocus={() => onFocus("geekBenchCompute")}
                  className={showValidation && fieldErrors.geekBenchCompute ? "border-red-500" : ""} />
                {showValidation && fieldErrors.geekBenchCompute && (
                  <p className="text-sm text-red-500 mt-1">Geekbench Compute is required</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Performance Comparison: Plugged vs. Unplugged</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Plugged In (AC Power)</h4>
                <div>
                  <Label htmlFor="plugged-gb6-single">GB6 Single</Label>
                  <Input id="plugged-gb6-single" placeholder="e.g. 3150"
                    value={formData.pluggedInG6Single}
                    onChange={(e) => onChange("pluggedInG6Single", e.target.value)}
                    onFocus={() => onFocus("pluggedInG6Single")}
                    className={showValidation && fieldErrors.pluggedInG6Single ? "border-red-500" : ""} />
                  {showValidation && fieldErrors.pluggedInG6Single && (
                    <p className="text-sm text-red-500 mt-1">GB6 Single is required</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="plugged-gb6-multi">GB6 Multi</Label>
                  <Input id="plugged-gb6-multi" placeholder="e.g. 15200"
                    value={formData.pluggedInG6Multi}
                    onChange={(e) => onChange("pluggedInG6Multi", e.target.value)}
                    onFocus={() => onFocus("pluggedInG6Multi")}
                    className={showValidation && fieldErrors.pluggedInG6Multi ? "border-red-500" : ""} />
                  {showValidation && fieldErrors.pluggedInG6Multi && (
                    <p className="text-sm text-red-500 mt-1">GB6 Multi is required</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="plugged-cinebench-single">Cinebench R23 (Single)</Label>
                  <Input id="plugged-cinebench-single" placeholder="e.g. 1,532"
                    value={formData.pluggedInCinebenchR23Single}
                    onChange={(e) => onChange("pluggedInCinebenchR23Single", e.target.value)}
                    onFocus={() => onFocus("pluggedInCinebenchR23Single")}
                    className={showValidation && fieldErrors.pluggedInCinebenchR23Single ? "border-red-500" : ""} />
                    {showValidation && fieldErrors.pluggedInCinebenchR23Single && (
                      <p className="text-sm text-red-500 mt-1">Cinebench R23 (Single) is required</p>
                    )}
                </div>
                <div>
                  <Label htmlFor="plugged-cinebench-multi">Cinebench R23 (Multi)</Label>
                  <Input id="plugged-cinebench-multi" placeholder="e.g. 12,456"
                    value={formData.pluggedInCinebenchR23Multi}
                    onChange={(e) => onChange("pluggedInCinebenchR23Multi", e.target.value)}
                    onFocus={() => onFocus("pluggedInCinebenchR23Multi")}
                    className={showValidation && fieldErrors.pluggedInCinebenchR23Multi ? "border-red-500" : ""} />
                  {showValidation && fieldErrors.pluggedInCinebenchR23Multi && (
                    <p className="text-sm text-red-500 mt-1">Cinebench R23 (Multi) is required</p>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium">Unplugged (Battery)</h4>
                <div>
                  <Label htmlFor="unplugged-gb6-single">GB6 Single</Label>
                  <Input id="unplugged-gb6-single" placeholder="e.g. 2123"
                    value={formData.unpluggedG6Single}
                    onChange={(e) => onChange("unpluggedG6Single", e.target.value)}
                    onFocus={() => onFocus("unpluggedG6Single")}
                    className={showValidation && fieldErrors.unpluggedG6Single ? "border-red-500" : ""} />
                  {showValidation && fieldErrors.unpluggedG6Single && (
                    <p className="text-sm text-red-500 mt-1">GB6 Single is required</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="unplugged-gb6-multi">GB6 Multi</Label>
                  <Input id="unplugged-gb6-multi" placeholder="e.g. 9654"
                    value={formData.unpluggedG6Multi}
                    onChange={(e) => onChange("unpluggedG6Multi", e.target.value)}
                    onFocus={() => onFocus("unpluggedG6Multi")}
                    className={showValidation && fieldErrors.unpluggedG6Multi ? "border-red-500" : ""} />
                  {showValidation && fieldErrors.unpluggedG6Multi && (
                    <p className="text-sm text-red-500 mt-1">GB6 Multi is required</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="unplugged-cinebench-single">Cinebench R23 (Single)</Label>
                  <Input id="unplugged-cinebench-single" placeholder="e.g. 1,387"
                    value={formData.unpluggedCinebenchR23Single}
                    onChange={(e) => onChange("unpluggedCinebenchR23Single", e.target.value)}
                    onFocus={() => onFocus("unpluggedCinebenchR23Single")}
                    className={showValidation && fieldErrors.unpluggedCinebenchR23Single ? "border-red-500" : ""} />
                  {showValidation && fieldErrors.unpluggedCinebenchR23Single && (
                    <p className="text-sm text-red-500 mt-1">Cinebench R23 (Single) is required</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="unplugged-cinebench-multi">Cinebench R23 (Multi)</Label>
                  <Input id="unplugged-cinebench-multi" placeholder="e.g. 10,212"
                    value={formData.unpluggedCinebenchR23Multi}
                    onChange={(e) => onChange("unpluggedCinebenchR23Multi", e.target.value)}
                    onFocus={() => onFocus("unpluggedCinebenchR23Multi")}
                    className={showValidation && fieldErrors.unpluggedCinebenchR23Multi ? "border-red-500" : ""} />
                  {showValidation && fieldErrors.unpluggedCinebenchR23Multi && (
                    <p className="text-sm text-red-500 mt-1">Cinebench R23 (Multi) is required</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="performance-summary">Performance Summary</Label>
            <Textarea
              id="performance-summary"
              placeholder="Describe the overall performance characteristics..."
              className="min-h-[150px] mt-2"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
