import { ModuleDetailClient, type Module, type FlashcardData, type InterviewQuestion } from "./ModuleDetailClient"
import { data } from "@/data"
import { loadMarkdownFile, generateFallbackContent } from "@/lib/markdown"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import React from "react"

// Custom components for markdown rendering
const mdxComponents = {
  h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-white" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-800 dark:text-gray-100" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-800 dark:text-gray-100" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className="text-lg font-medium mt-3 mb-2 text-gray-800 dark:text-gray-100" {...props}>
      {children}
    </h4>
  ),
  p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="my-3 leading-7 text-gray-700 dark:text-gray-300" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="my-3 ml-6 list-disc space-y-1 text-gray-700 dark:text-gray-300" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="my-3 ml-6 list-decimal space-y-1 text-gray-700 dark:text-gray-300" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="mt-1" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 dark:bg-blue-900/20 italic text-gray-700 dark:text-gray-300" {...props}>
      {children}
    </blockquote>
  ),
  code: ({ inline, className, children, ...props }: { inline?: boolean; className?: string; children?: React.ReactNode } & React.HTMLAttributes<HTMLElement>) => {
    // Check if it's inline code (no className) or block code (has className)
    if (inline) {
      return (
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono text-red-600 dark:text-red-400" {...props}>
          {children}
        </code>
      )
    }
    return (
      <code className={`block p-4 rounded-lg bg-gray-900 text-gray-100 overflow-x-auto text-sm font-mono ${className || ''}`} {...props}>
        {children}
      </code>
    )
  },
  pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className="my-4 overflow-x-auto rounded-lg bg-gray-900" {...props}>
      {children}
    </pre>
  ),
  strong: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold text-gray-900 dark:text-white" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <em className="italic" {...props}>
      {children}
    </em>
  ),
  a: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className="text-blue-600 dark:text-blue-400 hover:underline"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </a>
  ),
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className="my-6 border-gray-200 dark:border-gray-700" {...props} />
  ),
  table: ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-4 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className="bg-gray-50 dark:bg-gray-800" {...props}>
      {children}
    </thead>
  ),
  tbody: ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700" {...props}>
      {children}
    </tbody>
  ),
  th: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 dark:text-white" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300" {...props}>
      {children}
    </td>
  ),
}

export function generateStaticParams() {
  return data.modules.modules.map((module: { id: string }) => ({
    moduleId: module.id,
  }))
}

async function getModuleContent(module: { contentFile?: string; title: string; description: string; category: string }) {
  if (!module.contentFile) {
    return generateFallbackContent(module.title, module.description, module.category)
  }

  const content = await loadMarkdownFile(module.contentFile)

  if (!content) {
    return generateFallbackContent(module.title, module.description, module.category)
  }

  return content
}

function getRelatedFlashcards(flashcardIds: string[] | undefined): FlashcardData[] {
  if (!flashcardIds || !Array.isArray(flashcardIds)) return []

  const results = flashcardIds
    .map((id) => (data.flashcards as any[])?.find((fc: any) => fc.id === id))
    .filter(Boolean) as FlashcardData[]

  return results
}

function getRelatedQuestions(questionIds: string[] | undefined): InterviewQuestion[] {
  if (!questionIds || !Array.isArray(questionIds)) return []

  const results = questionIds
    .map((id) => data.interview?.questions?.find((q: any) => q.id === id))
    .filter(Boolean) as InterviewQuestion[]

  return results
}

export default async function ModuleDetailPage({
  params,
}: {
  params: Promise<{ moduleId: string }>
}) {
  const { moduleId } = await params
  const module = data.modules.modules.find((m: { id: string }) => m.id === moduleId) as Module

  if (!module) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold">模块未找到</h1>
      </div>
    )
  }

  // Load markdown content on the server
  const markdownData = await getModuleContent(module)

  // Render markdown on the server
  const renderedContent = (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={mdxComponents as any}
    >
      {markdownData.content}
    </ReactMarkdown>
  )

  // Get related flashcards and questions
  const relatedFlashcards = getRelatedFlashcards(module.flashcards)
  const relatedQuestions = getRelatedQuestions(module.interviewQuestions)

  return (
    <ModuleDetailClient
      module={module}
      markdownContent={renderedContent}
      relatedFlashcards={relatedFlashcards}
      relatedQuestions={relatedQuestions}
    />
  )
}
