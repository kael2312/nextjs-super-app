'use client'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import RefreshToken from '@/components/refresh-token'
import {
    useEffect, useRef,
} from 'react'
import {
    decodeToken, generateSocketInstace,
    getAccessTokenFromLocalStorage,
    removeTokensFromLocalStorage
} from '@/lib/utils'
import {RoleType} from "@/types/jwt.types";
import { create } from 'zustand'
import {SocketType} from "@/constants/type";
import ListenLogoutSocket from "@/components/listen-logout-socket";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        }
    }
})



type AppStoreType = {
    isAuth: boolean
    role: RoleType | undefined
    setRole: (role?: RoleType | undefined) => void
    socket: SocketType | undefined
    setSocket: (socket?: SocketType | undefined) => void
    disconnectSocket: () => void
}

export const useAppStore = create<AppStoreType>((set) => ({
    isAuth: false,
    role: undefined as RoleType | undefined,
    setRole: (role?: RoleType | undefined) => {
        set({ role, isAuth: Boolean(role) })
        if (!role) {
            removeTokensFromLocalStorage()
        }
    },
    socket: undefined as SocketType | undefined,
    setSocket: (socket?: SocketType | undefined) => set({ socket }),
    disconnectSocket: () =>
        set((state) => {
            if (state.socket) {
                Object.values(state.socket).forEach((s) => s.disconnect())
            }
            return { socket: undefined }
        })
}))



export default function AppProvider({
                                        children
                                    }: {
    children: React.ReactNode
}) {
    const setRole = useAppStore((state) => state.setRole)
    const setSocket = useAppStore((state) => state.setSocket)
    const count = useRef(0)

    useEffect(() => {
        if (count.current === 0) {
            const accessToken = getAccessTokenFromLocalStorage()
            if (accessToken) {
                const role = decodeToken(accessToken).role
                setRole(role)
                setSocket(generateSocketInstace(accessToken))
            }
            count.current++
        }
    }, [setRole, setSocket])

    // Nếu mọi người dùng React 19 và Next.js 15 thì không cần AppContext.Provider, chỉ cần AppContext là đủ
    return (
            <QueryClientProvider client={queryClient}>
                {children}
                <RefreshToken />
                <ListenLogoutSocket />
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
    )
}