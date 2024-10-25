import * as Route from "./+types.todo";
import { sleep } from "../sleep";
import { getTodos } from "../todos";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  await sleep();
  let todos = getTodos();
  let todo = todos[params.id];
  if (!todo) {
    throw new Error(`Uh oh, I couldn't find a todo with id "${params.id}"`);
  }
  return todo;
}

export default function Todo({
  loaderData: todo,
  params,
}: Route.ComponentProps) {
  return (
    <>
      <h2>Nested Todo Route:</h2>
      <p>id: {params.id}</p>
      <p>todo: {todo}</p>
    </>
  );
}
