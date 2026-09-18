import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import { getSiteContentMany } from "@/lib/site-content-db";

// Every marketing page shares this layout, so we fetch the small, frequently
// reused sections (company info + nav categories) once here rather than in
// every page — this always reflects the latest edits from Portal → Website
// content since it's a fresh DB read per request.
export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const { company, products, solutions } = await getSiteContentMany(["company", "products", "solutions"]);

  return (
    <>
      <Navbar company={company} products={products.items} solutions={solutions.items} />
      <main className="flex-1">{children}</main>
      <Footer company={company} products={products.items} />
    </>
  );
}
