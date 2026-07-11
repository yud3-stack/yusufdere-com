"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  BriefcaseBusiness,
  Camera,
  Contact,
  Home,
  Layers,
  Search,
  Sparkles,
  User,
  Wrench,
} from "lucide-react";

import { getDictionary } from "@/dictionaries";
import { defaultLocale, type Locale, withLocalePrefix } from "@/lib/locale";
import { cn } from "@/lib/utils/cn";

type CommandItem = {
  id: string;
  label: string;
  description: string;
  href: string;
  group: string;
  keywords: string[];
  icon: typeof Home;
};

const projectShortcuts = [
  {
    id: "pixelbuddy-ai",
    label: "PixelBuddy AI",
    descriptionKey: "pixelbuddy",
    href: "/projects/pixelbuddy-ai",
  },
  {
    id: "travel-ticket",
    label: "Travel Ticket",
    descriptionKey: "travelTicket",
    href: "/projects/travel-ticket",
  },
  {
    id: "winsoundmixer",
    label: "WinSoundMixer",
    descriptionKey: "winSoundMixer",
    href: "/projects/winsoundmixer",
  },
] as const;

export function CommandMenu() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const locale: Locale =
    pathname === "/tr" || pathname.startsWith("/tr/")
      ? "tr"
      : defaultLocale;
  const dictionary = getDictionary(locale);
  const isStudio = pathname === "/studio" || pathname.startsWith("/studio/");

  const items = useMemo(
    () => createCommandItems(locale, dictionary),
    [dictionary, locale],
  );

  const filteredItems = useMemo(() => {
    const normalizedQuery = normalize(query);

    if (!normalizedQuery) {
      return items;
    }

    return items.filter((item) =>
      normalize(
        [item.label, item.description, item.group, ...item.keywords].join(" "),
      ).includes(normalizedQuery),
    );
  }, [items, query]);
  const safeActiveIndex =
    filteredItems.length === 0
      ? 0
      : Math.min(activeIndex, filteredItems.length - 1);

  useEffect(() => {
    if (isStudio) {
      return;
    }

    const openMenu = () => {
      previousFocusRef.current = document.activeElement as HTMLElement | null;
      setIsOpen(true);
    };

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      const isCommandShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";

      if (!isCommandShortcut) {
        return;
      }

      event.preventDefault();
      openMenu();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-menu", openMenu);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-menu", openMenu);
    };
  }, [isStudio]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const timeout = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [isOpen]);

  if (isStudio || !isOpen) {
    return null;
  }

  function closeMenu() {
    setIsOpen(false);
    setQuery("");
    setActiveIndex(0);
    previousFocusRef.current?.focus?.();
  }

  function selectItem(item: CommandItem) {
    closeMenu();
    router.push(item.href);
  }

  function handleBackdropClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      closeMenu();
    }
  }

  function handleDialogKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu();
    }
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      closeMenu();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) =>
        filteredItems.length === 0 ? 0 : (index + 1) % filteredItems.length,
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) =>
        filteredItems.length === 0
          ? 0
          : (index - 1 + filteredItems.length) % filteredItems.length,
      );
      return;
    }

    if (event.key === "Enter" && filteredItems[safeActiveIndex]) {
      event.preventDefault();
      selectItem(filteredItems[safeActiveIndex]);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center bg-background/72 px-4 pt-24 backdrop-blur-md sm:pt-28"
      role="dialog"
      aria-modal="true"
      aria-label={dictionary.command.shortcut}
      onMouseDown={handleBackdropClick}
      onKeyDown={handleDialogKeyDown}
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-background shadow-[0_28px_90px_rgb(0_0_0_/_0.34)]">
        <div className="flex items-center gap-3 border-b border-border px-4 py-4">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
            aria-label={dictionary.command.placeholder}
            aria-controls="command-menu-results"
            className="min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
            placeholder={dictionary.command.placeholder}
          />
          <kbd className="hidden rounded-md border border-border bg-surface px-2 py-1 font-mono text-[11px] text-muted-foreground sm:inline-flex">
            Esc
          </kbd>
        </div>

        <div
          id="command-menu-results"
          role="listbox"
          aria-label={dictionary.command.open}
          className="max-h-[min(58vh,520px)] overflow-y-auto p-2"
        >
          {filteredItems.length > 0 ? (
            <CommandResults
              items={filteredItems}
              activeIndex={safeActiveIndex}
              onActiveIndexChange={setActiveIndex}
              onSelect={selectItem}
            />
          ) : (
            <div className="px-4 py-12 text-center text-sm text-muted-foreground">
              {dictionary.command.noResults}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CommandResults({
  items,
  activeIndex,
  onActiveIndexChange,
  onSelect,
}: {
  items: CommandItem[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  onSelect: (item: CommandItem) => void;
}) {
  let currentGroup = "";

  return items.map((item, index) => {
    const Icon = item.icon;
    const showGroup = item.group !== currentGroup;

    currentGroup = item.group;

    return (
      <div key={item.id}>
        {showGroup ? (
          <div className="px-3 pb-2 pt-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {item.group}
          </div>
        ) : null}
        <button
          type="button"
          role="option"
          aria-selected={activeIndex === index}
          onMouseEnter={() => onActiveIndexChange(index)}
          onClick={() => onSelect(item)}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30",
            activeIndex === index
              ? "bg-surface text-foreground"
              : "text-muted-foreground hover:bg-surface/70 hover:text-foreground",
          )}
        >
          <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-background/40">
            <Icon className="size-4" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-foreground">
              {item.label}
            </span>
            <span className="mt-1 block truncate text-xs text-muted-foreground">
              {item.description}
            </span>
          </span>
        </button>
      </div>
    );
  });
}

function createCommandItems(locale: Locale, dictionary: ReturnType<typeof getDictionary>) {
  const pageGroup = dictionary.command.pages;
  const projectGroup = dictionary.command.projects;
  const pageItems: CommandItem[] = [
    {
      id: "home",
      label: locale === "tr" ? "Ana sayfa" : "Home",
      description: dictionary.command.descriptions.home,
      href: withLocalePrefix("/", locale),
      group: pageGroup,
      keywords: ["home", "index", "ana sayfa"],
      icon: Home,
    },
    {
      id: "about",
      label: locale === "tr" ? "Hakkımda" : dictionary.nav.about,
      description: dictionary.command.descriptions.about,
      href: withLocalePrefix("/about", locale),
      group: pageGroup,
      keywords: ["about", "bio", "hakkımda"],
      icon: User,
    },
    {
      id: "projects",
      label: dictionary.nav.projects,
      description: dictionary.command.descriptions.projects,
      href: withLocalePrefix("/projects", locale),
      group: pageGroup,
      keywords: ["projects", "work", "projeler"],
      icon: BriefcaseBusiness,
    },
    {
      id: "journal",
      label: dictionary.nav.journal,
      description: dictionary.command.descriptions.journal,
      href: withLocalePrefix("/journal", locale),
      group: pageGroup,
      keywords: ["journal", "notes", "notlar"],
      icon: BookOpen,
    },
    {
      id: "gallery",
      label: dictionary.nav.gallery,
      description: dictionary.command.descriptions.gallery,
      href: withLocalePrefix("/gallery", locale),
      group: pageGroup,
      keywords: ["gallery", "photos", "galeri"],
      icon: Camera,
    },
    {
      id: "uses",
      label: dictionary.nav.uses,
      description: dictionary.command.descriptions.uses,
      href: withLocalePrefix("/uses", locale),
      group: pageGroup,
      keywords: ["uses", "tools", "setup", "kullandıklarım"],
      icon: Wrench,
    },
    {
      id: "now",
      label: locale === "tr" ? "Şu An" : dictionary.nav.now,
      description: dictionary.command.descriptions.now,
      href: withLocalePrefix("/now", locale),
      group: pageGroup,
      keywords: ["now", "focus", "şu an", "şimdi"],
      icon: Sparkles,
    },
    {
      id: "contact",
      label: dictionary.nav.contact,
      description: dictionary.command.descriptions.contact,
      href: withLocalePrefix("/contact", locale),
      group: pageGroup,
      keywords: ["contact", "email", "iletişim"],
      icon: Contact,
    },
  ];

  const projectItems: CommandItem[] = projectShortcuts.map((project) => ({
    id: project.id,
    label: project.label,
    description: dictionary.command.descriptions[project.descriptionKey],
    href: withLocalePrefix(project.href, locale),
    group: projectGroup,
    keywords: ["project", "product", "proje", project.label],
    icon: Layers,
  }));

  return [...pageItems, ...projectItems];
}

function normalize(value: string) {
  return value.toLocaleLowerCase("tr-TR").trim();
}
