import * as React from "react"

import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Github } from "lucide-react";

// const components: { title: string; href: string; description: string }[] = [
//   {
//     title: "LinkedIn",
//     href: "https://www.linkedin.com/in/mtlh/",
//     description:
//       "Connect with me on LinkedIn.",
//   },
//   {
//     title: "GitHub",
//     href: "https://github.com/mtlh",
//     description:
//       "Check out my GitHub profile.",
//   },
//   {
//     title: "Portfolio",
//     href: "https://mtlh.dev",
//     description:
//       "Want to see some more projects?",
//   }
// ]

export default function TopNavbar() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>External Links</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="https://github.com/mtlh/cronize"
                    target="_blank"
                    referrerPolicy="no-referrer"
                  >
                    <Github className="h-6 w-6" />
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Github Repo
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      If you wish to contribute to the project, you can do so
                      here.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="https://www.linkedin.com/in/mtlh/" title="LinkedIn">
                Connect with me on LinkedIn.
              </ListItem>
              <ListItem href="https://github.com/mtlh" title="GitHub">
                Check out my GitHub profile.
              </ListItem>
              <ListItem href="https://mtlh.dev" title="Portfolio">
                Want to see some other projects?
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        {/* <NavigationMenuItem>
          <NavigationMenuTrigger>Find me elsewhere</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-3 p-4 md:w-[250px] md:grid-cols-1 lg:w-[300px] ">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem> */}
      </NavigationMenuList>
      <a
        href="/login"
        className="border-purple-600 border inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
      >
        Get Started
      </a>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
