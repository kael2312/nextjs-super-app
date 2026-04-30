import {clsx, type ClassValue} from "clsx"
import {twMerge} from "tailwind-merge"
import {toast} from "sonner";
import {FieldPath, FieldValues, UseFormSetError} from "react-hook-form";
import {EntityError} from "@/lib/http";
import envConfig, {defaultLocale} from "@/config";
import {DishStatus} from "@/constants/type";
import jwt from "jsonwebtoken";
import {TokenPayload} from "@/types/jwt.types";
import authApiRequest from "@/apiRequests/auth";

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

// export const generateSlugUrl = ({ name, id }: { name: string; id: number }) => {
//     return `${slugify(name)}-i.${id}`
// }
//
// export const generateSocketInstace = (accessToken: string) => {
//     return io(envConfig.NEXT_PUBLIC_API_ENDPOINT, {
//         auth: {
//             Authorization: `Bearer ${accessToken}`
//         }
//     })
// }

export const decodeToken = (token: string) => {
    return jwt.decode(token) as TokenPayload
}

export const checkAndRefreshToken = async (param?: {
    onError?: () => void,
    onSuccess?: () => void,
}) => {
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

    const now = new Date().getTime() / 1000 - 1
    // refresh token hết hạn thì khoong xử lý nữa

    if(decodedRefreshToken.exp <= now) {
        removeTokensFromLocalStorage()
        param?.onError && param.onError();
        return;
    };

    // Kiểm tra nếu access-token còn 1/3 thời gian thì mình sẽ gọi refresh-token
    // Thời gian còn lại: exp - now
    // Sau bao nhiêu lâu thì hết hạn: exp - iat
    // Ví dụ sau 10s thì accessToken hết hạn => thì kiểm tra nếu thời gian còn lại < 3s thì gọi refresh-token
    if(decodedAccessToken.exp - now < (decodedAccessToken.exp - decodedAccessToken.iat) / 3) {
        try {
            const res = await authApiRequest.refreshToken()
            setAccessTokenToLocalStorage(res.payload.data.accessToken)
            setRefreshTokenToLocalStorage(res.payload.data.refreshToken)
            param?.onSuccess && param.onSuccess();
        } catch {
            param?.onError && param.onError();
        }
    }
}