"use client"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

interface PerformanceInfoProps {
  formData: any
  onChange: (section: string, field: string, value: any) => void
  fieldErrors: Record<string, boolean>
  showValidation: boolean
}

export default function PerformanceInfo({ 
  formData,
  onChange,
  fieldErrors,
  showValidation
}: PerformanceInfoProps) {
  const { cpu, gpu } = formData.detailedSpecs
  const { benchmarks } = formData
  
  const handleSliderChange = (field: string, value: number[]) => {
    onChange("benchmarks", field, value[0])
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông Tin Hiệu Năng</CardTitle>
        <CardDescription>Nhập thông tin chi tiết về CPU, GPU và điểm benchmark</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* CPU Information */}
        <div>
          <h3 className="text-lg font-medium mb-4">Thông Tin CPU</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="cpu-name">Tên CPU</Label>
              <Input
                id="cpu-name"
                placeholder="Apple M3 Pro"
                value={cpu.name}
                onChange={(e) => onChange("detailedSpecs.cpu", "name", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cpu-base-freq">Tần Số Cơ Bản</Label>
              <Input
                id="cpu-base-freq"
                placeholder="3.2 GHz"
                value={cpu.baseFrequency}
                onChange={(e) => onChange("detailedSpecs.cpu", "baseFrequency", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cpu-turbo-freq">Tần Số Turbo</Label>
              <Input
                id="cpu-turbo-freq"
                placeholder="4.7 GHz"
                value={cpu.turboFrequency}
                onChange={(e) => onChange("detailedSpecs.cpu", "turboFrequency", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
            <div className="grid gap-2">
              <Label htmlFor="cpu-cores">Số Nhân</Label>
              <Input
                id="cpu-cores"
                type="number"
                placeholder="12"
                value={cpu.cores || ""}
                onChange={(e) => onChange("detailedSpecs.cpu", "cores", parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cpu-threads">Số Luồng</Label>
              <Input
                id="cpu-threads"
                type="number"
                placeholder="12"
                value={cpu.threads || ""}
                onChange={(e) => onChange("detailedSpecs.cpu", "threads", parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cpu-cache">Cache</Label>
              <Input
                id="cpu-cache"
                placeholder="24MB"
                value={cpu.cache}
                onChange={(e) => onChange("detailedSpecs.cpu", "cache", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div className="grid gap-2">
              <Label htmlFor="cpu-igpu">GPU Tích Hợp</Label>
              <Input
                id="cpu-igpu"
                placeholder="16-core GPU"
                value={cpu.integratedGPU}
                onChange={(e) => onChange("detailedSpecs.cpu", "integratedGPU", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cpu-process">Tiến Trình Sản Xuất</Label>
              <Input
                id="cpu-process"
                placeholder="3nm"
                value={cpu.process}
                onChange={(e) => onChange("detailedSpecs.cpu", "process", e.target.value)}
              />
            </div>
          </div>

          {/* CPU Benchmarks */}
          <div className="mt-4">
            <h4 className="font-medium mb-3">Điểm Benchmark CPU</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="cpu-geekbench-single">Geekbench 6 Single-Core</Label>
                <Input
                  id="cpu-geekbench-single"
                  type="number"
                  placeholder="3150"
                  value={cpu.benchmarks.geekbench6Single || ""}
                  onChange={(e) => onChange("detailedSpecs.cpu.benchmarks", "geekbench6Single", parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cpu-geekbench-multi">Geekbench 6 Multi-Core</Label>
                <Input
                  id="cpu-geekbench-multi"
                  type="number"
                  placeholder="15200"
                  value={cpu.benchmarks.geekbench6Multi || ""}
                  onChange={(e) => onChange("detailedSpecs.cpu.benchmarks", "geekbench6Multi", parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cpu-cinebench-single">Cinebench R23 Single-Core</Label>
                <Input
                  id="cpu-cinebench-single"
                  type="number"
                  placeholder="1950"
                  value={cpu.benchmarks.cinebenchR23Single || ""}
                  onChange={(e) => onChange("detailedSpecs.cpu.benchmarks", "cinebenchR23Single", parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cpu-cinebench-multi">Cinebench R23 Multi-Core</Label>
                <Input
                  id="cpu-cinebench-multi"
                  type="number"
                  placeholder="14800"
                  value={cpu.benchmarks.cinebenchR23Multi || ""}
                  onChange={(e) => onChange("detailedSpecs.cpu.benchmarks", "cinebenchR23Multi", parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* GPU Information */}
        <div className="pt-3">
          <h3 className="text-lg font-medium mb-4">Thông Tin GPU</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="gpu-name">Tên GPU</Label>
              <Input
                id="gpu-name"
                placeholder="Apple M3 Pro (16-core GPU)"
                value={gpu.name}
                onChange={(e) => onChange("detailedSpecs.gpu", "name", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="gpu-type">Loại GPU</Label>
              <Input
                id="gpu-type"
                placeholder="Integrated"
                value={gpu.type}
                onChange={(e) => onChange("detailedSpecs.gpu", "type", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="gpu-tgp">TGP (W)</Label>
              <Input
                id="gpu-tgp"
                placeholder="28W"
                value={gpu.tgp}
                onChange={(e) => onChange("detailedSpecs.gpu", "tgp", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
            <div className="grid gap-2">
              <Label htmlFor="gpu-memory">VRAM</Label>
              <Input
                id="gpu-memory"
                placeholder="Unified with system"
                value={gpu.memory}
                onChange={(e) => onChange("detailedSpecs.gpu", "memory", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="gpu-memory-bus">Memory Bus</Label>
              <Input
                id="gpu-memory-bus"
                placeholder="256-bit"
                value={gpu.memoryBus}
                onChange={(e) => onChange("detailedSpecs.gpu", "memoryBus", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="gpu-memory-speed">Memory Speed</Label>
              <Input
                id="gpu-memory-speed"
                placeholder="14 Gbps"
                value={gpu.memorySpeed}
                onChange={(e) => onChange("detailedSpecs.gpu", "memorySpeed", e.target.value)}
              />
            </div>
          </div>

          {/* GPU Benchmarks */}
          <div className="mt-4">
            <h4 className="font-medium mb-3">Điểm Benchmark GPU</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="gpu-wildlife">3DMark Wildlife Extreme</Label>
                <Input
                  id="gpu-wildlife"
                  type="number"
                  placeholder="9750"
                  value={gpu.benchmarks.wildlifeExtreme || ""}
                  onChange={(e) => onChange("detailedSpecs.gpu.benchmarks", "wildlifeExtreme", parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Description for performance */}
        <div className="grid gap-2 pt-2">
          <Label htmlFor="performance-description">Mô Tả Hiệu Năng</Label>
          <textarea
            id="performance-description"
            className="min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Mô tả chi tiết về hiệu năng của laptop..."
            value={formData.descriptions.performance}
            onChange={(e) => onChange("descriptions", "performance", e.target.value)}
          />
        </div>

        {/* Performance Ratings */}
        <div className="pt-3">
          <h3 className="text-lg font-medium mb-4">Đánh Giá Hiệu Năng</h3>
          
          <div className="space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="rating-gaming">Gaming</Label>
                <span className="text-sm">{benchmarks.gaming}</span>
              </div>
              <Slider
                id="rating-gaming"
                min={0}
                max={10}
                step={0.1}
                value={[benchmarks.gaming]}
                onValueChange={(value) => handleSliderChange("gaming", value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="rating-productivity">Năng Suất Làm Việc</Label>
                <span className="text-sm">{benchmarks.productivity}</span>
              </div>
              <Slider
                id="rating-productivity"
                min={0}
                max={10}
                step={0.1}
                value={[benchmarks.productivity]}
                onValueChange={(value) => handleSliderChange("productivity", value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="rating-content">Sáng Tạo Nội Dung</Label>
                <span className="text-sm">{benchmarks.content}</span>
              </div>
              <Slider
                id="rating-content"
                min={0}
                max={10}
                step={0.1}
                value={[benchmarks.content]}
                onValueChange={(value) => handleSliderChange("content", value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="rating-battery">Thời Lượng Pin</Label>
                <span className="text-sm">{benchmarks.battery}</span>
              </div>
              <Slider
                id="rating-battery"
                min={0}
                max={10}
                step={0.1}
                value={[benchmarks.battery]}
                onValueChange={(value) => handleSliderChange("battery", value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="rating-display">Màn Hình</Label>
                <span className="text-sm">{benchmarks.display}</span>
              </div>
              <Slider
                id="rating-display"
                min={0}
                max={10}
                step={0.1}
                value={[benchmarks.display]}
                onValueChange={(value) => handleSliderChange("display", value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="rating-build">Chất Lượng Hoàn Thiện</Label>
                <span className="text-sm">{benchmarks.build}</span>
              </div>
              <Slider
                id="rating-build"
                min={0}
                max={10}
                step={0.1}
                value={[benchmarks.build]}
                onValueChange={(value) => handleSliderChange("build", value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="rating-value">Giá Trị</Label>
                <span className="text-sm">{benchmarks.value}</span>
              </div>
              <Slider
                id="rating-value"
                min={0}
                max={10}
                step={0.1}
                value={[benchmarks.value]}
                onValueChange={(value) => handleSliderChange("value", value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="rating-overall">Tổng Thể</Label>
                <span className="text-sm">{benchmarks.overall}</span>
              </div>
              <Slider
                id="rating-overall"
                min={0}
                max={10}
                step={0.1}
                value={[benchmarks.overall]}
                onValueChange={(value) => handleSliderChange("overall", value)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 