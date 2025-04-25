"use client";
import { useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";
import { FaCloud, FaCode, FaArrowRight, FaPlus } from "react-icons/fa";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/projects", {
        headers: { "user-id": session.user.id },
      })
        .then((res) => res.json())
        .then(setProjects);
    }
  }, [status]);

  if (status === "authenticated") {
    const newProject = () => {
      const name = prompt("Enter project name:");
      console.log("Creating project with:", { name, userId: session.user.id });

      if (name) {
        fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, userId: session.user.id }),
        }).then(() => location.reload());
      }
    }
    return (
      <div className="flex flex-col h-screen bg-gray-950">
        <div className="flex items-center px-4 py-2 bg-gray-900 text-white">
          <a href="/" className="text-2xl text-blue-100">Web IDE</a>
          <p className="text-blue-100 ml-auto">Welcome, {session.user.name}</p>
          <button
            onClick={() => signOut()}
            className="inline-flex items-center ml-4 w-fit px-3 py-1.5 text-sm font-medium text-center text-white rounded-lg bg-inherit focus:ring-3 focus:outline-none border-2 dark:border-slate-500 hover:bg-slate-800 focus:ring-slate-600"
          >
            Sign Out
          </button>
        </div>
        <div className="flex-1 flex flex-col p-2">
          <h1 className="text-4xl font-bold mb-4 text-gray-200">
            My Projects
          </h1>
          <ul className="mt-4">
            {projects.map((project) => (
              <li key={project.id}>
                  <Link href={`/ide/${project.id}`}>
                  <div className="flex items-center justify-between px-3 py-2 bg-gray-800 text-white rounded mb-2">
                    {project.name}
                    </div>
                  </Link>
              </li>
            ))}

            <li className="flex justify-center">
              <button
                onClick={() => newProject()}
                className="px-3 py-2 bg-blue-500 text-white rounded"
              >
                <FaPlus className="inline" /> Create New Project
              </button>
            </li>
          </ul>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col h-screen bg-gray-950">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-900 text-white">
          <a href="/" className="text-2xl">Web IDE</a>
          <button type="button"
            onClick={() => { signIn() }}
            className="inline-flex items-center ml-auto w-fit px-3 py-1.5 text-sm font-medium text-center text-white rounded-lg bg-inherit focus:ring-3 focus:outline-none border-2 dark:border-slate-500 hover:bg-slate-800 focus:ring-slate-600"
          >Sign In</button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="block text-4xl font-bold mb-4 text-gray-200"><span className="text-amber-200">Welcome</span> to <span className="text-red-300">Your</span> <span className="text-green-300"><FaCode className="inline" /> Development Environment</span> in the <span className="text-blue-300"><FaCloud className="inline" /> Cloud</span></h1>
          <button type="button" className="inline-flex cursor-pointer items-center px-3 py-2 border-2 hover:bg-gray-900 border-blue-300 rounded-lg text-blue-300 text-2xl focus:ring-3 focus:ring-slate-600">Get Started <FaArrowRight className="ml-2" /></button>
        </div>
      </div>
    );
  }
}
