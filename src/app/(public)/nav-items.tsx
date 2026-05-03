'use client'

import Link from 'next/link'
import {cn, handleErrorApi} from "@/lib/utils";
import {Role} from "@/constants/type"
import { useAppStore} from "@/components/app-provider";
import {useLogoutMutation} from "@/queries/useAuth";
import {useRouter} from "next/navigation";

const menuItems = [
  {
    title: 'Trang chủ',
    href: '/' // không truyền authRequired tức là đăng nhập hay chưa đều hiển thị
  },
  {
    title: 'Menu',
    href: '/guest/menu',
    role: [Role.Guest]
  },
  {
    title: 'Đơn hàng',
    href: '/guest/orders',
    role: [Role.Guest]
  },
  {
    title: 'Đăng nhập',
    href: '/login',
    hideWhenLogin: true, // false tức là chưa đăng nhập sẽ hiển thị
  },
  {
    title: 'Quản lý',
    href: '/manage/dashboard',
    role: [Role.Owner, Role.Employee]
  }
]

export default function NavItems({ className }: { className?: string }) {
  const role = useAppStore((state) => state.role)
  const setRole = useAppStore((state) => state.setRole)
  const logoutMutation = useLogoutMutation()
  const router = useRouter()

  const logout = async () => {
    if(logoutMutation.isPending) return
    try {
      await logoutMutation.mutateAsync()
      setRole()
      router.push('/')
    } catch (e) {
      handleErrorApi({error: e})
    }
  }

  return (
      <>
        {menuItems.map((item) => {
          // Trường hợp đăng nhập thì chi hiển thị menu đăng nhập
          const isAuth = item.role && role && item.role.includes(role)

          // Trường hợp menu item co thể hiển thị dù cho đã đăng nhập hay chưa
          const canShow = (item.role === undefined && !item.hideWhenLogin) || (!role && item.hideWhenLogin)
          if(isAuth || canShow){
            return (
                <Link href={item.href} key={item.href} className={className}>
                  {item.title}
                </Link>
            )
          }
          return null
        })}
        {role && (
            <div className={cn(className, 'cursor-pointer')} onClick={logout}>
              Đăng xuất
            </div>
        )}
      </>
  )
}
