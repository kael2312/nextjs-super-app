import {cookies} from "next/headers";
import authApiRequest from "@/apiRequests/auth";

export async function POST(request: Request){
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value
    const refreshToken = cookieStore.get('refreshToken')?.value

    cookieStore.delete('accessToken')
    cookieStore.delete('refreshToken')

    if(!accessToken || !refreshToken){
        return Response.json({
            message: "Can not see access token or refresh token from the server",
        }, {
            status: 200
        })
    }

    try {
        const result = await authApiRequest.serverLogout({refreshToken}, accessToken)
        return Response.json(result.payload)
    } catch {
        return Response.json({
            message: "An error occurred while trying to logout",
        }, {
            status: 200
        })
    }
}