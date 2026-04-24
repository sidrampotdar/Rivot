import connectDB from "@/lib/db";
import Image from "next/image";

export default async function Home() {
  await connectDB();

  return <div>Home</div>;
}
