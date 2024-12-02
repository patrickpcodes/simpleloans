"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

// export const metadata = {
//   title: "Home",
// };

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <h2>Home Page</h2>
      <div>
        <Button onClick={() => router.push("/customers")}>Customers</Button>
        <Button onClick={() => router.push("/loans")}>Loans</Button>
      </div>
    </div>
  );
}
