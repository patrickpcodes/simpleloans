"use client";
import Image from "next/image";

export default function Info() {
  return (
    <div>
      <div>
        <h2 className="text-2xl">Customer Page</h2>
        <h6>Click on Customer Button</h6>
        <Image
          className="m-0 rounded-xl"
          src="/images/customer-icon.png"
          width={300}
          height={300}
          sizes="300px"
          alt="Page Not Found"
          priority={true}
          title="Page Not Found"
        />
      </div>
    </div>
  );
}
