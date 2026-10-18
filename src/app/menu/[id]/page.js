import DetailsPage from "@/components/template/DetailsPage";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const res = await fetch(`${process.env.BASE_URL}/data`);
  const data = await res.json();

  return data.slice(0, 10).map((food) => ({
    id: food.id.toString(),
  }));
}

async function Details({ params }) {
  const { id } = await params;

  const res = await fetch(`${process.env.BASE_URL}/data/${id}`, {
    next: { revalidate: Number(process.env.REVALIDATE) },
  });

  if (!res.ok) {
    notFound();
  }

  const data = await res.json();

  if (!data.id) {
    notFound();
  }

  return <DetailsPage {...data} />;
}

export default Details;
