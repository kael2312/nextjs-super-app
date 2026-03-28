'use client'

import React, {useEffect} from 'react';
import {usePathname} from "next/navigation";
import {
    getAccessTokenFromLocalStorage,
    getRefreshTokenFromLocalStorage,
    setAccessTokenToLocalStorage, setRefreshTokenToLocalStorage
} from "@/lib/utils";
import jwt from "jsonwebtoken";
import authApiRequest from "@/apiRequests/auth";

// No need check refresh token
const UNAUTHENTICATED_PATH = ['/login', '/logout', '/refresh-token'];

const RefreshToken = () => {
    const pathName = usePathname()


    useEffect(() => {
        if(UNAUTHENTICATED_PATH.includes(pathName)) return;
        let interval = null;
        const checkAndRefreshToken = async () => {
            const accessToken = getAccessTokenFromLocalStorage();
            const refreshToken = getRefreshTokenFromLocalStorage();
            if(!accessToken || !refreshToken) return;

            const decodedAccessToken = jwt.decode(accessToken) as {
                exp: number; // thơì gian hết hạn
                iat: number; // thời gian khởi tạo
            }

            const decodedRefreshToken = jwt.decode(refreshToken) as {
                exp: number; // thơì gian hết hạn
                iat: number; // thời gian khởi tạo
            }

            const now = Math.round(new Date().getTime() / 1000)
            // refresh token hết hạn thì khoong xử lý nữa

            if(decodedRefreshToken.exp <= now) return;

            // Kiểm tra nếu access-token còn 1/3 thời gian thì mình sẽ gọi refresh-token
            // Thời gian còn lại: exp - now
            // Sau bao nhiêu lâu thì hết hạn: exp - iat
            // Ví dụ sau 10s thì accessToken hết hạn => thì kiểm tra nếu thời gian còn lại < 3s thì gọi refresh-token
            if(decodedAccessToken.exp - now < (decodedAccessToken.exp - decodedAccessToken.iat) / 3) {
                try {
                    const res = await authApiRequest.refreshToken()
                    setAccessTokenToLocalStorage(res.payload.data.accessToken)
                    setRefreshTokenToLocalStorage(res.payload.data.refreshToken)
                } catch {
                    clearInterval(interval)
                }
            }
        }

        checkAndRefreshToken();
        interval = setInterval(checkAndRefreshToken, 1000);

        return () => {
            clearInterval(interval)
        }
    }, [pathName]);
    return null;
};

export default RefreshToken;