import { Bot, ModelInfo } from '@/types/bot'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ModelInfoDisplay } from './model-info'
import { useEffect, useState } from 'react'
import { modelService } from '@/src/api/model-api'

interface BotDetailsViewProps {
  bot: Bot
}

export function BotDetailsView({ bot }: BotDetailsViewProps) {
  const [modelInfo, setModelInfo] = useState<ModelInfo | undefined>(bot.modelInfo)

  useEffect(() => {
    // If the bot already has modelInfo from the API, use it
    // Otherwise, call the API to get model information
    if (!bot.modelInfo && bot.modelName) {
      const fetchModelInfo = async () => {
        try {
          const info = await modelService.getModelByName(bot.modelName!)
          setModelInfo(info)
        } catch (error) {
          console.error('Error while loading information model:', error)
        }
      }
      fetchModelInfo()
    }
  }, [bot])

  return (
    <Tabs defaultValue="info" className="w-full">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="info">General Information</TabsTrigger>
        <TabsTrigger value="prompt">Prompt</TabsTrigger>
        <TabsTrigger value="model">Model</TabsTrigger>
      </TabsList>
      <TabsContent value="info">
        <Card>
          <CardHeader>
            <CardTitle>Bot Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm text-gray-500">Bot Name</h4>
                <p>{bot.name}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-gray-500">Slug</h4>
                <p>{bot.slug}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-gray-500">Department</h4>
                <p>{bot.department?.name || 'No department'}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-gray-500">Created date</h4>
                <p>{new Date(bot.created_at).toLocaleDateString('vi-VN')}</p>
              </div>
            </div>

            {bot.description && (
              <div>
                <h4 className="font-medium text-sm text-gray-500">Description</h4>
                <p className="whitespace-pre-wrap">{bot.description}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="prompt">
        <Card>
          <CardHeader>
            <CardTitle>Prompt</CardTitle>
          </CardHeader>
          <CardContent>
            {bot.prompt ? (
              <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md border">
                {bot.prompt}
              </div>
            ) : (
              <p className="text-gray-500 italic">No prompt</p>
            )}
            
            {bot.condensePrompt && (
              <div className="mt-6">
                <h4 className="font-medium mb-2">Condense Prompt</h4>
                <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md border">
                  {bot.condensePrompt}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="model">
        <Card>
          <CardHeader>
            <CardTitle>Model Information</CardTitle>
          </CardHeader>
          <CardContent>
            <ModelInfoDisplay modelInfo={modelInfo} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}