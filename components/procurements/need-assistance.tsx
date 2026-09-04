export function NeedAssistanceCard() {
  return (
    <div className="rounded-2xl bg-[#f3ffc7] p-5">
      <div className="inline-flex size-10 items-center justify-center rounded-full bg-white text-aurora-ink">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M5 12v-1a7 7 0 0 1 14 0v1M5 12h1.5a1.5 1.5 0 0 1 1.5 1.5V16a1.5 1.5 0 0 1-1.5 1.5H5.5A1.5 1.5 0 0 1 4 16v-2.5A1.5 1.5 0 0 1 5.5 12H5Zm14 0h-1.5a1.5 1.5 0 0 0-1.5 1.5V16a1.5 1.5 0 0 0 1.5 1.5H18.5A1.5 1.5 0 0 0 20 16v-2.5A1.5 1.5 0 0 0 18.5 12H19Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M8.5 17.5c.8 1.6 2 2.5 3.5 2.5s2.7-.9 3.5-2.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <h2 className="mt-3 text-base font-bold text-aurora-ink">
        Need Assistance?
      </h2>
      <p className="mt-1.5 text-sm leading-relaxed text-[#5c5c5c]">
        Our procurement team is ready to help with your bulk orders and custom
        requirements.
      </p>

      <button
        type="button"
        className="mt-4 inline-flex h-11 w-full items-center justify-center whitespace-nowrap rounded-lg bg-aurora-lime px-4 text-sm font-semibold text-aurora-ink transition-opacity hover:opacity-90"
      >
        Contact Procurement Team
      </button>
    </div>
  );
}
