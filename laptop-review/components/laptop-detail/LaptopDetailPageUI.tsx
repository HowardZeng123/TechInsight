import React from "react";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import TabPanel from "@/components/common/tab-panel";
import Overview from "./sections/Overview";
import Specifications from "./sections/Specifications";
import Performance from "./sections/Performance";
import ProsCons from "./sections/ProsCons";
import DetailedAnalysis from "./sections/DetailedAnalysis";
import ComparisonTable from "./comparison-table";
import ComparisonButton from "@/components/comparison/ComparisonButton";
import { CommentSection } from "./sections/comment-section";

type LaptopDetailPageProps = {
  laptop: any;
  similarLaptops?: any[];
};

export default function LaptopDetailPage({ laptop, similarLaptops = [] }: LaptopDetailPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Overview Section */}
        <Overview laptop={laptop} />
        
        {/* Tabs Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-800 p-4 sm:p-6 mb-8">
          <TabPanel>
            <TabPanel.Tab label="Specifications">
              <Specifications laptop={laptop} />
            </TabPanel.Tab>
            
            {laptop.benchmarks ? (
              <TabPanel.Tab label="">
                <Performance laptop={laptop} />
              </TabPanel.Tab>
            ) : null}
            
            {similarLaptops && similarLaptops.length > 0 ? (
              <TabPanel.Tab label="Comparisons">
                <div className="pt-4">
                  <ComparisonTable laptops={similarLaptops} currentLaptopId={laptop.id} />
                </div>
              </TabPanel.Tab>
            ) : null}
          </TabPanel>
        </div>
        
        {/* Pros and Cons Section */}
        <ProsCons laptop={laptop} />
        
        {/* Detailed Analysis Section */}
        <DetailedAnalysis laptop={laptop} />
        <div className="mt-10">
          {/* Lấy user hiện tại từ localStorage */}
          {(() => {
            let user = null;
            if (typeof window !== "undefined") {
              const storedUserData = localStorage.getItem("user");
              user = storedUserData ? JSON.parse(storedUserData) : null;
            }
            return (
              <CommentSection
                laptop={laptop}
                laptopName={laptop.name}
                currentUser={{
                  id: user?.uid || "guest",
                  username: user?.displayName || user?.email || "Khách"
                }}
              />
            );
          })()}
        </div>
      </main>

      {/* Floating Comparison Button */}
      <ComparisonButton currentLaptopId={laptop.id} />
      <Footer />
    </div>
  );
}