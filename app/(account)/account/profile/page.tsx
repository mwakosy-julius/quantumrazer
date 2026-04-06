import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/account/profile");

  return (
    <div>
      <h1 className="text-2xl font-black">Profile</h1>
      <p className="mt-4 text-[14px] text-grey-700">
        Signed in as <span className="font-medium text-black">{session.user.email}</span>
      </p>
      {session.user.firstName && (
        <p className="mt-2 text-[14px] text-grey-700">
          Name: {session.user.firstName}
        </p>
      )}
    </div>
  );
}
