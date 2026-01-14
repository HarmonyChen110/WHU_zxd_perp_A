import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { PathDetailClient } from "./PathDetailClient"
import { data } from "@/data"

export function generateStaticParams() {
  return data.paths.paths.map((path: { id: string }) => ({
    pathId: path.id,
  }))
}

export default function PathDetailPage({ params }: { params: { pathId: string } }) {
  const pathId = params.pathId
  const path = data.paths.paths.find((p: { id: string }) => p.id === pathId)

  if (!path) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold">路径未找到</h1>
        <Link href="/learn">
          <Button>返回学习路径</Button>
        </Link>
      </div>
    )
  }

  return <PathDetailClient path={path} />
}
