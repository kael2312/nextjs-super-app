'use client'

import {useEffect} from 'react';
import {usePathname, useRouter} from "next/navigation";
import {
    checkAndRefreshToken,
} from "@/lib/utils";

// No need check refresh token
const UNAUTHENTICATED_PATH = ['/login', '/logout', '/refresh-token'];

const RefreshToken = () => {
    const pathName = usePathname()
    const router = useRouter();

    useEffect(() => {
        if(UNAUTHENTICATED_PATH.includes(pathName)) return;
        let interval: string | number | NodeJS.Timeout | undefined = undefined;

        checkAndRefreshToken({
            onError: () => {
                clearInterval(interval)
                router.push('/login');
            }
        });
        interval = setInterval(() => checkAndRefreshToken({
            onError: () => {
                clearInterval(interval)
                router.push('/login');
            }
        }), 1000);

        return () => {
            clearInterval(interval)
        }
    }, [pathName, router]);
    return null;
};

export default RefreshToken;