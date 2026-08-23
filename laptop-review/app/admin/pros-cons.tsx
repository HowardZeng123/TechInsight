"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Item {
  id: string
  text: string
}

interface ProsConsProps {
  onChange?: (pros: Item[], cons: Item[]) => void
}

export default function ProsCons({ onChange }: ProsConsProps) {
  const [pros, setPros] = useState<Item[]>([{ id: "pro-1", text: "" }])
  const [cons, setCons] = useState<Item[]>([{ id: "con-1", text: "" }])

  const addPro = () => {
    const newPros = [...pros, { id: `pro-${Date.now()}`, text: "" }]
    setPros(newPros)
    if (onChange) {
      onChange(newPros, cons)
    }
  }

  const addCon = () => {
    const newCons = [...cons, { id: `con-${Date.now()}`, text: "" }]
    setCons(newCons)
    if (onChange) {
      onChange(pros, newCons)
    }
  }

  const removePro = (id: string) => {
    const newPros = pros.filter((pro) => pro.id !== id)
    setPros(newPros)
    if (onChange) {
      onChange(newPros, cons)
    }
  }

  const removeCon = (id: string) => {
    const newCons = cons.filter((con) => con.id !== id)
    setCons(newCons)
    if (onChange) {
      onChange(pros, newCons)
    }
  }

  const updatePro = (id: string, text: string) => {
    const newPros = pros.map((pro) => (pro.id === id ? { ...pro, text } : pro))
    setPros(newPros)
    if (onChange) {
      onChange(newPros, cons)
    }
  }

  const updateCon = (id: string, text: string) => {
    const newCons = cons.map((con) => (con.id === id ? { ...con, text } : con))
    setCons(newCons)
    if (onChange) {
      onChange(pros, newCons)
    }
  }

  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Pros & Cons</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-green-50 border border-green-100 rounded-lg p-4">
            <h3 className="text-green-700 font-medium mb-4">Pros</h3>

            {pros.map((pro) => (
              <div key={pro.id} className="flex items-center gap-2 mb-2">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
                <Input
                  value={pro.text}
                  onChange={(e) => updatePro(pro.id, e.target.value)}
                  placeholder="e.g. Exceptional performance for creative professionals"
                  className="flex-grow"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removePro(pro.id)}
                  className="flex-shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                  disabled={pros.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addPro}
              className="w-full mt-2 border-dashed border-green-200 text-green-600 hover:bg-green-50"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Pros
            </Button>
          </div>

          <div className="bg-red-50 border border-red-100 rounded-lg p-4">
            <h3 className="text-red-700 font-medium mb-4">Cons</h3>

            {cons.map((con) => (
              <div key={con.id} className="flex items-center gap-2 mb-2">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                </div>
                <Input
                  value={con.text}
                  onChange={(e) => updateCon(con.id, e.target.value)}
                  placeholder="e.g. Expensive compared to Windows alternatives"
                  className="flex-grow"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCon(con.id)}
                  className="flex-shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                  disabled={cons.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addCon}
              className="w-full mt-2 border-dashed border-red-200 text-red-600 hover:bg-red-50"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Cons
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
