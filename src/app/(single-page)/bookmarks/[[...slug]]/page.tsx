import BookmarksIcon from '@/public/bookmarks.png'
import FiSearch from '@notion-x/src/icons/FiSearch'
import { OptionalCatchAllParams, OptionalCatchAllProps } from '@notion-x/src/interface'
import { getStartCursorForCurrentPage } from '@notion-x/src/lib/helpers'
import cn from 'classnames'
import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { Suspense } from 'react'

import Container from '../../../components/Container'
import Footer from '../../../components/Footer'
import HeaderPage from '../../../components/HeaderPage'
import { bodyPadding, containerWide } from '../../../lib/config'
import { getBookmarks } from '../../../lib/fetcher'
import { SkeletonBookmarkItemTemplate } from '../BookmarkItemTemplate'
import BookmarksPageTemplate from '../BookmarksPageTemplate'

const marksPerPage = 24

export const revalidate = 20

export async function generateMetadata({ params }: OptionalCatchAllProps): Promise<Metadata> {
  const currentPage = +(params?.slug?.[1] || 1)
  return {
    title: `My bookmarks - page ${currentPage} | Thi`,
    description: 'A collection of links to articles, videos, and other resources I find useful.'
  }
}

export async function generateStaticParams() {
  const params = [] as OptionalCatchAllParams[]
  const allMarks = await getBookmarks({})
  const numMarks = allMarks?.length || 0
  const totalPages = Math.ceil(numMarks / marksPerPage)
  for (let i = 1; i <= totalPages; i++) {
    const path = i === 1 ? { slug: [] } : { slug: ['page', i.toString()] }
    params.push(path)
  }
  return params
}

export default async function BookmarksPage({ params }: OptionalCatchAllProps) {
  const currentPage = +(params?.slug?.[1] || 1)

  if (
    !params ||
    (params.slug?.length > 0 && params.slug?.[0] !== 'page') ||
    params.slug?.length > 2
  ) {
    notFound()
  }

  console.log(`\n👉 uri: /bookmarks/page/${currentPage}/`)

  const notRootPage = !!params.slug

  const allMarks = await getBookmarks({})
  const numMarks = allMarks?.length || 0
  const totalPages = Math.ceil(numMarks / marksPerPage)

  if (notRootPage && currentPage === 1) {
    redirect(`/bookmarks/`)
  }

  if (currentPage !== 1 && currentPage > totalPages) {
    notFound()
  }

  const startCursor = getStartCursorForCurrentPage(currentPage, allMarks, marksPerPage)
  const marksOnThisPage = !allMarks.length
    ? []
    : await getBookmarks({ startCursor, pageSize: marksPerPage })

  return (
    <div className="thi-bg-stone flex flex-col">
      <HeaderPage
        childrenContainerClassName="w-full"
        headerType="gray"
        title="My bookmarks"
        subtitle={`A collection of links to articles, videos, and other resources I find useful.`}
        headerWidth="wide"
        icon={{ staticImageData: BookmarksIcon }}
        iconClassName="h-12 w-12"
      />
      <Container className={cn('basis-auto grow shrink-0', bodyPadding, containerWide)}>
        <Suspense fallback={<SkeletonBookmarkContainer />}>
          <BookmarksPageTemplate
            totalPages={totalPages}
            currentPage={currentPage}
            bookmarks={marksOnThisPage}
          ></BookmarksPageTemplate>
        </Suspense>
      </Container>
      <Footer footerType="gray" />
    </div>
  )
}

export function SkeletonSearchBar() {
  return (
    <div className={cn('flex items-center gap-3 p-4 bg-white rounded-xl')}>
      <div className={cn('grid place-items-center text-slate-500')}>
        <FiSearch className="text-2xl" />
      </div>
      <div className="text-slate-400">Search bookmarks...</div>
    </div>
  )
}

function SkeletonBookmarkContainer() {
  return (
    <div className="flex flex-col gap-8">
      <SkeletonSearchBar />
      <div className="flex flex-col gap-4">
        {Array.from({ length: marksPerPage }).map((_, i) => (
          <SkeletonBookmarkItemTemplate key={i} />
        ))}
      </div>
    </div>
  )
}
