/* eslint-disable @typescript-eslint/no-explicit-any */

import {clsx, type ClassValue} from "clsx"
import {twMerge} from "tailwind-merge"
import {toast} from "sonner";
import {FieldPath, FieldValues, UseFormSetError} from "react-hook-form";
import {EntityError} from "@/lib/http";
import envConfig, {defaultLocale} from "@/config";
import {DishStatus, OrderStatus, Role, TableStatus} from "@/constants/type";
import jwt from "jsonwebtoken";
import {TokenPayload} from "@/types/jwt.types";
import authApiRequest from "@/apiRequests/auth";
import guestApiRequest from "@/apiRequests/guest";
import {io} from "socket.io-client";
import slugify from "slugify";
import {format} from "date-fns";
import {BookX, CookingPot, HandCoins, Loader, Truck} from "lucide-react";

type ErrorWithPayload = {
    payload: {
        message: string;
    };
};

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Xóa đi ký tự `/` đầu tiên của path
 */
export const normalizePath = (path: string) => {
    return path.startsWith('/') ? path.slice(1) : path
}

export const handleErrorApi = <T extends FieldValues>({
                                                          error,
                                                          setError,
                                                          duration
                                                      }: {
    error: unknown
    setError?: UseFormSetError<T>
    duration?: number
}) => {
    if (error instanceof EntityError && setError) {
        error.payload.errors.forEach((item) => {
            setError((item.field as unknown as FieldPath<T>), {
                type: 'server',
                message: item.message
            })
        })
    } else {
        toast.error('Lỗi', {
            description: (error as ErrorWithPayload)?.payload?.message ?? 'Lỗi không xác định',
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

export const generateSocketInstace = (
    accessToken: string
): any => {
    return io(envConfig.NEXT_PUBLIC_API_ENDPOINT, {
        auth: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
};

export const decodeToken = (token: string) => {
    return jwt.decode(token) as TokenPayload
}

export const checkAndRefreshToken = async (param?: {
    onError?: () => void
    onSuccess?: () => void
    force?: boolean
}) => {
    // Không nên đưa logic lấy access và refresh token ra khỏi cái function `checkAndRefreshToken`
    // Vì để mỗi lần mà checkAndRefreshToken() được gọi thì chúng ta se có một access và refresh token mới
    // Tránh hiện tượng bug nó lấy access và refresh token cũ ở lần đầu rồi gọi cho các lần tiếp theo
    const accessToken = getAccessTokenFromLocalStorage()
    const refreshToken = getRefreshTokenFromLocalStorage()
    // Chưa đăng nhập thì cũng không cho chạy
    if (!accessToken || !refreshToken) return
    const decodedAccessToken = decodeToken(accessToken)
    const decodedRefreshToken = decodeToken(refreshToken)
    // Thời điểm hết hạn của token là tính theo epoch time (s)
    // Còn khi các bạn dùng cú pháp new Date().getTime() thì nó sẽ trả về epoch time (ms)
    const now = Math.round(new Date().getTime() / 1000)
    // trường hợp refresh token hết hạn thì cho logout
    if (decodedRefreshToken.exp <= now) {
        removeTokensFromLocalStorage()
        return param?.onError && param.onError()
    }
    // Ví dụ access token của chúng ta có thời gian hết hạn là 10s
    // thì mình sẽ kiểm tra còn 1/3 thời gian (3s) thì mình sẽ cho refresh token lại
    // Thời gian còn lại sẽ tính dựa trên công thức: decodedAccessToken.exp - now
    // Thời gian hết hạn của access token dựa trên công thức: decodedAccessToken.exp - decodedAccessToken.iat
    if (
        param?.force ||
        decodedAccessToken.exp - now <
        (decodedAccessToken.exp - decodedAccessToken.iat) / 3
    ) {
        // Gọi API refresh token
        try {
            const role = decodedRefreshToken.role
            const res =
                role === Role.Guest
                    ? await guestApiRequest.refreshToken()
                    : await authApiRequest.refreshToken()
            setAccessTokenToLocalStorage(res.payload.data.accessToken)
            setRefreshTokenToLocalStorage(res.payload.data.refreshToken)
            param?.onSuccess && param.onSuccess()
        } catch (error) {
            param?.onError && param.onError()
        }
    }
}

export const getVietnameseOrderStatus = (
    status: (typeof OrderStatus)[keyof typeof OrderStatus]
) => {
    switch (status) {
        case OrderStatus.Delivered:
            return 'Đã phục vụ'
        case OrderStatus.Paid:
            return 'Đã thanh toán'
        case OrderStatus.Pending:
            return 'Chờ xử lý'
        case OrderStatus.Processing:
            return 'Đang nấu'
        default:
            return 'Từ chối'
    }
}

export function removeAccents(str: string) {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
}

export const simpleMatchText = (fullText: string, matchText: string) => {
    return removeAccents(fullText.toLowerCase()).includes(
        removeAccents(matchText.trim().toLowerCase())
    )
}

export const formatDateTimeToLocaleString = (date: string | Date) => {
    return format(
        date instanceof Date ? date : new Date(date),
        'HH:mm:ss dd/MM/yyyy'
    )
}

export const formatDateTimeToTimeString = (date: string | Date) => {
    return format(date instanceof Date ? date : new Date(date), 'HH:mm:ss')
}

export const OrderStatusIcon = {
    [OrderStatus.Pending]: Loader,
    [OrderStatus.Processing]: CookingPot,
    [OrderStatus.Rejected]: BookX,
    [OrderStatus.Delivered]: Truck,
    [OrderStatus.Paid]: HandCoins
}

export const getVietnameseTableStatus = (
    status: (typeof TableStatus)[keyof typeof TableStatus]
) => {
    switch (status) {
        case TableStatus.Available:
            return 'Có sẵn'
        case TableStatus.Reserved:
            return 'Đã đặt'
        default:
            return 'Ẩn'
    }
}