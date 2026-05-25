import { redirect } from "next/navigation";

export default function BloodDonationCityPage({ params }: { params: { city: string } }) {
  const city = decodeURIComponent(params.city).replace(/-/g, " ");
  redirect(`/jana-seva/blood?city=${encodeURIComponent(city)}`);
}
