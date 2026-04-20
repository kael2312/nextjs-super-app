import {clsx, type ClassValue} from "clsx"
import {twMerge} from "tailwind-merge"
import {toast} from "sonner";
import {UseFormSetError} from "react-hook-form";
import {EntityError} from "@/lib/http";
import envConfig, {defaultLocale} from "@/config";
import {DishStatus} from "@/constants/type";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Xóa đi ký tự `/` đầu tiên của path
 */
export const normalizePath = (path: string) => {
    return path.startsWith('/') ? path.slice(1) : path
}

export const handleErrorApi = ({
                                   error,
                                   setError,
                                   duration
                               }: {
    error: any
    setError?: UseFormSetError<any>
    duration?: number
}) => {
    if (error instanceof EntityError && setError) {
        error.payload.errors.forEach((item) => {
            setError(item.field, {
                type: 'server',
                message: item.message
            })
        })
    } else {
        toast.error('Lỗi', {
            description: error?.payload?.message ?? 'Lỗi không xác định',
            duration: duration ?? 5000
        })
    }
}

const isBrowser = typeof window !== 'undefined'

export const getAccessTokenFromLocalStorage = () => {
    return isBrowser ? window.localStorage.getItem('accessToken') : null
}

export const getRefreshTokenFromLocalStorage = () => {
    return isBrowser ? window.localStorage.getItem('refreshToken') : null
}

export const setAccessTokenToLocalStorage = (token: string) => {
    return isBrowser ? window.localStorage.setItem('accessToken', token) : null
}

export const setRefreshTokenToLocalStorage = (token: string) => {
    return isBrowser ? window.localStorage.setItem('refreshToken', token) : null
}

export const removeTokensFromLocalStorage = () => {
    isBrowser && localStorage.removeItem('accessToken')
    isBrowser && localStorage.removeItem('refreshToken')
}

export const getTableLink = ({
                                 token,
                                 tableNumber
                             }: {
    token: string
    tableNumber: number
}) => {
    return (
        envConfig.NEXT_PUBLIC_URL +
        `/${defaultLocale}/tables/` +
        tableNumber +
        '?token=' +
        token
    )
}

export const formatCurrency = (number: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(number)
}

export const getVietnameseDishStatus = (
    status: (typeof DishStatus)[keyof typeof DishStatus]
) => {
    switch (status) {
        case DishStatus.Available:
            return 'Có sẵn'
        case DishStatus.Unavailable:
            return 'Không có sẵn'
        default:
            return 'Ẩn'
    }
}

export const generateSlugUrl = ({ name, id }: { name: string; id: number }) => {
    return `${slugify(name)}-i.${id}`
}