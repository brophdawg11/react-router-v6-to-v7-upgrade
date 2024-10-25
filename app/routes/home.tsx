import { useLoaderData } from "react-router";
import { sleep } from "../sleep";

interface HomeLoaderData {
  date: string;
}

export async function clientLoader(): Promise<HomeLoaderData> {
  await sleep();
  return {
    date: new Date().toISOString(),
  };
}

export default function Home() {
  let data = useLoaderData() as HomeLoaderData;
  return (
    <>
      <h2>Home</h2>
      <p>Date from loader: {data.date}</p>
    </>
  );
}
