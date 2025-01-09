import { prisma } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReportButton } from "./report-button";
import modApi from "@/lib/modApi";

async function reportProfile(profileId: string) {
  "use server";

  await modApi.queueActions.execute({
    actionKey: "report_profile",
    contentIds: [profileId],
    queueId: "677fc20db144ee2d6514d03a",
  });

  // This is the empty function that will be filled out later
  console.log("Profile reported:", profileId);
}

interface ProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;

  const profile = await prisma.profile.findUnique({
    where: {
      id: id,
    },
  });

  if (!profile) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <Link
        href="/"
        className="text-blue-500 hover:underline mb-8 inline-block"
      >
        ← Back to Profiles
      </Link>

      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="relative w-48 h-48 mx-auto mb-6">
          <Image
            src={profile.imageUrl}
            alt={`${profile.username}'s profile picture`}
            fill
            className="rounded-full object-cover"
          />
        </div>

        <h1 className="text-3xl font-bold text-center mb-4">
          {profile.username}
        </h1>

        <p className="text-gray-600 text-center whitespace-pre-wrap">
          {profile.bio}
        </p>

        <div className="text-sm text-gray-500 text-center mt-4 mb-6">
          Member since {profile.createdAt.toLocaleDateString()}
        </div>

        <div className="flex justify-center">
          <ReportButton profileId={profile.id} reportAction={reportProfile} />
        </div>
      </div>
    </main>
  );
}
