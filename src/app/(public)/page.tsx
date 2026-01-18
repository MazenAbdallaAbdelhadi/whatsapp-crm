import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-svh flex flex-col items-center justify-center gap-8">
      <Link href={"/dashboard"}>DASHBOARD</Link>
      <ModeToggle />
    </div>
  );
}
