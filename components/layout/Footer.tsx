import Link from "next/link";

const cols = [
  {
    title: "Find a Store",
    links: ["Become a Member", "Send Us Feedback"],
  },
  { title: "Help", links: ["Order Status", "Shipping", "Returns", "Contact"] },
  { title: "About", links: ["News", "Careers", "Investors", "Purpose"] },
  { title: "Promotions", links: ["Students", "Military", "Teacher"] },
];

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto grid max-w-content grid-cols-2 gap-10 px-[var(--content-padding)] py-16 md:grid-cols-4">
        {cols.map((c) => (
          <div key={c.title}>
            <p className="mb-4 text-[14px] font-semibold">{c.title}</p>
            <ul className="space-y-2">
              {c.links.map((l) => (
                <li key={l}>
                  <Link href="#" className="text-[13px] text-[#a0a0a0] transition-colors duration-fast hover:text-white">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-[#333] px-[var(--content-padding)] py-6">
        <div className="mx-auto flex max-w-content flex-col items-center justify-between gap-4 text-[12px] text-[#a0a0a0] md:flex-row">
          <span>© {new Date().getFullYear()} Quantum, Inc.</span>
          <span>India ▾</span>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-white">
              X
            </Link>
            <Link href="#" className="hover:text-white">
              IG
            </Link>
            <Link href="#" className="hover:text-white">
              YT
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="#" className="hover:text-white">
              Privacy
            </Link>
            <Link href="#" className="hover:text-white">
              Terms
            </Link>
            <Link href="#" className="hover:text-white">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
