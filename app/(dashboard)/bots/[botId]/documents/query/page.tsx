import { DocumentQuery } from "@/components/document/DocumentQuery";
import { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Hỏi đáp tài liệu",
  description: "Đặt câu hỏi và nhận câu trả lời từ tài liệu của bạn",
};

function Loading() {
  return (
    <div className="space-y-4 w-full">
      <Skeleton className="h-[200px] w-full" />
      <Skeleton className="h-[300px] w-full" />
    </div>
  );
}

export default function DocumentQueryPage({
  params,
}: {
  params: { botId: string };
}) {
  const botId = parseInt(params.botId);

  return (
    <div className="flex flex-col space-y-4 p-4 md:p-8 max-w-4xl mx-auto">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold">Hỏi đáp tài liệu</h1>
        <p className="text-muted-foreground">
          Đặt câu hỏi về nội dung trong tài liệu đã upload và nhận câu trả lời thông minh
        </p>
      </div>

      <div className="border-t pt-4">
        <Suspense fallback={<Loading />}>
          <DocumentQuery botId={botId} />
        </Suspense>
      </div>
    </div>
  );
}