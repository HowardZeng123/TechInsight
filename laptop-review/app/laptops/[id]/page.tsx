"use client";

import { useParams } from "next/navigation";
import { useLaptopData } from "@/hooks/useLaptopData";
import LaptopDetailPage from "@/components/laptop-detail/LaptopDetailPageUI";
import { useState, useEffect } from "react";
import { laptopService } from "@/services/firebaseServices";
import { SimilarLaptop, Laptop } from "@/types/laptop";
import { CommentSection } from "@/components/laptop-detail/sections/comment-section";

interface LaptopData {
  laptop: Laptop | null;
  loading: boolean;
  error: any;
}

export default function LaptopDetailPageContainer() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { laptop, loading, error }: LaptopData = useLaptopData(id || '');
  const [similarLaptops, setSimilarLaptops] = useState<SimilarLaptop[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  // Lấy laptop tương tự từ Firestore
  useEffect(() => {
    if (!laptop) return;

    const similarIds = laptop.similarLaptopIds || [];
    if (similarIds.length === 0) return;

    async function fetchSimilarLaptops() {
      try {
        setLoadingSimilar(true);
        const laptopPromises = similarIds.map(
          (similarId: string) => laptopService.getById(similarId)
        );

        const results = await Promise.all(laptopPromises);

        const similarLaptopsData = results
          .filter((item: any) => item !== null)
          .map((item: any) => ({
            id: item.id,
            name: item.name,
            image: item.image,
            price: item.price,
            cpu: item.specs.cpu,
            gpu: item.specs.gpu,
            ram: item.specs.ram,
            storage: item.specs.storage,
            display: item.specs.display,
            battery: item.specs.battery,
            score: item.benchmarks?.overall || 0
          }));

        setSimilarLaptops(similarLaptopsData);
      } catch (error) {
        console.error("Error fetching similar laptops:", error);
      } finally {
        setLoadingSimilar(false);
      }
    }

    fetchSimilarLaptops();
  }, [laptop]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">Loading...</div>
    );
  }

  if (error || !laptop) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Laptop not found</h1>
          <p className="text-gray-600">
            The laptop you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <LaptopDetailPage laptop={laptop} similarLaptops={similarLaptops} />
    </>
  );
}
