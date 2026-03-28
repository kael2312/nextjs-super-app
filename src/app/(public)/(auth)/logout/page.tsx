'use client'

import React, {useEffect, useRef} from 'react';
import {useLogoutMutation} from "@/queries/useAuth";
import {UseMutateAsyncFunction} from "@tanstack/react-query";
import {useRouter, useSearchParams} from "next/navigation";
import {getRefreshTokenFromLocalStorage} from "@/lib/utils";

const LogoutPage = () => {
    const {mutateAsync} = useLogoutMutation();
    const router = useRouter();
    const searchParams = useSearchParams();
    const refreshTokenFromUrl = searchParams.get("refreshToken");
    const trackingRef = useRef<UseMutateAsyncFunction | null>(null)

    useEffect(() => {
        if(trackingRef.current || refreshTokenFromUrl !== getRefreshTokenFromLocalStorage()) return;
        trackingRef.current = mutateAsync
        mutateAsync().then(() => {
            setTimeout(() => {
                trackingRef.current = null
            }, 1000)
            router.push("/login")
        })
    }, [mutateAsync, router, refreshTokenFromUrl])

    return (
        <div>
            
        </div>
    );
};

export default LogoutPage;