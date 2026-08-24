"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Eye, Clock, Plus, Loader2 } from "lucide-react";
import { forumService, ForumPost } from "@/lib/forumService";

const CATEGORIES = [
  { id: "all", label: "Tất cả" },
  { id: "qa", label: "Hỏi đáp" },
  { id: "general", label: "Thảo luận chung" },
  { id: "showcase", label: "Khoe góc máy" },
  { id: "trade", label: "Mua bán" },
];

export default function ForumPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [user, setUser] = useState<{ uid: string; email: string; displayName: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const data = await forumService.getAllPosts(activeCategory);
        setPosts(data);
      } catch (error) {
        console.error("Lỗi khi tải bài viết:", error);
      }
      setLoading(false);
    };

    fetchPosts();
  }, [activeCategory]);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('vi-VN', { 
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(date);
  };

  const getCategoryLabel = (id: string) => {
    return CATEGORIES.find(c => c.id === id)?.label || id;
  };

  const handleCreatePost = () => {
    if (!user) {
      alert("Bạn cần đăng nhập để đăng bài!");
      router.push("/login");
      return;
    }
    router.push("/forum/create");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Cộng Đồng TechInsight</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Nơi giao lưu, hỏi đáp và chia sẻ đam mê công nghệ</p>
          </div>
          <Button onClick={handleCreatePost} className="w-full md:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Tạo Bài Viết
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Categories */}
          <div className="w-full md:w-64 flex-shrink-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Chủ đề</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                {CATEGORIES.map((cat) => (
                  <Button
                    key={cat.id}
                    variant={activeCategory === cat.id ? "default" : "ghost"}
                    className="justify-start w-full"
                    onClick={() => setActiveCategory(cat.id)}
                  >
                    {cat.label}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Posts List */}
          <div className="flex-1 space-y-4">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : posts.length === 0 ? (
              <Card className="py-12 text-center">
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400">Chưa có bài viết nào trong chủ đề này.</p>
                  <Button variant="outline" className="mt-4" onClick={handleCreatePost}>Trở thành người đầu tiên đăng bài</Button>
                </CardContent>
              </Card>
            ) : (
              posts.map((post) => (
                <Card 
                  key={post.id} 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => router.push(`/forum/${post.id}`)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-4">
                      <CardTitle className="text-xl line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {post.title}
                      </CardTitle>
                      <Badge variant="secondary" className="whitespace-nowrap">
                        {getCategoryLabel(post.category)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="text-gray-600 dark:text-gray-300 line-clamp-2 text-sm">
                      {post.content}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0 text-sm text-gray-500 dark:text-gray-400 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {post.authorName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDate(post.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {post.views || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {post.commentCount || 0}
                      </span>
                    </div>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
