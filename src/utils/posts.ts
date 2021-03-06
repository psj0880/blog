import fs from 'fs'
import { sync } from 'glob'
import frontMatter from 'front-matter'
import moment from 'moment'
import { Post, FrontMatter, Tag } from '../interfaces'

export function getAllPosts(): Post[] {
  const paths = sync(`${process.cwd()}/posts/**/*.md`)

  const posts = paths.reduce((result: Post[], path) => {
    const md = fs.readFileSync(path, { encoding: 'utf-8' })
    const { attributes, body } = frontMatter<FrontMatter>(md)

    if (attributes.published)
      result.push({
        frontMatter: {
          ...attributes,
          date: moment(attributes.date).format('yyy-MM-DD'),
        },
        body: body,
      })

    return result
  }, [])

  posts.sort((p1, p2) => {
    if (p1.frontMatter.date < p2.frontMatter.date) return 1
    return -1
  })

  return posts
}

export function getAllTags(): Tag[] {
  const posts = getAllPosts()
  const tagCountMap = new Map<string, number>()

  posts.map((post) => {
    post.frontMatter.tags.map((tag) => {
      const tagCount = tagCountMap.get(tag)
      tagCount ? tagCountMap.set(tag, tagCount + 1) : tagCountMap.set(tag, 1)
    })
  })

  const tags: Tag[] = []
  tagCountMap.forEach((value, key) => {
    tags.push({
      name: key,
      count: value,
    })
  })

  return tags
}
