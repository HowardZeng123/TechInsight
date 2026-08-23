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
import { Switch } from "@/components/ui/switch"

interface ConnectivityInfoProps {
  formData: any
  onChange: (section: string, field: string, value: any) => void
  fieldErrors: Record<string, boolean>
  showValidation: boolean
}

export default function ConnectivityInfo({ 
  formData,
  onChange,
  fieldErrors,
  showValidation
}: ConnectivityInfoProps) {
  const { connectivity, sound } = formData.detailedSpecs
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Kết Nối & Cổng</CardTitle>
        <CardDescription>Nhập thông tin chi tiết về kết nối không dây, cổng và âm thanh</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Wireless Connectivity */}
        <div>
          <h3 className="text-lg font-medium mb-4">Kết Nối Không Dây</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="wifi">Wi-Fi</Label>
              <Input
                id="wifi"
                placeholder="Wi-Fi 6E (802.11ax)"
                value={connectivity.wifi}
                onChange={(e) => onChange("detailedSpecs.connectivity", "wifi", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bluetooth">Bluetooth</Label>
              <Input
                id="bluetooth"
                placeholder="5.3"
                value={connectivity.bluetooth}
                onChange={(e) => onChange("detailedSpecs.connectivity", "bluetooth", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Ports */}
        <div className="pt-3">
          <h3 className="text-lg font-medium mb-4">Cổng Kết Nối</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="ports-usba">Số Cổng USB-A</Label>
              <Input
                id="ports-usba"
                type="number"
                placeholder="0"
                value={connectivity.ports?.usba || ""}
                onChange={(e) => onChange("detailedSpecs.connectivity.ports", "usba", parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="ports-usbc">Số Cổng USB-C</Label>
              <Input
                id="ports-usbc"
                type="number"
                placeholder="3"
                value={connectivity.ports?.usbc || ""}
                onChange={(e) => onChange("detailedSpecs.connectivity.ports", "usbc", parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="ports-thunderbolt">Số Cổng Thunderbolt</Label>
              <Input
                id="ports-thunderbolt"
                type="number"
                placeholder="3"
                value={connectivity.ports?.thunderbolt || ""}
                onChange={(e) => onChange("detailedSpecs.connectivity.ports", "thunderbolt", parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
            <div className="grid gap-2">
              <Label htmlFor="ports-hdmi">HDMI</Label>
              <Input
                id="ports-hdmi"
                placeholder="1x HDMI 2.1"
                value={connectivity.ports?.hdmi || ""}
                onChange={(e) => onChange("detailedSpecs.connectivity.ports", "hdmi", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="ports-sdcard">Đầu Đọc Thẻ</Label>
              <Input
                id="ports-sdcard"
                placeholder="SDXC card slot"
                value={connectivity.ports?.sdCard || ""}
                onChange={(e) => onChange("detailedSpecs.connectivity.ports", "sdCard", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="ports-audio">Cổng Audio</Label>
              <Input
                id="ports-audio"
                placeholder="3.5mm headphone jack"
                value={connectivity.ports?.audio || ""}
                onChange={(e) => onChange("detailedSpecs.connectivity.ports", "audio", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Webcam & Security */}
        <div className="pt-3">
          <h3 className="text-lg font-medium mb-4">Webcam & Bảo Mật</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="webcam">Webcam</Label>
              <Input
                id="webcam"
                placeholder="1080p FaceTime HD camera"
                value={connectivity.webcam}
                onChange={(e) => onChange("detailedSpecs.connectivity", "webcam", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="fingerprint"
                  checked={connectivity.fingerprint}
                  onCheckedChange={(checked) => onChange("detailedSpecs.connectivity", "fingerprint", checked)}
                />
                <Label htmlFor="fingerprint">Cảm Biến Vân Tay</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="ir-camera"
                  checked={connectivity.irCamera}
                  onCheckedChange={(checked) => onChange("detailedSpecs.connectivity", "irCamera", checked)}
                />
                <Label htmlFor="ir-camera">Camera IR</Label>
              </div>
            </div>
          </div>
        </div>

        {/* Sound */}
        <div className="pt-3">
          <h3 className="text-lg font-medium mb-4">Âm Thanh</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="speakers">Loa</Label>
              <Input
                id="speakers"
                placeholder="Six-speaker system with force-cancelling woofers"
                value={sound.speakers}
                onChange={(e) => onChange("detailedSpecs.sound", "speakers", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="microphones">Microphone</Label>
              <Input
                id="microphones"
                placeholder="Studio-quality three-mic array"
                value={sound.microphones}
                onChange={(e) => onChange("detailedSpecs.sound", "microphones", e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="dolby-atmos"
                checked={sound.dolbyAtmos}
                onCheckedChange={(checked) => onChange("detailedSpecs.sound", "dolbyAtmos", checked)}
              />
              <Label htmlFor="dolby-atmos">Hỗ Trợ Dolby Atmos</Label>
            </div>
          </div>
        </div>

        {/* Descriptions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
          <div className="grid gap-2">
            <Label htmlFor="ports-description">Mô Tả Cổng Kết Nối</Label>
            <textarea
              id="ports-description"
              className="min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Mô tả chi tiết về các cổng kết nối..."
              value={formData.descriptions.ports}
              onChange={(e) => onChange("descriptions", "ports", e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="speakers-description">Mô Tả Hệ Thống Âm Thanh</Label>
              <textarea
                id="speakers-description"
                className="min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Mô tả chi tiết về trải nghiệm âm thanh..."
                value={formData.descriptions.speakers}
                onChange={(e) => onChange("descriptions", "speakers", e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="webcam-description">Mô Tả Webcam</Label>
              <textarea
                id="webcam-description"
                className="min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Mô tả chi tiết về chất lượng webcam..."
                value={formData.descriptions.webcam}
                onChange={(e) => onChange("descriptions", "webcam", e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 