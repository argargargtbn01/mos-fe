import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import Link from "next/link";
import { DocumentList } from "@/components/document/DocumentList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Document Management",
  description: "Manage documents for your bot",
};

export default function DocumentsPage({
  params,
}: any) {
  const botId = parseInt(params.botId)

  return (
    <div className="flex flex-col space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Documents</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Link href={`/bots/${botId}/documents/query`}>
              <Search className="w-4 h-4 mr-2" />
              Document Q&A
            </Link>
          </Button>
          <Button>
            <Link href={`/bots/${botId}/documents/upload`}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Upload document
            </Link>
          </Button>
        </div>
      </div>
      <DocumentList botId={botId} />
    </div>
  )
}