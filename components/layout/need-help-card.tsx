import { Button } from "@/components/ui/button";

export function NeedHelpCard() {
  return (
    <div className="rounded-2xl bg-[#f3ffc7] px-4 py-4">
      <p className="text-sm font-semibold text-aurora-ink">Need Help?</p>
      <p className="mt-1 text-xs leading-relaxed text-[#5c5c5c]">
        Have questions or need assistance? Our support team is here for you.
      </p>
      <Button variant="soft" size="sm" className="mt-3 w-full">
        Contact Support
      </Button>
    </div>
  );
}
