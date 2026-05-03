'use client'

import React, {useEffect, useRef} from 'react';
import {useLogoutMutation} from "@/queries/useAuth";
import {useRouter, useSearchParams} from "next/navigation";
import {getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage} from "@/lib/utils";
import {useAppStore} from "@/components/app-provider";

const LogoutPage = () => {
    const { mutateAsync } = useLogoutMutation()
    const router = useRouter()
    const setRole = useAppStore((state) => state.setRole)
    const searchParams = useSearchParams()
    const refreshTokenFromUrl = searchParams.get('refreshToken')
    const accessTokenFromUrl = searchParams.get('accessToken')
    const ref = useRef<unknown>(null)
    useEffect(() => {
        if (
            !ref.current &&
            ((refreshTokenFromUrl &&
                    refreshTokenFromUrl === getRefreshTokenFromLocalStorage()) ||
                (accessTokenFromUrl &&
                    accessTokenFromUrl === getAccessTokenFromLocalStorage()))
        ) {
            ref.current = mutateAsync
            mutateAsync().then((res) => {
                setTimeout(() => {
                    ref.current = null
                }, 1000)
                setRole(undefined)
                router.push('/login')
            })
        } else {
            router.push('/')
        }
    }, [mutateAsync, router, refreshTokenFromUrl, accessTokenFromUrl, setRole])
    return <div>Log out....</div>
};

export default LogoutPage;