"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Loader2 } from "lucide-react";
import { forumService } from "@/lib/forumService";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = [
  { id: "qa", label: "Hỏi đáp" },
  { id: "general", label: "Thảo luận chung" },
  { id: "showcase", label: "Khoe góc máy" },
  { id: "trade", label: "Mua bán" },
];

export default function CreateForumPostPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{ uid: string; email: string; displayName: string } | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    category: "general",
    content: ""
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      toast({
        title: "Chưa đăng nhập",
        description: "Vui lòng đăng nhập để đăng bài.",
        variant: "destructive",
      });
      router.push("/login");
    }
  }, [router, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập đầy đủ tiêu đề và nội dung.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const postId = await forumService.createPost({
        title: formData.title,
        content: formData.content,
        category: formData.category,
        authorId: user.uid,
        authorName: user.displayName || user.email.split('@')[0],
      });
      
      toast({
        title: "Thành công",
        description: "Bài viết đã được đăng.",
      });
      
      router.push(`/forum/${postId}`);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể đăng bài lúc này. Vui lòng thử lại sau.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  if (!user) return null; // or a loading spinner

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-3xl">
        <Button 
          variant="ghost" 
          onClick={() => router.back()} 
          className="mb-6 -ml-4"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Tạo Bài Viết Mới</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề</Label>
                <Input 
                  id="title" 
                  placeholder="Nhập tiêu đề bài viết..." 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  maxLength={100}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Chủ đề</Label>
                <select 
                  id="category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Nội dung</Label>
                <Textarea 
                  id="content" 
                  placeholder="Bạn muốn chia sẻ điều gì?" 
                  className="min-h-[200px]"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
                Hủy
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Đăng Bài
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
