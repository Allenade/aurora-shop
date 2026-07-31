import Image from "next/image";
import { SIGNIN_STATS } from "@/lib/auth";

/** Left brand panel for sign-in — circuit board + marketplace copy. */
export function SignInBrandPanel() {
  return (
    <aside className="relative hidden h-full w-full overflow-hidden lg:block">
      <Image
        src="/images/auth-signin-panel.png"
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="50vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-10 px-12 pb-14 xl:gap-12 xl:px-16 xl:pb-16">
        <div className="auth-rise max-w-2xl">
          <h2 className="text-[2rem] font-bold leading-[1.15] tracking-tight text-white xl:text-[2.25rem]">
            Nigeria&apos;s Premier Electrical Components Marketplace
          </h2>
          <p className="mt-5 text-xl leading-relaxed text-white xl:text-2xl">
            Access thousands of quality electrical components, track your
            orders, and manage procurement — all in one place.
          </p>
        </div>

        <dl className="auth-rise auth-rise-delay-2 grid grid-cols-3 gap-8">
          {SIGNIN_STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1.5">
              <dt className="text-[1.75rem] font-bold leading-none text-white xl:text-[2rem]">
                {stat.value}
              </dt>
              <dd className="text-sm leading-snug text-white/80 xl:text-base">
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </aside>
  );
}
