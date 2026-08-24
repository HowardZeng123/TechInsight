import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { laptopService, smartphoneService, articleService } from "@/services/firebaseServices";
import { forumService } from "@/lib/forumService";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  console.log("RECEIVED MESSAGES:", JSON.stringify(messages, null, 2));

  // Fetch data from Firebase
  let laptopData: any[] = [];
  let smartphoneData: any[] = [];
  let forumData: any[] = [];
  let articleData: any[] = [];

  try {
    const [laptops, phones, forumPosts, articles] = await Promise.all([
      laptopService.getAll(),
      smartphoneService.getAll(),
      forumService.getAllPosts(),
      articleService.getAll()
    ]);
    laptopData = laptops;
    smartphoneData = phones;
    forumData = forumPosts;
    articleData = articles;
  } catch (error) {
    console.error("Lỗi khi đọc dữ liệu từ Firebase:", error);
  }

  // Create summaries for the prompt
  const laptopSummary = laptopData.length > 0 
    ? laptopData
      .map(
        (laptop) =>
          `- ${laptop.name} | Giá: ${laptop.salePrice ? laptop.salePrice.toLocaleString() + 'đ' : 'Liên hệ'} | Cấu hình: CPU ${laptop.specs?.cpu}, RAM ${laptop.specs?.ram}, Ổ cứng ${laptop.specs?.storage}`
      )
      .join("\n")
    : "Hiện tại không có laptop nào trong kho.";

  const smartphoneSummary = smartphoneData.length > 0
    ? smartphoneData
      .map(
        (phone) =>
          `- ${phone.name} | Giá: ${phone.salePrice ? phone.salePrice.toLocaleString() + 'đ' : 'Liên hệ'} | Cấu hình: Chip ${phone.specs?.soc}, RAM ${phone.specs?.ram}, Lưu trữ ${phone.specs?.storage}`
      )
      .join("\n")
    : "Hiện tại không có điện thoại nào trong kho.";

  const forumSummary = forumData.length > 0
    ? forumData
      .map((f) => `- Chủ đề: "${f.title}" | Danh mục: ${f.category} | Nội dung: ${f.content}`)
      .join("\n")
    : "Hiện tại không có bài đăng cộng đồng nào.";

  const articleSummary = articleData.length > 0
    ? articleData
      .map((a) => `- Tiêu đề: "${a.title}" | Danh mục: ${a.category || 'Công nghệ'} | Tóm tắt: ${a.excerpt}`)
      .join("\n")
    : "Hiện tại không có bài viết nào.";

  const systemPrompt = `
Bạn là một trợ lý ảo tư vấn thân thiện, nhiệt tình và chuyên nghiệp của trang web TechInsight.
Nhiệm vụ của bạn là giúp đỡ người dùng tìm kiếm laptop, điện thoại phù hợp với nhu cầu của họ, đồng thời cung cấp thông tin về các bài viết công nghệ và thảo luận trong cộng đồng.

Dưới đây là danh sách các LAPTOP hiện đang có sẵn trên hệ thống:
${laptopSummary}

Dưới đây là danh sách các ĐIỆN THOẠI hiện đang có sẵn trên hệ thống:
${smartphoneSummary}

Dưới đây là danh sách các CỘNG ĐỒNG THẢO LUẬN (Forum) hiện có trên hệ thống:
${forumSummary}

Dưới đây là danh sách các BÀI VIẾT CHUYÊN SÂU (Articles) hiện có trên hệ thống:
${articleSummary}

Hướng dẫn:
1. Khi người dùng hỏi về sản phẩm (laptop hoặc điện thoại), hãy ưu tiên dựa vào danh sách sản phẩm trên hệ thống để tư vấn. Nếu họ có ngân sách và nhu cầu cụ thể, hãy chọn ra 1-2 sản phẩm phù hợp nhất.
2. Khi người dùng hỏi về các chủ đề công nghệ, sửa lỗi, kiến thức, hãy kiểm tra danh sách bài viết chuyên sâu. Nếu có người dùng thảo luận về chủ đề tương tự trên diễn đàn, có thể tóm tắt và đề xuất.
3. Luôn trả lời bằng tiếng Việt một cách tự nhiên, lễ phép và thân thiện.
4. Trình bày rõ ràng, sử dụng markdown (như in đậm, gạch đầu dòng) để dễ đọc.
5. Nếu người dùng hỏi những thứ hoàn toàn không liên quan đến công nghệ, hãy lịch sự từ chối và hướng họ quay lại chủ đề chính.
  `;

  const coreMessages = messages.map((m: any) => {
    let text = "";
    if (m.parts) {
      text = m.parts.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('');
    } else {
      text = m.text || m.content || "";
    }
    return {
      role: m.role,
      content: text
    };
  });

  const result = streamText({
    model: google("gemini-3.5-flash", {
      structuredOutputs: false,
    }),
    system: systemPrompt,
    messages: coreMessages,
  });

  return result.toUIMessageStreamResponse();
}
