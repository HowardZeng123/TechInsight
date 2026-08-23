"use client"
import { useState } from "react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash } from "lucide-react"

interface ProsConsItem {
  id: string
  text: string
}

interface ProsConsSectionProps {
  prosConsData: {
    pros: ProsConsItem[]
    cons: ProsConsItem[]
  }
  onChange: (pros: ProsConsItem[], cons: ProsConsItem[]) => void
}

export default function ProsConsSection({ 
  prosConsData,
  onChange
}: ProsConsSectionProps) {
  // Helper function to generate unique ID
  const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

  // Handle pros change
  const handleProChange = (id: string, text: string) => {
    const updatedPros = prosConsData.pros.map(pro => 
      pro.id === id ? { ...pro, text } : pro
    )
    onChange(updatedPros, prosConsData.cons)
  }

  // Handle cons change
  const handleConChange = (id: string, text: string) => {
    const updatedCons = prosConsData.cons.map(con => 
      con.id === id ? { ...con, text } : con
    )
    onChange(prosConsData.pros, updatedCons)
  }

  // Add new pro
  const addPro = () => {
    const newPro = { id: generateId('pro'), text: '' }
    onChange([...prosConsData.pros, newPro], prosConsData.cons)
  }

  // Add new con
  const addCon = () => {
    const newCon = { id: generateId('con'), text: '' }
    onChange(prosConsData.pros, [...prosConsData.cons, newCon])
  }

  // Remove pro
  const removePro = (id: string) => {
    const updatedPros = prosConsData.pros.filter(pro => pro.id !== id)
    onChange(updatedPros, prosConsData.cons)
  }

  // Remove con
  const removeCon = (id: string) => {
    const updatedCons = prosConsData.cons.filter(con => con.id !== id)
    onChange(prosConsData.pros, updatedCons)
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ưu & Nhược Điểm</CardTitle>
        <CardDescription>Nhập ưu và nhược điểm của laptop</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pros Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Ưu Điểm</h3>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={addPro}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Thêm ưu điểm
            </Button>
          </div>
          
          <div className="space-y-3">
            {prosConsData.pros.map((pro, index) => (
              <div key={pro.id} className="flex gap-2">
                <div className="flex-1">
                  <Input
                    value={pro.text}
                    onChange={(e) => handleProChange(pro.id, e.target.value)}
                    placeholder="Nhập ưu điểm của laptop..."
                  />
                </div>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removePro(pro.id)}
                  disabled={prosConsData.pros.length === 1}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Cons Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Nhược Điểm</h3>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={addCon}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Thêm nhược điểm
            </Button>
          </div>
          
          <div className="space-y-3">
            {prosConsData.cons.map((con, index) => (
              <div key={con.id} className="flex gap-2">
                <div className="flex-1">
                  <Input
                    value={con.text}
                    onChange={(e) => handleConChange(con.id, e.target.value)}
                    placeholder="Nhập nhược điểm của laptop..."
                  />
                </div>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeCon(con.id)}
                  disabled={prosConsData.cons.length === 1}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 