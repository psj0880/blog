import axios from 'axios'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { FrontMatter } from 'src/interfaces'

interface Response {
  frontMatters: FrontMatter[]
  total: number
}

function PostRow({ frontMatter }: { frontMatter: FrontMatter }) {
  return (
    <li className="py-4">
      <Link href={`/posts/${frontMatter.topic}/${frontMatter.id}`}>
        <a className="group">
          <div className="text-2xl font-bold group-hover:underline">
            {frontMatter.title}
          </div>
          <div>{frontMatter.summary}</div>
          <div>{frontMatter.date}</div>
        </a>
      </Link>
      {frontMatter.tags.map((tag) => {
        return (
          <Link href={`/tags/${tag}`} key={`${frontMatter.id}-${tag}`}>
            <a>{tag}</a>
          </Link>
        )
      })}
    </li>
  )
}

export default function PostList({ tag }: { tag?: string }) {
  const [res, setRes] = useState<Response>({
    frontMatters: [],
    total: 0,
  })
  const [curPage, setCurPage] = useState(1)
  const perPage = 5
  const totalPage = res.total / perPage

  useEffect(() => {
    axios
      .get('/api/posts', {
        params: {
          page: 1,
          tag: tag,
        },
      })
      .then((res) => {
        setRes(res.data)
      })
  }, [tag])

  return (
    <ul className="p-6 divide-y divide-slate-200">
      {res.frontMatters.map((frontMatter) => {
        return <PostRow frontMatter={frontMatter} key={frontMatter.id} />
      })}
    </ul>
  )
}
