import { DocumentQuery } from "@/components/document/DocumentQuery";
import { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Document Q&A",
  description: "Ask questions and receive answers from your documents",
};

function Loading() {
  return (
    <div className="space-y-4 w-full">
      <Skeleton className="h-[200px] w-full" />
      <Skeleton className="h-[300px] w-full" />
    </div>
  );
}

interface DocumentQueryPageProps {
  params: {
    botId: string
  }
}

export default function DocumentQueryPage({ params }: any) {
  const botId = parseInt(params.botId)

  return (
    <div className="flex flex-col space-y-4 p-4 md:p-8 max-w-4xl mx-auto">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold">Document Q&A</h1>
        <p className="text-muted-foreground">
          Ask questions about uploaded documents and receive intelligent answers
          intelligent
        </p>
      </div>

      <div className="border-t pt-4">
        <Suspense fallback={<Loading />}>
          <DocumentQuery botId={botId} />
        </Suspense>
      </div>
    </div>
  )
}