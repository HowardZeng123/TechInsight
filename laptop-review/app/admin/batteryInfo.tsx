"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function BatteryForm() {
  const [battery, setBattery] = useState({
    capacity: "48Wh",
    chargeTime: "2.5",
    chargerWattage: "45W",
    chargerWeight: "200g",
    fastCharging: false,
    replaceable: false,
    type: "Lithium-ion",
    usbPD: false,
  })

  const handleChange = (field: string, value: string | boolean) => {
    setBattery((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Battery Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="capacity">Capacity</Label>
          <Input
            id="capacity"
            value={battery.capacity}
            onChange={(e) => handleChange("capacity", e.target.value)}
            placeholder="e.g. 48Wh"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="chargeTime">Charge Time</Label>
            <Input
              id="chargeTime"
              value={battery.chargeTime}
              onChange={(e) => handleChange("chargeTime", e.target.value)}
              placeholder="e.g. 2.5"
            />
          </div>
          <div className="flex items-end">
            <span className="text-sm text-muted-foreground mb-3">giờ để sạc đầy</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="chargerWattage">Charger Wattage</Label>
          <Input
            id="chargerWattage"
            value={battery.chargerWattage}
            onChange={(e) => handleChange("chargerWattage", e.target.value)}
            placeholder="e.g. 45W"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="chargerWeight">Charger Weight</Label>
          <Input
            id="chargerWeight"
            value={battery.chargerWeight}
            onChange={(e) => handleChange("chargerWeight", e.target.value)}
            placeholder="e.g. 200g"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Battery Type</Label>
          <Select value={battery.type} onValueChange={(value) => handleChange("type", value)}>
            <SelectTrigger id="type">
              <SelectValue placeholder="Select battery type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Lithium-ion">Lithium-ion</SelectItem>
              <SelectItem value="Lithium-polymer">Lithium-polymer</SelectItem>
              <SelectItem value="Nickel-metal hydride">Nickel-metal hydride</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="fastCharging"
            checked={battery.fastCharging}
            onCheckedChange={(checked) => handleChange("fastCharging", checked as boolean)}
          />
          <Label htmlFor="fastCharging">Fast Charging</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="replaceable"
            checked={battery.replaceable}
            onCheckedChange={(checked) => handleChange("replaceable", checked as boolean)}
          />
          <Label htmlFor="replaceable">Replaceable</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="usbPD"
            checked={battery.usbPD}
            onCheckedChange={(checked) => handleChange("usbPD", checked as boolean)}
          />
          <Label htmlFor="usbPD">USB-PD</Label>
        </div>

        
      </CardContent>
    </Card>
  )
}
