import { useState } from "react";
import { Progress } from "@chakra-ui/react";
// import { Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react'

let controller: AbortController;

function Icon(props: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={props.className + " h-6 w-6"}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
      />
    </svg>
  );
}

function Navbar(props: { className?: string }) {
  return (
    <div id="usersGrid" className={`${props.className}`}>
      <Icon className="mx-5" />
      <div className="flex w-full flex-col items-center justify-center rounded-xl border-b border-gray-300 bg-gradient-to-b from-zinc-200 py-2 backdrop-blur-2xl lg:static lg:flex-row lg:border lg:bg-gray-200 lg:p-4 dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:dark:bg-zinc-800/30 ">
        {/* <Icon className="mx-5 lg:hidden" /> */}
        <p>Task 2: Fetch users from API &nbsp;</p>
        <code className="font-mono font-bold">https://reqres.in/api/users</code>
      </div>
    </div>
  );
}

const GetUsersButton = (props: {
  children?: React.ReactNode;
  className: string;
  loading: boolean;
  setLoading: Function;
  setData: Function;
}) => {
  const handleClick = () => {
    console.log("loading:", props.loading);
    props.setLoading(true);

    if (controller) {
      controller.abort();
      console.log("Fetch aborted");
    }

    controller = new AbortController();

    /*
     */
    let timer = setTimeout(() => {
      fetch(`https://reqres.in/api/users?page=1&per_page=10`, {
        method: "get",
        signal: controller.signal,
      })
        .then((res) => res.json())
        .then((json) => {
          console.log(json);
          props.setData(json);
          props.setLoading(false);
          // controller = null;
        })
        .catch((err) => {
          console.error(`Download error: ${err.message}`);
        });
    }, 1000);

    controller.signal.addEventListener("abort", () => {
      clearTimeout(timer);
    });

    /* Too fast to fetch */

    // fetch(`https://reqres.in/api/users?page=1&per_page=10`, {
    //   method: "get",
    //   signal: controller.signal,
    // })
    //   .then((res) => res.json())
    //   .then((json) => {
    //     console.log(json);
    //     props.setData(json);
    //     props.setLoading(false);
    //     // controller = null;
    //   })
    //   .catch((err) => {
    //     console.error(`Download error: ${err.message}`);
    //   });
  };

  return (
    <div className={`${props.className}`}>
      <button
        onClick={handleClick}
        className={
          "mx-auto block w-[80%] select-none rounded-xl border border-solid bg-white px-5 py-2 shadow-md hover:brightness-95 active:brightness-90 sm:w-[50%] sm:max-w-xs"
        }
      >
        <code>{"< GetUsers />"} </code>
      </button>
      {/* <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 active:bg-blue-700"> */}
    </div>
  );
};

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

interface Support {
  url: string;
  text: string;
}

interface ApiResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: User[];
  support: Support;
}

function UsersGrid(props: { className?: string; data: User[] }) {
  return (
    <div id="usersContainer" className={`${props.className}`}>
      {props.data.map((user) => (
        <div
          className={"stagger-animation"}
          style={{ "--delayOrder": user.id } as React.CSSProperties}
        >
          <img
            loading="eager"
            width={100}
            height={100}
            src={user.avatar}
            alt="User's display picture"
          />
          <p>
            <strong>
              <span>{user.first_name}</span> <span>{user.last_name}</span>
            </strong>
          </p>
          <a href={`mailto:${user.email}`}>{user.email}</a>
        </div>
      ))}
    </div>
  );
}

function SkeletonGrid(props: { className?: string; items?: number }) {
  const { items = 6 } = props;

  return (
    <div id="skeletonContainer" className={`${props.className}`}>
      {Array.from({ length: items }).map((_, index) => (
        <div className="user-card">
          <SkeletonCircle />
          <SkeletonText />
        </div>
      ))}
    </div>
  );
}

function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <main className="min-h-screen p-2 ">
      <Navbar className="z-10 flex w-full items-center justify-between font-mono text-sm" />
      {loading == true ? (
        <>
          <Progress size="xs" isIndeterminate />
          <SkeletonGrid items={10} className="grid grid-cols-5 p-10" />
        </>
      ) : (
        <UsersGrid
          data={response?.data ?? []}
          className="grid grid-cols-5 p-10"
        />
      )}
      {/* <div className="bg-inherit rounded-lg shadow-md p-6">some text</div> */}

      <GetUsersButton
        setLoading={setLoading}
        loading={loading}
        setData={setResponse}
        className="fixed bottom-10 w-full px-2 dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
      />
    </main>
  );
}

function App() {
  return (
    <>
      <Home />
    </>
  );
}

export default App;
