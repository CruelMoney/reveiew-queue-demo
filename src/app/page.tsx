import Link from "next/link";
import { prisma } from "@/lib/db";
import Image from "next/image";

// force dynamic
export const dynamic = "force-dynamic";

export default async function Home() {
  const profiles = await prisma.profile.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Profiles</h1>
        <Link
          href="/create-profile"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Profile
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((profile: any) => (
          <Link
            key={profile.id}
            href={`/profile/${profile.id}`}
            className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="p-4">
              <div className="relative w-full h-48 mb-4">
                <Image
                  src={profile.imageUrl}
                  alt={`${profile.username}'s profile picture`}
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
              <h2 className="text-xl font-semibold mb-2">{profile.username}</h2>
              <p className="text-gray-600 line-clamp-2">{profile.bio}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
