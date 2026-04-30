'use client'

import React, {useEffect} from 'react';
import {useRouter, useSearchParams} from "next/navigation";
import {checkAndRefreshToken, getRefreshTokenFromLocalStorage} from "@/lib/utils";

const RefreshTokenPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const refreshTokenFromURL = searchParams.get("refreshToken");
    const redirect = searchParams.get("redirect");

    useEffect(() => {
        if(refreshTokenFromURL &&
            refreshTokenFromURL === getRefreshTokenFromLocalStorage()
        ){
            checkAndRefreshToken({
                onSuccess: () => {
                    router.push(redirect || '/');
                }
            });
        }
    }, [router, refreshTokenFromURL, redirect]);
    return (
        <div>
            Refresh Token
        </div>
    );
};

export default RefreshTokenPage;