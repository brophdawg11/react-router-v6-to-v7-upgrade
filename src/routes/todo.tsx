import { LoaderFunctionArgs, useLoaderData, useParams } from "react-router-dom";
import { sleep } from "../sleep";
import { getTodos } from "../todos";

export async function clientLoader({
  params,
}: LoaderFunctionArgs): Promise<string> {
  await sleep();
  let todos = getTodos();
  if (!params.id) {
    throw new Error("Expected params.id");
  }
  let todo = todos[params.id];
  if (!todo) {
    throw new Error(`Uh oh, I couldn't find a todo with id "${params.id}"`);
  }
  return todo;
}

export default function Todo() {
  let params = useParams();
  let todo = useLoaderData() as string;
  return (
    <>
      <h2>Nested Todo Route:</h2>
      <p>id: {params.id}</p>
      <p>todo: {todo}</p>
    </>
  );
}
