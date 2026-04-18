import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import TableTable from '@/app/manage/tables/table-table'
import { Suspense } from 'react'
import { Metadata } from 'next'
import envConfig, { Locale } from '@/config'
type Props = {
  params: Promise<{ locale: Locale }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  // const t = await getTranslations({
  //   locale: params.locale,
  //   namespace: 'Tables'
  // })

  const url = envConfig.NEXT_PUBLIC_URL + `/${params.locale}/manage/tables`

  return {
    title: 'title',
    description: 'description',
    alternates: {
      canonical: url
    },
    robots: {
      index: false
    }
  }
}

export default function TablesPage() {
  return (
    <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
      <div className='space-y-2'>
        <Card x-chunk='dashboard-06-chunk-0'>
          <CardHeader>
            <CardTitle>Bàn ăn</CardTitle>
            <CardDescription>Quản lý bàn ăn</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense>
              <TableTable />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
