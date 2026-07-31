import { redirect } from "next/navigation";

/** Default admin entry → Overview. */
export default function AdminIndexPage() {
  redirect("/admin/overview");
}
