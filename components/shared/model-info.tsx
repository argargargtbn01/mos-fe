import { ModelInfo } from '@/types/bot'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'

interface ModelInfoProps {
  modelInfo?: ModelInfo
}

export function ModelInfoDisplay({ modelInfo }: ModelInfoProps) {
  if (!modelInfo) {
    return <div className="text-gray-500 italic">Không có thông tin model</div>
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Model: {modelInfo.model_name}</h3>
        <p className="text-sm text-gray-500">Provider: {modelInfo.litellm_params.custom_llm_provider}</p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="capabilities">
          <AccordionTrigger>Khả năng</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <Badge variant={modelInfo.model_info.supports_system_messages ? "default" : "outline"}>
                  System Messages
                </Badge>
                {modelInfo.model_info.supports_system_messages ? "✅" : "❌"}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={modelInfo.model_info.supports_vision ? "default" : "outline"}>
                  Vision
                </Badge>
                {modelInfo.model_info.supports_vision ? "✅" : "❌"}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={modelInfo.model_info.supports_function_calling ? "default" : "outline"}>
                  Function Calling
                </Badge>
                {modelInfo.model_info.supports_function_calling ? "✅" : "❌"}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={modelInfo.model_info.supports_response_schema ? "default" : "outline"}>
                  Response Schema
                </Badge>
                {modelInfo.model_info.supports_response_schema ? "✅" : "❌"}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="limits">
          <AccordionTrigger>Giới hạn</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Max Tokens:</span>
                <span>{modelInfo.model_info.max_tokens.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Max Input Tokens:</span>
                <span>{modelInfo.model_info.max_input_tokens.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Max Output Tokens:</span>
                <span>{modelInfo.model_info.max_output_tokens.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">TPM:</span>
                <span>{modelInfo.model_info.tpm.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">RPM:</span>
                <span>{modelInfo.model_info.rpm.toLocaleString()}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="params">
          <AccordionTrigger>Tham số OpenAI hỗ trợ</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2">
              {modelInfo.model_info.supported_openai_params.map((param) => (
                <Badge key={param} variant="secondary">
                  {param}
                </Badge>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}