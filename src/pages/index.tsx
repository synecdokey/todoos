import type { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const { data: session } = useSession();
  const ctx = trpc.useContext();

  const { data: todos } = trpc.useQuery(["question.getTodos"]);
  const addTodo = trpc.useMutation("question.addTodo", {
    onSuccess: (todo) => {
      ctx.queryClient.setQueryData("question.getTodos", [...todos!, todo]);
    },
  });
  const rmTodo = trpc.useMutation("question.removeTodo", {
    onSuccess: (todo) => {
      ctx.queryClient.setQueryData(
        "question.getTodos",
        todos?.filter((t) => t.id !== todo.id)
      );
    },
  });
  const [todo, setTodo] = useState("");

  return (
    <>
      <Head>
        <title>Todoos</title>
        <meta name="description" content="Your favourite to-do app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="flex items-center justify-between p-4">
        <div className="flex">
          {session?.user?.image && (
            <img src={session.user?.image} className="rounded h-8 mr-4" />
          )}
          {session?.user?.name && <p>{session.user.name}</p>}
        </div>
        {!session ? (
          <button onClick={() => signIn("github")}>Sign In</button>
        ) : (
          <button onClick={() => signOut()}>Sign Out</button>
        )}
      </header>
      <main className="container mx-auto flex flex-col items-center justify-center h-screen p-4">
        <h1 className="text-5xl md:text-[5rem] leading-normal font-extrabold text-gray-700">
          Todoos
        </h1>
        {session && (
          <>
            <div>
              <input
                className="border-2 border-blue-200 rounded-l-md"
                type="text"
                name="text"
                id="text"
                value={todo}
                onChange={(e) => {
                  setTodo(e.target.value);
                }}
              />
              <button
                className="border-2 border-l-0 border-blue-200 bg-blue-200 rounded-r-md px-4"
                onClick={async () => {
                  addTodo.mutate({ text: todo });
                  setTodo("");
                }}
              >
                +
              </button>
            </div>
            <ul className="mt-4">
              {todos?.map((todo) => (
                <li className="min-w-md flex justify-between items-center">
                  {todo.text}{" "}
                  <button
                    className="bg-green-200 rounded-md p-2"
                    onClick={() => {
                      rmTodo.mutate({ id: todo.id });
                    }}
                  >
                    Done
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
    </>
  );
};

export default Home;
