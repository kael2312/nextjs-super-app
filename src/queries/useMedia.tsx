import {useMutation} from "@tanstack/react-query";
import {mediaApiRequest} from "@/apiRequests/media";

export const useUploadImage = () => {
    return useMutation({
        mutationFn: mediaApiRequest.upload,
    })
}