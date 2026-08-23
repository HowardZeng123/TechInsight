import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface BatteryLifeProps {
  formData: {
    videoPlayback: string
    casualUse: string
    extremeUse: string
  
  }
  onChange: (field: string, value: string) => void
  onFocus: (field: string) => void
  fieldErrors: Record<string, boolean>
  showValidation: boolean
}


export default function BatteryLife(
  {
  formData,
  onChange,
  onFocus,
  fieldErrors,
  showValidation,
}: BatteryLifeProps
) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Battery Life</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="video-playback">Watching Online Videos</Label>
          <Input id="video-playback" placeholder="e.g. Up to 10 hours" 
          value={formData.videoPlayback}
            onChange={(e) => onChange("videoPlayback", e.target.value)}
            onFocus={() => onFocus("videoPlayback")}
          className={showValidation && fieldErrors.videoPlayback ? "border-red-500" : ""}/>
          {showValidation && fieldErrors.videoPlayback && (
                  <p className="text-sm text-red-500 mt-1">Watching Online Videos</p>
                )}
        </div>

        <div>
          <Label htmlFor="casual-use">Casual Use</Label>
          <Input id="casual-use" placeholder="e.g. Up to 8 hours" 
          value={formData.casualUse}
            onChange={(e) => onChange("casualUse", e.target.value)}
            onFocus={() => onFocus("casualUse")}
          className={showValidation && fieldErrors.casualUse ? "border-red-500" : ""}/>
          {showValidation && fieldErrors.casualUse && (
                  <p className="text-sm text-red-500 mt-1">Casual Use</p>
                )}
        </div>

        <div>
          <Label htmlFor="extreme-use">Extreme Use</Label>
          <Input id="extreme-use" placeholder="e.g. Up to 2 hours" 
          value={formData.extremeUse}
            onChange={(e) => onChange("extremeUse", e.target.value)}
            onFocus={() => onFocus("extremeUse")}
          className={showValidation && fieldErrors.extremeUse ? "border-red-500" : ""}/>
          {showValidation && fieldErrors.extremeUse && (
                  <p className="text-sm text-red-500 mt-1">Extreme Use</p>
                )}
        </div>
      </div>
    </div>
  )
}
