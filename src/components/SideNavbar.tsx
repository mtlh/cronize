import {
  Home,
  Menu,
  ArrowBigDown, ArrowBigUp, Settings, LogOut,
  Plus,
  PlayCircle
} from "lucide-react"

import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet"
import { useState, type ReactNode } from "react"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/components/ui/collapsible"


interface SideNavbarProps {
    children: ReactNode;
  }
  
const SideNavbar: React.FC<SideNavbarProps> = ({ children }) => {
    const [isProjectsOpen, setIsProjectsOpen] = useState(true);
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
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <a
                href="/profile"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted w-42"
              >
                <Home className="h-4 w-4" />
                Profile
              </a>
              <a
                href="/playground"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted w-42"
              >
                <PlayCircle className="h-4 w-4" />
                Playground
              </a>
              <Collapsible>
                <CollapsibleTrigger>
                    <div className="flex w-full min-w-48 items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary font-semibold hover:bg-muted" onClick={() => setIsProjectsOpen(!isProjectsOpen)}>
                        {isProjectsOpen ? <ArrowBigUp className="h-4 w-4" /> : <ArrowBigDown className="h-4 w-4" />}
                        Projects
                        <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                            6
                        </Badge>
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="CollapsibleContent">
                    {[1, 2, 3, 4, 5, 6].map((item, index) => (
                        <div key={index} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted w-42">
                            <Home className="h-4 w-4" />
                            Project Name
                        </div>
                    ))}
                </CollapsibleContent>
              </Collapsible>
              <a
                href="/addproject"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted w-42"
              >
                <Plus className="h-4 w-4" />
                Add Project
              </a>
              <a
                href="/settings"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted w-42"
              >
                <Settings className="h-4 w-4" />
                Settings
              </a>
              <a
                href="/api/logout"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted w-42"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </a>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="md:hidden flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
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
              <nav className="grid gap-2 text-lg font-medium">
                <a
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold pt-2 pb-4"
                >
                  <img
                    id="sidebar-logo-togglemenu"
                    src="/cronizelogo_light.png"
                    width="160"
                    height="auto"
                    alt="Cronize Logo"
                    />
                </a>
                <a
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted w-42"
                >
                  <Home className="h-4 w-4" />
                  Profile
                </a>
                <a
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted w-42"
                >
                  <PlayCircle className="h-4 w-4" />
                  Playground
                </a>
                <Collapsible>
                  <CollapsibleTrigger>
                      <div className="flex w-42 items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary font-semibold hover:bg-muted" onClick={() => setIsProjectsOpen(!isProjectsOpen)}>
                          {isProjectsOpen ? <ArrowBigUp className="h-4 w-4" /> : <ArrowBigDown className="h-4 w-4" />}
                          Projects
                          <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                              6
                          </Badge>
                      </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="CollapsibleContent">
                    {[1, 2, 3, 4, 5, 6].map((item, index) => (
                        <div key={index} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted w-42">
                            <Home className="h-4 w-4" />
                            Project Name
                        </div>
                    ))}
                </CollapsibleContent>
                </Collapsible>
                <a
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted w-42"
                >
                  <Plus className="h-4 w-4" />
                  Add Project
                </a>
                <a
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted w-42"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </a>
                <a
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted w-42"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </a>
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