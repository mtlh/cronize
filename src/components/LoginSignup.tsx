import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs"

export default function Component({ error }: { error: string }) {

  return (
    <div className="w-full max-w-5xl p-4 m-auto mt-8 mb-8">
      <Tabs defaultValue="1">
        <TabsList className="flex gap-4 border rounded-lg border-gray-200 overflow-hidden dark:border-gray-800">
          <TabsTrigger value="1" className="flex-1">
            Login
          </TabsTrigger>
          <TabsTrigger value="2" className="flex-1">
            Signup
          </TabsTrigger>
        </TabsList>
        <TabsContent value="1">
          <LoginForm error={error} />
        </TabsContent>
        <TabsContent value="2">
          <SignupForm error={error} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function LoginForm({error}: {error: string}) {
  function DemoLogin() {
    var usernameInput = document.getElementById("email");
    var passwordInput = document.getElementById("password");
    var submitButton = document.getElementById("loginsubmit");
    if (usernameInput && passwordInput && submitButton) {
        // @ts-ignore
        passwordInput.value = "demouser"; usernameInput.value = "demo@gmail.com";
        submitButton.click();
    } else {
        console.error("One or more login elements not found.");
    }
  }
  return (
    <section className="pt-8">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
            <div className="w-full bg-slate-950 text-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl">
                        Login to your account
                    </h1>
                    <form className="space-y-4 md:space-y-6 text-gray-300" action="/api/login/" method="POST">
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium">Email</label>
                            <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required />
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium">Password</label>
                            <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        </div>
                        {/* <p class="text-red-500 font-semibold text-md">{{ error }}</p> */}
                        <button id="loginsubmit" type="submit" className="w-full bg-gray-800 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
                    </form>
                    <button onClick={DemoLogin} className="w-full bg-orange-700 hover:bg-orange-400 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Demo User</button>
                </div>
            </div>
            { error ? <p className="text-red-500 font-semibold text-md">{ error }</p> : null }
        </div>
    </section>
  )
}


function SignupForm({error}: {error: string}) {
  return (
      <section className="pt-8">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
            <div className="w-full bg-slate-950 text-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl">
                        Create a new account
                    </h1>
                    <form className="space-y-4 md:space-y-6 text-gray-300" action="/api/signup/" method="POST">
                        <div>
                            <label htmlFor="username" className="block mb-2 text-sm font-medium">Username</label>
                            <input type="text" name="username" id="username" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="username" required />
                        </div>
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium">Email</label>
                            <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required />
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium">Password</label>
                            <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        </div>
                        <div>
                            <label htmlFor="confpassword" className="block mb-2 text-sm font-medium">Confirm Password</label>
                            <input type="password" name="confpassword" id="confpassword" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        </div>
                        {/* <!-- <p class="text-red-500 font-semibold text-md">{ error }</p> --> */}
                        <button type="submit" className="w-full bg-gray-800 hover:bg-gray-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600">Create</button>
                    </form>
                </div>
            </div>
            { error ? <p className="text-red-500 font-semibold text-md">{ error }</p> : null }
        </div>
    </section>
  ) 
}