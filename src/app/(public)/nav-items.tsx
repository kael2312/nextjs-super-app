'use client'

import Link from 'next/link'
import {useEffect, useState} from "react";
import {getAccessTokenFromLocalStorage} from "@/lib/utils";

const menuItems = [
  {
    title: 'Món ăn',
    href: '/menu' // không truyền authRequired tức là đăng nhập hay chưa đều hiển thị
  },
  {
    title: 'Đơn hàng',
    href: '/orders',
    authRequired: true,
  },
  {
    title: 'Đăng nhập',
    href: '/login',
    authRequired: false, // false tức là chưa đăng nhập sẽ hiển thị
  },
  {
    title: 'Quản lý',
    href: '/manage/dashboard',
    authRequired: true // true nghĩa là đăng nhập rồi mới hiển thị
  }
]

export default function NavItems({ className }: { className?: string }) {
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    setIsAuth(Boolean(getAccessTokenFromLocalStorage()))
  }, []);

  return menuItems.map((item) => {
    if((item.authRequired === false && isAuth) || (item.authRequired === true && !isAuth)) {
      return null
    }
    return (
      <Link href={item.href} key={item.href} className={className}>
        {item.title}
      </Link>
    )
  })
}
