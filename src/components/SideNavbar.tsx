import {
  Home,
  Menu,
  Settings, LogOut,
  Plus,
  PlayCircle,
  Rocket,
  UserCircle,
  Folder,
  Loader,
  LoaderCircle
} from "lucide-react"

import { Button } from "../components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet"
import { useEffect, useState, type ReactNode } from "react"
import type { Project } from "@/db/types";

interface SideNavbarProps {
    children: ReactNode;
    username: string; 
  }
  
const SideNavbar: React.FC<SideNavbarProps> = ({ children, username }) => {

    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            const response = await fetch('/api/getProject');
            const data = await response.json();
            setProjects(data);
        }
        fetchProjects();

        const themeSwitch = document.getElementById('themeToggle')?.cloneNode(true) as HTMLElement;
        const themeSwitchMobile = document.getElementById('themeToggleContainerMobile') as HTMLElement;
        const themeSwitchDesktop = document.getElementById('themeToggleContainerDesktop') as HTMLElement;

        setTimeout(() => {
          setLoading(false);

          if (themeSwitchDesktop) { 
            themeSwitchDesktop.addEventListener("click", handleToggleClick);
            themeSwitchDesktop.innerText = "Toggle theme";
            themeSwitch.classList.remove('w-10'); themeSwitch.classList.remove('h-10'); themeSwitch.classList.add('w-6'); themeSwitch.classList.add('h-6');
            themeSwitchDesktop.insertBefore(themeSwitch, themeSwitchDesktop.firstChild);
          }

          if (themeSwitchMobile) {
            themeSwitchMobile.addEventListener("click", handleToggleClick);
            themeSwitchMobile.innerText = "Toggle theme";
            themeSwitch.classList.remove('w-10'); themeSwitch.classList.remove('h-10'); themeSwitch.classList.add('w-6'); themeSwitch.classList.add('h-6');
            themeSwitchMobile.insertBefore(themeSwitch, themeSwitchMobile.firstChild);
          }
        }, 200);
      }, []);

      const handleToggleClick = () => {
        const element = document.documentElement
        element.classList.toggle('dark')
    
        const isDark = element.classList.contains('dark')
        if (isDark) {
          try {
            // @ts-ignore
            document.getElementById('nav-logo').src = '/cronizelogo_dark.png'
          } catch (error) {}
          try {
            // @ts-ignore
            document.getElementById('sidebar-logo').src = '/cronizelogo_dark.png'; document.getElementById('sidebar-logo-togglemenu').src = '/cronizelogo_dark.png'
          } catch (error) {}
        } else {
          try {
            // @ts-ignore
            document.getElementById('nav-logo').src = '/cronizelogo_light.png'
          } catch (error) {}
          try {
            // @ts-ignore
            document.getElementById('sidebar-logo').src = '/cronizelogo_light.png'; document.getElementById('sidebar-logo-togglemenu').src = '/cronizelogo_light.png'
          } catch (error) {}
        }
        localStorage.setItem('theme', isDark ? 'dark' : 'light')
      }

    return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 py-8">
            <a href="/" className="flex items-center gap-2 font-semibold">
              <img
                id="sidebar-logo"
                src="/cronizelogo_light.png"
                width="160"
                height="auto"
                alt="Cronize Logo"
                />
            </a>
            {/* <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button> */}
          </div>
          <div className="flex-1">
            <nav className="flex flex-col h-full px-2 text-sm font-medium lg:px-4">
              <div className="pb-1 pt-2 font-light text-muted-foreground">
                PLAYGROUND
                <a
                  href="/playground"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-black dark:text-white font-medium transition-all hover:text-primary hover:bg-muted w-42"
                >
                  <Rocket className="h-6 w-6" />
                  Sandbox
                </a>
              </div>
              <div className="pb-1 pt-2 font-light text-muted-foreground">
                PROJECTS
                <a
                  href="/addproject"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-black dark:text-white font-medium transition-all hover:text-primary hover:bg-muted w-42"
                >
                  <Plus className="h-6 w-6" />
                  Add Project
                </a>
                {loading ? 
                  <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-black font-medium transition-all hover:text-primary h-20 m-auto justify-center">
                    <LoaderCircle className='animate-spin w-8 h-8 text-orange-400' />
                  </div>
                : 
                  <>
                    {projects.map((project, index) => (
                        <a key={index} 
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-black dark:text-white font-medium transition-all hover:text-primary hover:bg-muted w-42"
                          href={`/project/${project.id}`}
                        >
                            <Folder className="h-6 w-6" />
                            {project.name}
                        </a>
                    ))}
                  </>
                }
              </div>
              <div className="pt-2 font-light text-muted-foreground mt-auto pb-6 border-t">
                PROFILE
                <a
                  href="/profile"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-black dark:text-white font-medium transition-all hover:text-primary hover:bg-muted w-42"
                >
                  <UserCircle className="h-6 w-6" />
                  {username}
                </a>
                {/* <a
                  href="/settings"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-black font-medium transition-all hover:text-primary hover:bg-muted w-42"
                >
                  <Settings className="h-6 w-6" />
                  Settings
                </a> */}
                <a
                  href="/api/logout"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-black dark:text-white font-medium transition-all hover:text-primary hover:bg-muted w-42"
                >
                  <LogOut className="h-6 w-6" />
                  Logout
                </a>
                {loading &&
                    <LoaderCircle className='animate-spin h-6 w-6 text-orange-400 m-auto' />
                }
                <div id="themeToggleContainerDesktop" className="flex items-center gap-3 rounded-lg px-3 py-2 text-black dark:text-white font-medium transition-all hover:text-primary hover:bg-muted w-42"></div>
              </div>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="md:hidden flex h-14 items-center justify-between gap-4 border-b bg-muted/40 p-4 lg:h-[60px] lg:px-6">
          <a href="/" className="flex items-center gap-2 font-semibold">
            <img
              id="sidebar-logo"
              src="/cronizelogo_light.png"
              width="160"
              height="auto"
              alt="Cronize Logo"
              />
          </a>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="lg"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-8 w-8" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="flex flex-col h-full px-2 text-md font-medium lg:px-4">
                <div className="pb-1 pt-2 font-light text-muted-foreground">
                  PLAYGROUND
                  <a
                    href="/playground"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-black dark:text-white font-semibold transition-all hover:text-primary hover:bg-muted w-42"
                  >
                    <Rocket className="h-6 w-6" />
                    Sandbox
                  </a>
                </div>
                <div className="pb-1 pt-2 font-light text-muted-foreground">
                  PROJECTS
                  <a
                    href="/addproject"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-black dark:text-white font-medium transition-all hover:text-primary hover:bg-muted w-42"
                  >
                    <Plus className="h-6 w-6" />
                    Add Project
                  </a>
                  {projects.map((project, index) => (
                      <a key={index} 
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-black dark:text-white font-medium transition-all hover:text-primary hover:bg-muted w-42"
                        href={`/project/${project.id}`}
                      >
                          <Folder className="h-6 w-6" />
                          {project.name}
                      </a>
                  ))}
                </div>
                <div className="pt-2 font-light text-muted-foreground mt-auto pb-6 border-t">
                  PROFILE
                  <a
                    href="/profile"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-black dark:text-white font-medium transition-all hover:text-primary hover:bg-muted w-42"
                  >
                    <UserCircle className="h-6 w-6" />
                    {username}
                  </a>
                  {/* <a
                    href="/settings"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-black font-medium transition-all hover:text-primary hover:bg-muted w-42"
                  >
                    <Settings className="h-6 w-6" />
                    Settings
                  </a> */}
                  <a
                    href="/api/logout"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-black dark:text-white font-medium transition-all hover:text-primary hover:bg-muted w-42"
                  >
                    <LogOut className="h-6 w-6" />
                    Logout
                  </a>
                  {loading &&
                    <LoaderCircle className='animate-spin h-6 w-6 text-orange-400 m-auto' />
                  }
                  <div id="themeToggleContainerMobile" className="flex items-center gap-3 rounded-lg px-3 py-2 text-black dark:text-white font-medium transition-all hover:text-primary hover:bg-muted w-42"></div>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {children}
        </main>
      </div>
    </div>
  )
}

export default SideNavbar;