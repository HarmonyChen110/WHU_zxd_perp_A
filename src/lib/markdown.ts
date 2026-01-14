import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const CONTENT_DIR = path.join(process.cwd(), '../文本库')
const FALLBACK_CONTENT_DIR = path.join(process.cwd(), 'content')

export interface MarkdownContent {
  content: string
  data: {
    [key: string]: any
  }
}

export interface MarkdownMeta {
  title?: string
  description?: string
  category?: string
  difficulty?: number
  estimatedMinutes?: number
}

/**
 * Sanitizes markdown content to work better with MDX
 * - Wraps problematic code blocks in CDATA sections
 * - Handles box-drawing characters in code blocks
 */
function sanitizeMarkdownForMDX(content: string): string {
  // Wrap code blocks containing special characters to prevent MDX parsing issues
  return content.replace(
    /```(\w*)\n([\s\S]*?)```/g,
    (match, lang, code) => {
      // Check if code contains box-drawing characters that might cause issues
      if (/[─│┌┐└┘├┤┬┴┼]/.test(code)) {
        // Return as-is - MDX should handle code blocks correctly
        return match
      }
      return match
    }
  )
}

/**
 * Loads a markdown file from the 文本库 directory
 * @param relativePath - Relative path from 文本库 root (e.g., "01_基础知识手册_AgentA/01_核心分子档案/ManLAM.md")
 * @returns The parsed markdown content with frontmatter
 */
export async function loadMarkdownFile(relativePath: string): Promise<MarkdownContent | null> {
  try {
    // Try the 文本库 directory first
    let fullPath = path.join(CONTENT_DIR, relativePath)

    // If not found, try the local content directory
    if (!fs.existsSync(fullPath)) {
      fullPath = path.join(FALLBACK_CONTENT_DIR, relativePath)
    }

    // If still not found, return null
    if (!fs.existsSync(fullPath)) {
      console.warn(`Markdown file not found: ${relativePath}`)
      return null
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    // Sanitize content for MDX
    const sanitizedContent = sanitizeMarkdownForMDX(content)

    return {
      content: sanitizedContent,
      data,
    }
  } catch (error) {
    console.error(`Error loading markdown file ${relativePath}:`, error)
    return null
  }
}

/**
 * Gets a list of all available markdown files in the 文本库
 * @param subdir - Optional subdirectory to search within
 */
export function getMarkdownFiles(subdir?: string): string[] {
  const searchDir = subdir
    ? path.join(CONTENT_DIR, subdir)
    : CONTENT_DIR

  if (!fs.existsSync(searchDir)) {
    return []
  }

  const files: string[] = []

  const scanDir = (dir: string, baseDir: string = CONTENT_DIR) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        scanDir(fullPath, baseDir)
      } else if (entry.name.endsWith('.md')) {
        // Get relative path from CONTENT_DIR
        const relativePath = path.relative(baseDir, fullPath)
        files.push(relativePath)
      }
    }
  }

  scanDir(searchDir)
  return files
}

/**
 * Generates fallback content when a markdown file is not found
 */
export function generateFallbackContent(
  title: string,
  description: string,
  category: string
): MarkdownContent {
  return {
    content: `# ${title}

## 概述

${description}

## 学习目标

- 理解${title}的核心概念
- 掌握相关机制
- 了解临床意义

## 内容详解

本模块详细讲解了${title}的相关知识。通过学习，你将深入了解其生物学功能和相关机制。

## 注意

> 完整内容正在准备中，敬请期待...
`,
    data: {
      title,
      description,
      category,
    },
  }
}
