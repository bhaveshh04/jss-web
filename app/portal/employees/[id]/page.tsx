import EmployeeDetailClient from "@/components/portal/EmployeeDetailClient";

export default async function EmployeeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EmployeeDetailClient userId={id} />;
}
