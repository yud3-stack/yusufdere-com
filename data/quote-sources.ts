export const quoteAuthors = [
  { page: "Edsger W. Dijkstra", name: "Edsger W. Dijkstra", detail: "Bilgisayar bilimci", portrait: "/images/quotes/edsger-dijkstra.jpg", credit: "Hamilton Richards · CC BY-SA 3.0" },
  { page: "Donald Knuth", name: "Donald Knuth", detail: "Bilgisayar bilimci", portrait: "", credit: "" },
  { page: "Alan Kay", name: "Alan Kay", detail: "Bilgisayar bilimci", portrait: "", credit: "" },
  { page: "Grace Hopper", name: "Grace Hopper", detail: "Bilgisayar bilimci", portrait: "", credit: "" },
  { page: "Paul Graham", name: "Paul Graham", detail: "Yazılımcı ve yazar", portrait: "", credit: "" },
  { page: "Martin Fowler", name: "Martin Fowler", detail: "Yazılım geliştirici ve yazar", portrait: "", credit: "" },
  { page: "Rob Pike", name: "Rob Pike", detail: "Yazılım geliştirici", portrait: "", credit: "" },
  { page: "Bjarne Stroustrup", name: "Bjarne Stroustrup", detail: "Bilgisayar bilimci", portrait: "", credit: "" },
  { page: "Dennis Ritchie", name: "Dennis Ritchie", detail: "Bilgisayar bilimci", portrait: "", credit: "" },
  { page: "Linus Torvalds", name: "Linus Torvalds", detail: "Yazılım geliştirici", portrait: "", credit: "" },
] as const;

// No arbitrary URL fetching: source checks are restricted to known publishers.
export const quoteSourceHosts = [
  "www.cs.utexas.edu", "cs.utexas.edu", "www-cs-faculty.stanford.edu",
  "www-cs.stanford.edu", "cs.stanford.edu", "www.computerhistory.org",
  "computerhistory.org", "amturing.acm.org", "queue.acm.org", "dl.acm.org",
  "www.paulgraham.com", "paulgraham.com", "www.dreamsongs.com", "dreamsongs.com",
  "martinfowler.com", "www.martinfowler.com", "www.stroustrup.com", "stroustrup.com",
  "research.swtch.com", "9p.io", "www.cs.yale.edu", "web.mit.edu",
  "www.artima.com", "www.lysator.liu.se", "www.cs.bell-labs.com", "www.bell-labs.com",
  "git.kernel.org", "www.kernel.org", "kernel.org", "lore.kernel.org",
  "www.cs.helsinki.fi", "www.linuxfocus.org", "linuxfocus.org",
  "research.att.com", "www.research.att.com", "www2.research.att.com",
] as const;
