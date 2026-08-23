"use client"

import type React from "react"

import { useState } from "react"
import { LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"



interface LaptopLinkInputProps {
    formData: {
        laptopLinkInput : string
    }
    onChange: (field: string, value: string) => void
    onFocus: (field: string) => void
    fieldErrors: Record<string, boolean>
    showValidation: boolean
}
export default function LaptopLinkInput(

    {
  formData,
  onChange,
  onFocus,
  fieldErrors,
  showValidation,
}: LaptopLinkInputProps
) {


    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="text-center">Nhập đường link mua laptop</CardTitle>
            </CardHeader>
            <CardContent>
                <form  className="space-y-4">
                    <div className="space-y-2">
                        <div className="relative">                           
                            <Input
                                type="text"
                                placeholder="https://example.com/laptop"
                                value={formData.laptopLinkInput}
                                onChange={(e) => onChange("laptopLinkInput", e.target.value)}
                                onFocus={() => onFocus("laptopLinkInput")}
                                className={showValidation && fieldErrors.webcam ? "border-red-500" : ""}
                            />
                            {showValidation && fieldErrors.laptopLinkInput && (
                                <p className="text-sm text-red-500 mt-1">Link laptop is required</p>
                            )}
                        </div>

                    </div>

                </form>
            </CardContent>
        </Card>
    )
}
