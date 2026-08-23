"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ChevronLeft } from "lucide-react"
import { initializeApp } from "firebase/app"
import { getFirestore, collection, addDoc, serverTimestamp, doc, updateDoc } from "firebase/firestore"

import BasicInfo from "./BasicInfo"
import Specifications from "./Specifications"
import DisplayInfo from "./DisplayInfo"
import BatteryInfo from "./BatteryInfo"
import PerformanceInfo from "./PerformanceInfo"
import ProsConsSection from "./ProsConsSection"
import DesignInfo from "./DesignInfo"
import ConnectivityInfo from "./ConnectivityInfo"

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAFSVL94k5zXkrAy5oQKbO7rT6W5fPAk4M",
  authDomain: "laptop-review-all.firebaseapp.com",
  projectId: "laptop-review-all",
  storageBucket: "laptop-review-all.firebasestorage.app",
  messagingSenderId: "1044782876129",
  appId: "1:1044782876129:web:6e0891bf2753c5a3f63ea0",
}

// Pros/Cons interface
interface ProsConsItem {
  id: string
  text: string
}

interface LaptopFormProps {
  editMode?: boolean
  initialData?: any
  laptopId?: string
}

export default function LaptopForm({ editMode = false, initialData = null, laptopId = "" }: LaptopFormProps) {
  const router = useRouter()
  const [showValidation, setShowValidation] = useState(false)
  const [formErrors, setFormErrors] = useState<string[]>([])
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({})

  // Main form data state
  const [formData, setFormData] = useState({
    // Basic Information
    id: "",
    name: "",
    image: "/placeholder.svg?height=600&width=600",
    price: "",
    originalPrice: "",
    purchaseLink: "",

    // Hardware Specifications
    specs: {
      cpu: "",
      gpu: "",
      ram: "",
      storage: "",
      display: "",
      battery: "",
    },

    // Detailed descriptions for each aspect
    descriptions: {
      performance: "",
      battery: "",
      design: "",
      display: "",
      keyboard: "",
      trackpad: "",
      speakers: "",
      webcam: "",
      ports: "",
    },

    // Benchmark scores
    benchmarks: {
      gaming: 5,
      productivity: 5,
      content: 5,
      battery: 5,
      display: 5,
      build: 5,
      value: 5,
      overall: 5,
      batteryLifeCasual: "",
      batteryLifeVideo: "",
      batteryLifeHeavy: "",
    },

    // Detailed specs
    detailedSpecs: {
      case: {
        weight: "",
        dimensions: "",
        screenToBodyRatio: "",
        material: "",
        color: "",
        maxOpenAngle: "",
        cooling: "",
        noiseLevel: "",
      },
      display: {
        size: "",
        type: "",
        refreshRate: "",
        resolution: "",
        aspectRatio: "",
        ppi: "",
        brightness: "",
        colorGamut: {
          sRGB: "",
          adobeRGB: "",
          dciP3: "",
        },
        responseTime: "",
        touchscreen: false,
        hdr: false,
      },
      battery: {
        capacity: "",
        chargeTime: "",
        type: "",
        replaceable: false,
        fastCharging: false,
        usbPD: false,
        chargerWattage: "",
        chargerWeight: "",
      },
      cpu: {
        name: "",
        baseFrequency: "",
        turboFrequency: "",
        cores: 0,
        threads: 0,
        cache: "",
        integratedGPU: "",
        process: "",
        benchmarks: {
          geekbench6Single: 0,
          geekbench6Multi: 0,
          cinebenchR23Single: 0,
          cinebenchR23Multi: 0,
        },
      },
      gpu: {
        name: "",
        tgp: "",
        type: "",
        process: "",
        baseFrequency: "",
        boostFrequency: "",
        memory: "",
        memoryBus: "",
        memorySpeed: "",
        optimus: false,
        benchmarks: {
          wildlifeExtreme: 0,
        },
      },
      ram: {
        capacity: "",
        type: "",
        speed: "",
        channels: 0,
        upgradeable: false,
        maxCapacity: "",
        slots: 0,
      },
      storage: {
        capacity: "",
        type: "",
        interface: "",
        upgradeable: false,
        slots: 0,
      },
      sound: {
        speakers: "",
        dolbyAtmos: false,
        microphones: "",
      },
      connectivity: {
        wifi: "",
        bluetooth: "",
        webcam: "",
        ports: {
          usba: 0,
          usbc: 0,
          thunderbolt: 0,
          hdmi: "",
          sdCard: "",
          audio: "",
          ethernet: "",
        },
        fingerprint: false,
        irCamera: false,
      },
      input: {
        keyboard: "",
        numpad: false,
        keyTravel: "",
        touchpad: {
          size: "",
          surface: "",
          precision: false,
        },
      },
    },
  })

  // Pros and cons state
  const [prosConsData, setProsConsData] = useState({
    pros: [{ id: "pro-1", text: "" }] as ProsConsItem[],
    cons: [{ id: "con-1", text: "" }] as ProsConsItem[],
  })

  // Initialize Firebase
  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)

  // Load initial data if in edit mode
  useEffect(() => {
    if (editMode && initialData) {
      // Map the flat Firestore data structure to our nested form structure
      const mappedData = {
        id: initialData.id || "",
        name: initialData.name || "",
        image: initialData.image || "/placeholder.svg?height=600&width=600",
        price: initialData.price || "",
        originalPrice: initialData.originalPrice || "",
        purchaseLink: initialData.purchaseLink || "",

        specs: {
          cpu: initialData.specs?.cpu || "",
          gpu: initialData.specs?.gpu || "",
          ram: initialData.specs?.ram || "",
          storage: initialData.specs?.storage || "",
          display: initialData.specs?.display || "",
          battery: initialData.specs?.battery || "",
        },

        descriptions: {
          performance: initialData.descriptions?.performance || "",
          battery: initialData.descriptions?.battery || "",
          design: initialData.descriptions?.design || "",
          display: initialData.descriptions?.display || "",
          keyboard: initialData.descriptions?.keyboard || "",
          trackpad: initialData.descriptions?.trackpad || "",
          speakers: initialData.descriptions?.speakers || "",
          webcam: initialData.descriptions?.webcam || "",
          ports: initialData.descriptions?.ports || "",
        },

        benchmarks: {
          gaming: initialData.benchmarks?.gaming || 5,
          productivity: initialData.benchmarks?.productivity || 5,
          content: initialData.benchmarks?.content || 5,
          battery: initialData.benchmarks?.battery || 5,
          display: initialData.benchmarks?.display || 5,
          build: initialData.benchmarks?.build || 5,
          value: initialData.benchmarks?.value || 5,
          overall: initialData.benchmarks?.overall || 5,
          batteryLifeCasual: initialData.benchmarks?.batteryLifeCasual || "",
          batteryLifeVideo: initialData.benchmarks?.batteryLifeVideo || "",
          batteryLifeHeavy: initialData.benchmarks?.batteryLifeHeavy || "",
        },

        detailedSpecs: {
          ...formData.detailedSpecs,
          ...(initialData.detailedSpecs || {}),
        },
      }

      setFormData(mappedData)

      if (initialData.pros && initialData.pros.length > 0) {
        const prosItems = initialData.pros.map((text: string, index: number) => ({
          id: `pro-${index + 1}`,
          text,
        }))
        
        if (initialData.cons && initialData.cons.length > 0) {
          const consItems = initialData.cons.map((text: string, index: number) => ({
            id: `con-${index + 1}`,
            text,
          }))
          
          setProsConsData({
            pros: prosItems,
            cons: consItems,
          })
        }
      }
    }
  }, [editMode, initialData])

  // Form validation
  const validateForm = () => {
    const errors: string[] = []
    const newFieldErrors: Record<string, boolean> = {}

    // Check required basic fields
    if (!formData.name) {
      errors.push("Tên laptop là bắt buộc")
      newFieldErrors["name"] = true
    }
    
    if (!formData.id) {
      errors.push("ID laptop là bắt buộc")
      newFieldErrors["id"] = true
    }

    if (!formData.price) {
      errors.push("Giá laptop là bắt buộc")
      newFieldErrors["price"] = true
    }

    // Check required specs
    const requiredSpecs = ["cpu", "gpu", "ram", "storage", "display", "battery"]
    requiredSpecs.forEach(spec => {
      if (!formData.specs[spec as keyof typeof formData.specs]) {
        errors.push(`${spec.toUpperCase()} là bắt buộc`)
        newFieldErrors[`specs.${spec}`] = true
      }
    })

    // Check pros and cons
    if (prosConsData.pros.length === 0 || prosConsData.pros.every(pro => !pro.text.trim())) {
      errors.push("Cần có ít nhất một ưu điểm")
    }

    if (prosConsData.cons.length === 0 || prosConsData.cons.every(con => !con.text.trim())) {
      errors.push("Cần có ít nhất một nhược điểm")
    }

    setFieldErrors(newFieldErrors)
    setFormErrors(errors)
    return errors.length === 0
  }

  // Update form data
  const handleInputChange = (
    section: string,
    field: string,
    value: string | number | boolean | object
  ) => {
    setFormData(prevData => {
      const newData = { ...prevData }
      
      if (section === "root") {
        // Root level field
        newData[field as keyof typeof newData] = value as never
      } else if (section === "specs") {
        // Specs section
        newData.specs = {
          ...newData.specs,
          [field]: value,
        }
      } else if (section === "descriptions") {
        // Descriptions section
        newData.descriptions = {
          ...newData.descriptions,
          [field]: value,
        }
      } else if (section === "benchmarks") {
        // Benchmarks section
        newData.benchmarks = {
          ...newData.benchmarks,
          [field]: value,
        }
      } else if (section.startsWith("detailedSpecs.")) {
        // Handle nested detailed specs
        const [_, category, subCategory] = section.split(".")
        
        if (subCategory) {
          // Handle deeply nested fields like colorGamut, touchpad, etc.
          newData.detailedSpecs[category as keyof typeof newData.detailedSpecs][subCategory as any][field as any] = value as any
        } else {
          // Handle category level fields
          newData.detailedSpecs[category as keyof typeof newData.detailedSpecs][field as any] = value as any
        }
      }
      
      return newData
    })

    // Clear field error if it exists
    if (fieldErrors[`${section}.${field}`] || fieldErrors[field]) {
      const updatedErrors = { ...fieldErrors }
      delete updatedErrors[`${section}.${field}`]
      delete updatedErrors[field]
      setFieldErrors(updatedErrors)
    }
  }

  // Handle pros and cons changes
  const handleProsConsChange = (pros: ProsConsItem[], cons: ProsConsItem[]) => {
    setProsConsData({ pros, cons })
  }

  // Save data to Firestore
  const saveToFirestore = async () => {
    try {
      // Prepare the data for Firestore
      const laptopData = {
        ...formData,
        pros: prosConsData.pros.map(pro => pro.text).filter(text => text.trim() !== ""),
        cons: prosConsData.cons.map(con => con.text).filter(text => text.trim() !== ""),
      }

      if (editMode && laptopId) {
        // Update existing document
        const laptopRef = doc(db, "laptops", laptopId)
        
        // Khi cập nhật, không thay đổi ID của laptop
        // Loại bỏ trường id khỏi dữ liệu cập nhật để tránh ghi đè ID
        const { id, ...dataToUpdate } = laptopData;
        
        await updateDoc(laptopRef, {
          ...dataToUpdate,
          updatedAt: serverTimestamp(),
        })
      } else {
        // Add new document
        await addDoc(collection(db, "laptops"), {
          ...laptopData,
          createdAt: serverTimestamp(),
        })
      }
      
      return true
    } catch (error) {
      console.error("Error saving laptop data:", error)
      return false
    }
  }

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setShowValidation(true)

    if (validateForm()) {
      const success = await saveToFirestore()
      
      if (success) {
        alert(editMode 
          ? "Thông tin laptop đã được cập nhật thành công!" 
          : "Thông tin laptop đã được lưu thành công!")
        
        if (editMode) {
          router.push("/admin/manage-laptops")
        } else {
          // Optional: Reset form or redirect
          // router.push("/admin/laptops")
        }
      } else {
        alert("Có lỗi xảy ra khi lưu thông tin laptop")
      }
    } else {
      // Scroll to top to show errors
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          className="flex items-center gap-1 text-muted-foreground"
          onClick={() => router.push(editMode ? "/admin/manage-laptops" : "/")}
        >
          <ChevronLeft className="h-4 w-4" />
          {editMode ? "Quay lại danh sách laptop" : "Quay lại trang chủ"}
        </Button>
        <h1 className="text-2xl font-bold">
          {editMode ? "Chỉnh Sửa Laptop" : "Thêm Laptop Mới"}
        </h1>
        <Button onClick={handleSubmit}>
          {editMode ? "Cập Nhật Laptop" : "Lưu Laptop"}
        </Button>
      </div>

      {showValidation && formErrors.length > 0 && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-medium">Vui lòng sửa các lỗi sau:</div>
            <ul className="list-disc pl-5 mt-2">
              {formErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info Section */}
        <BasicInfo 
          formData={formData}
          onChange={handleInputChange}
          fieldErrors={fieldErrors}
          showValidation={showValidation}
        />

        {/* Specifications Section */}
        <Specifications
          formData={formData}
          onChange={handleInputChange}
          fieldErrors={fieldErrors}
          showValidation={showValidation}
        />

        {/* Display Section */}
        <DisplayInfo
          formData={formData}
          onChange={handleInputChange}
          fieldErrors={fieldErrors}
          showValidation={showValidation}
        />

        {/* Battery Section */}
        <BatteryInfo
          formData={formData}
          onChange={handleInputChange}
          fieldErrors={fieldErrors}
          showValidation={showValidation}
        />

        {/* Performance Information */}
        <PerformanceInfo
          formData={formData}
          onChange={handleInputChange}
          fieldErrors={fieldErrors}
          showValidation={showValidation}
        />

        {/* Design Information */}
        <DesignInfo
          formData={formData} 
          onChange={handleInputChange}
          fieldErrors={fieldErrors}
          showValidation={showValidation}
        />

        {/* Connectivity Information */}
        <ConnectivityInfo
          formData={formData}
          onChange={handleInputChange}
          fieldErrors={fieldErrors}
          showValidation={showValidation}
        />

        {/* Pros and Cons */}
        <ProsConsSection 
          prosConsData={prosConsData}
          onChange={handleProsConsChange}
        />

        {showValidation && formErrors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Có {formErrors.length} lỗi cần khắc phục. Vui lòng kiểm tra lại form.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end">
          <Button type="submit" size="lg">
            {editMode ? "Cập Nhật Thông Tin Laptop" : "Lưu Thông Tin Laptop"}
          </Button>
        </div>
      </form>
    </div>
  )
} 