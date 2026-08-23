import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { laptopService, smartphoneService } from "@/services/firebaseServices";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  console.log("RECEIVED MESSAGES:", JSON.stringify(messages, null, 2));

  // Fetch data from Firebase
  let laptopData = [];
  let smartphoneData = [];
  try {
    laptopData = await laptopService.getAll();
    smartphoneData = await smartphoneService.getAll();
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

  const systemPrompt = `
Bạn là một trợ lý ảo tư vấn thân thiện, nhiệt tình và chuyên nghiệp của trang web TechInsight.
Nhiệm vụ của bạn là giúp đỡ người dùng tìm kiếm laptop và điện thoại phù hợp với nhu cầu của họ.

Dưới đây là danh sách các LAPTOP hiện đang có sẵn trên hệ thống của chúng tôi:
${laptopSummary}

Dưới đây là danh sách các ĐIỆN THOẠI hiện đang có sẵn trên hệ thống của chúng tôi:
${smartphoneSummary}

Hướng dẫn:
1. Khi người dùng hỏi về sản phẩm (laptop hoặc điện thoại), hãy ưu tiên dựa vào danh sách sản phẩm trên hệ thống để tư vấn. Nếu họ có ngân sách và nhu cầu cụ thể, hãy chọn ra 1-2 sản phẩm phù hợp nhất.
2. Nếu người dùng hỏi các sản phẩm không có trong danh sách trên, hãy xin lỗi và báo rằng hiện cửa hàng chưa kinh doanh sản phẩm đó, đồng thời gợi ý các sản phẩm có sẵn tương tự.
3. Luôn trả lời bằng tiếng Việt một cách tự nhiên, lễ phép và thân thiện.
4. Trình bày rõ ràng, sử dụng markdown (như in đậm, gạch đầu dòng) để dễ đọc.
5. Nếu người dùng hỏi những thứ không liên quan đến công nghệ, hãy lịch sự từ chối và hướng họ quay lại chủ đề chính.
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
