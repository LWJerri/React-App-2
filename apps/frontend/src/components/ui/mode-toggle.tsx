import { IconAppWindow, IconMoon, IconSun } from "@tabler/icons-react";
import { Button } from "./button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import { useTheme } from "./theme-provider";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size={"icon"}>
          <IconSun
            stroke={1.5}
            size={16}
            className="rotate-0 scale-100 transition-all duration-150 dark:-rotate-90 dark:scale-0"
          />
          <IconMoon
            stroke={1.5}
            size={16}
            className="absolute rotate-90 scale-0 transition-all duration-150 dark:rotate-0 dark:scale-100"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-56">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <IconSun stroke={1.5} size={16} className="mr-2" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <IconMoon stroke={1.5} size={16} className="mr-2" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <IconAppWindow stroke={1.5} size={16} className="mr-2" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
