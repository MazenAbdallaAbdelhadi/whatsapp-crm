"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to users page by default
        router.replace("/admin/users");
    }, [router]);

    return null;
}
