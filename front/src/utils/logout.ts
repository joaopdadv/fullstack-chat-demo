import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export const useLogout = () => {
    const router = useRouter();

    const logout = useCallback(() => {
        deleteCookie("pdi_chat_user");
        router.push('/login');
    }, [router]);

    return logout;
};