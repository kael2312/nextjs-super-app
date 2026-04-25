import GuestLoginForm from '@/app/(public)/tables/[number]/guest-login-form'
import envConfig, { Locale } from '@/config'


type Props = {
  params: Promise<{ number: string; locale: Locale }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default function TableNumberPage() {
  return <GuestLoginForm />
}
