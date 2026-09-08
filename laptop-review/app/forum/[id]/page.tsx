"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronLeft, Loader2, Clock, Eye, MessageSquare, Send } from "lucide-react";
import { forumService, ForumPost, ForumComment } from "@/lib/forumService";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = [
  { id: "qa", label: "Hỏi đáp" },
  { id: "general", label: "Thảo luận chung" },
  { id: "showcase", label: "Khoe góc máy" },
  { id: "trade", label: "Mua bán" },
];

export default function ForumPostDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [post, setPost] = useState<ForumPost | null>(null);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commenting, setCommenting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<ForumComment | null>(null);
  const [user, setUser] = useState<{ uid: string; email: string; displayName: string } | null>(null);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleReplyClick = (comment: ForumComment) => {
    setReplyingTo(comment);
    if (commentInputRef.current) {
      commentInputRef.current.focus();
      commentInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postData = await forumService.getPostById(params.id);
        if (!postData) {
          toast({ title: "Lỗi", description: "Không tìm thấy bài viết.", variant: "destructive" });
          router.push("/forum");
          return;
        }
        setPost(postData);
        
        const commentsData = await forumService.getCommentsByPostId(params.id);
        setComments(commentsData);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    fetchData();
  }, [params.id, router, toast]);

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

  const handlePostComment = async () => {
    if (!user) {
      toast({ title: "Chưa đăng nhập", description: "Vui lòng đăng nhập để bình luận.", variant: "destructive" });
      router.push("/login");
      return;
    }
    
    if (!newComment.trim()) return;

    setCommenting(true);
    try {
      const commentPayload: any = {
        content: newComment,
        authorId: user.uid,
        authorName: user.displayName || user.email.split('@')[0],
      };
      if (replyingTo) {
        commentPayload.parentId = replyingTo.id;
      }

      const commentId = await forumService.addComment(params.id, commentPayload);
      
      // Update local state
      const newCommentObj: ForumComment = {
        id: commentId,
        postId: params.id,
        ...commentPayload,
        createdAt: new Date()
      };
      
      setComments([newCommentObj, ...comments]);
      setPost(prev => prev ? { ...prev, commentCount: (prev.commentCount || 0) + 1 } : null);
      setNewComment("");
      setReplyingTo(null);
      
      toast({ title: "Thành công", description: "Đã gửi bình luận." });
    } catch (error) {
      toast({ title: "Lỗi", description: "Không thể gửi bình luận.", variant: "destructive" });
    }
    setCommenting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => router.push("/forum")} 
          className="mb-6 -ml-4"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Trở về Cộng Đồng
        </Button>

        {/* Main Post */}
        <Card className="mb-8">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start mb-4">
              <Badge variant="secondary">{getCategoryLabel(post.category)}</Badge>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {post.views}</span>
                <span className="flex items-center gap-1"><MessageSquare className="w-4 h-4" /> {post.commentCount}</span>
              </div>
            </div>
            <CardTitle className="text-2xl md:text-3xl font-bold">{post.title}</CardTitle>
            <div className="flex items-center gap-3 mt-4">
              <Avatar>
                <AvatarFallback className="bg-blue-100 text-blue-700">
                  {post.authorName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{post.authorName}</div>
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {formatDate(post.createdAt)}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
              {post.content}
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Bình luận ({comments.length})
          </h3>

          {/* Comment input */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <Avatar className="hidden sm:block">
                  <AvatarFallback>{user ? user.email.charAt(0).toUpperCase() : "?"}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  {replyingTo && (
                    <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Đang phản hồi <strong>{replyingTo.authorName}</strong>
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)} className="h-6 px-2">Hủy</Button>
                    </div>
                  )}
                  <Textarea 
                    ref={commentInputRef}
                    placeholder={user ? "Viết bình luận của bạn..." : "Vui lòng đăng nhập để bình luận"}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    disabled={!user || commenting}
                    className="min-h-[100px]"
                  />
                  <div className="flex justify-end">
                    <Button 
                      onClick={handlePostComment} 
                      disabled={!user || !newComment.trim() || commenting}
                    >
                      {commenting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                      Gửi bình luận
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments list */}
          <div className="space-y-4">
            {(() => {
              const topLevelComments = comments.filter(c => !c.parentId);
              
              const getReplies = (parentId: string): ForumComment[] => {
                const directReplies = comments.filter(c => c.parentId === parentId).reverse();
                const allReplies: ForumComment[] = [];
                directReplies.forEach(reply => {
                  allReplies.push(reply);
                  allReplies.push(...getReplies(reply.id!));
                });
                return allReplies;
              };

              const orderedComments: ForumComment[] = [];
              topLevelComments.forEach(comment => {
                orderedComments.push(comment);
                orderedComments.push(...getReplies(comment.id!));
              });

              return orderedComments.map((comment) => (
                <Card key={comment.id} className={comment.parentId ? "ml-8 sm:ml-12 border-l-4 border-l-blue-400 bg-blue-50/30 dark:bg-blue-900/10" : ""}>
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gray-100">
                          {comment.authorName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-baseline mb-1">
                          <span className="font-medium">{comment.authorName}</span>
                          <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                        </div>
                        {comment.parentId && (
                          <div className="text-xs text-gray-400 mb-2">
                            <span className="text-blue-500 mr-1">↳</span>
                            Trả lời {comments.find(c => c.id === comment.parentId)?.authorName || 'ai đó'}
                          </div>
                        )}
                        <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm">
                          {comment.content}
                        </div>
                        {user && (
                          <div className="mt-2 text-xs">
                            <button onClick={() => handleReplyClick(comment)} className="text-blue-600 hover:text-blue-800 font-medium">Phản hồi</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ));
            })()}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
