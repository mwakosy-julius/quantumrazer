import { auth } from "@/lib/auth";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  const session = await auth();

  return (
    <div style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
      <h1 className="mb-6 text-[24px] font-bold text-[#111111]">Settings</h1>
      <SettingsForm />
      <section className="mt-8 rounded-lg border border-[#E5E7EB] bg-white p-6">
        <h2 className="text-[16px] font-semibold text-[#111111]">Profile</h2>
        <p className="mt-2 text-[14px] text-[#6B7280]">
          Signed in as {session?.user?.email}. Password changes use the public account flow.
        </p>
      </section>
    </div>
  );
}
