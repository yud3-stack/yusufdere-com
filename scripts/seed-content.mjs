import { createClient } from "@supabase/supabase-js";
import { categories, posts, projects } from "./seed-data.mjs";

function safeMessage(error) {
  const key = process.env.SUPABASE_SECRET_KEY ?? "";
  const raw =
    error instanceof Error
      ? error.message
      : error && typeof error === "object" && "message" in error
        ? String(error.message)
        : "İşlem başarısız oldu.";
  if (key && raw.includes(key)) {
    return raw.split(key).join("[redacted]");
  }
  return raw;
}

function labelFor(title) {
  if (title.length <= 40) {
    return title;
  }
  return `${title.split(":")[0]}...`;
}

function sameList(left, right) {
  const a = left ?? [];
  const b = right ?? [];
  return a.length === b.length && a.every((item, index) => item === b[index]);
}

async function findOne(supabase, table, column, value) {
  const { data, error } = await supabase.from(table).select("*").eq(column, value).limit(2);
  if (error) {
    throw new Error(safeMessage(error));
  }
  if ((data ?? []).length > 1) {
    throw new Error(`${table} tablosunda aynı ${column} ile birden fazla kayıt var.`);
  }
  return data?.[0] ?? null;
}

async function findContent(supabase, table, item) {
  const bySlug = await findOne(supabase, table, "slug", item.slug);
  if (bySlug) {
    return bySlug;
  }
  return findOne(supabase, table, "title", item.title);
}

function filled(value) {
  return typeof value === "string" && value.trim() ? value : null;
}

function preservedCover(existing, seedCover) {
  return filled(existing?.cover_image) ?? seedCover ?? null;
}

function preservedText(existingValue, seedValue) {
  return filled(existingValue) ?? seedValue ?? null;
}

async function upsertCategory(supabase, item, write) {
  const existing = await findOne(supabase, "categories", "slug", item.slug);
  const action = existing ? "existing" : "insert";

  if (!write || existing) {
    return {
      name: existing?.name ?? item.name,
      slug: existing?.slug ?? item.slug,
      action,
      id: existing?.id ?? null,
    };
  }

  const { data, error } = await supabase
    .from("categories")
    .insert({ name: item.name, slug: item.slug })
    .select("id, name, slug")
    .single();
  if (error) throw new Error(safeMessage(error));
  return { name: data.name, slug: data.slug, action, id: data.id };
}

async function upsertPost(supabase, item, seedCategory, write) {
  const existing = await findContent(supabase, "posts", item);
  const action = existing ? "update" : "insert";
  const categoryId = existing?.category_id ?? seedCategory?.id ?? null;
  const categoryLabel = existing?.category_id ? "preserved" : seedCategory?.name ?? item.categorySlug;
  const cover = preservedCover(existing, item.coverImage);
  const publishedAt = existing?.published_at ?? item.publishedAt;
  const snapshot = {
    id: existing?.id ?? null,
    slug: existing?.slug ?? item.slug,
    cover: filled(existing?.cover_image),
    publishedAt: existing?.published_at ?? null,
    categoryId: existing?.category_id ?? null,
  };

  if (!write) {
    return {
      title: item.title,
      action,
      id: snapshot.id,
      slug: snapshot.slug,
      coverPreserved: Boolean(snapshot.cover),
      publishedAtPreserved: Boolean(snapshot.publishedAt),
      idPreserved: Boolean(snapshot.id),
      categoryAction: snapshot.categoryId ? "preserved" : `assign ${categoryLabel}`,
      snapshot,
      seedCategory,
    };
  }

  if (!categoryId) {
    throw new Error("Kategori çözülemedi.");
  }

  const payload = {
    title: item.title,
    excerpt: item.excerpt,
    content: item.content,
    category_id: categoryId,
    tags: item.tags,
    status: item.status,
    published_at: publishedAt,
    cover_image: cover,
  };

  if (existing) {
    const { data, error } = await supabase.from("posts").update(payload).eq("id", existing.id).select("id").single();
    if (error) throw new Error(safeMessage(error));
    return { title: item.title, action, id: data.id, snapshot, seedCategory };
  }

  const { data, error } = await supabase
    .from("posts")
    .insert({ ...payload, slug: item.slug })
    .select("id")
    .single();
  if (error) throw new Error(safeMessage(error));
  return { title: item.title, action, id: data.id, snapshot, seedCategory };
}

async function upsertProject(supabase, item, write) {
  const existing = await findContent(supabase, "projects", item);
  const action = existing ? "update" : "insert";
  const cover = preservedCover(existing, item.coverImage);
  const publishedAt = existing?.published_at ?? item.publishedAt ?? new Date().toISOString();
  const liveUrl = preservedText(existing?.live_url, item.liveUrl);
  const githubUrl = preservedText(existing?.github_url, item.githubUrl);
  const snapshot = {
    id: existing?.id ?? null,
    slug: existing?.slug ?? item.slug,
    cover: filled(existing?.cover_image),
    publishedAt: existing?.published_at ?? null,
    liveUrl: filled(existing?.live_url),
    githubUrl: filled(existing?.github_url),
  };

  if (!write) {
    return {
      title: item.title,
      action,
      id: snapshot.id,
      liveUrl,
      coverPreserved: Boolean(snapshot.cover),
      publishedAtPreserved: Boolean(snapshot.publishedAt),
      idPreserved: Boolean(snapshot.id),
      snapshot,
    };
  }

  const payload = {
    title: item.title,
    description: item.description,
    content: item.content,
    technologies: item.technologies,
    github_url: githubUrl,
    live_url: liveUrl,
    featured: item.featured,
    status: item.status,
    published_at: publishedAt,
    cover_image: cover,
  };

  if (existing) {
    const { data, error } = await supabase
      .from("projects")
      .update(payload)
      .eq("id", existing.id)
      .select("id")
      .single();
    if (error) throw new Error(safeMessage(error));
    return { title: item.title, action, id: data.id, liveUrl, snapshot };
  }

  const { data, error } = await supabase
    .from("projects")
    .insert({ ...payload, slug: item.slug })
    .select("id")
    .single();
  if (error) throw new Error(safeMessage(error));
  return { title: item.title, action, id: data.id, liveUrl, snapshot };
}

async function verify(supabase, postResult, projectResult) {
  const post = posts[0];
  const project = projects[0];
  const savedPost = await findContent(supabase, "posts", post);
  const savedProject = await findContent(supabase, "projects", project);
  const problems = [];
  const expectedCategory = savedPost?.category_id
    ? await findOne(supabase, "categories", "id", savedPost.category_id)
    : null;
  const seedCategory = postResult.seedCategory;

  if (!savedPost) problems.push("Vercel yazısı yok.");
  if (savedPost && postResult.snapshot.id && savedPost.id !== postResult.snapshot.id) {
    problems.push("Vercel yazısının id değeri değişti.");
  }
  if (savedPost && savedPost.slug !== postResult.snapshot.slug) problems.push("Vercel yazısının slug değeri değişti.");
  if (savedPost && savedPost.status !== "published") problems.push("Vercel yazısı published değil.");
  if (savedPost && !savedPost.category_id) problems.push("Vercel yazısının kategorisi boş.");
  if (savedPost && postResult.snapshot.categoryId && savedPost.category_id !== postResult.snapshot.categoryId) {
    problems.push("Vercel yazısının mevcut kategorisi korunmadı.");
  }
  if (savedPost && !postResult.snapshot.categoryId && expectedCategory?.slug !== seedCategory?.slug) {
    problems.push("Vercel yazısına seed kategorisi atanmadı.");
  }
  if (savedPost && !postResult.snapshot.categoryId && expectedCategory?.name !== seedCategory?.name) {
    problems.push("Vercel yazısının kategori adı seed ile uyuşmuyor.");
  }
  if (savedPost && postResult.snapshot.cover && savedPost.cover_image !== postResult.snapshot.cover) {
    problems.push("Vercel yazısının kapağı değişti.");
  }
  if (savedPost && postResult.snapshot.publishedAt && savedPost.published_at !== postResult.snapshot.publishedAt) {
    problems.push("Vercel yazısının yayın tarihi değişti.");
  }
  if (savedPost && !sameList(savedPost.tags, post.tags)) problems.push("Vercel yazısının etiketleri yanlış.");
  if (savedPost && !String(savedPost.content ?? "").trim()) problems.push("Vercel yazısının içeriği boş.");

  if (!savedProject) problems.push("LLMVoice yok.");
  if (savedProject && projectResult.snapshot.id && savedProject.id !== projectResult.snapshot.id) {
    problems.push("LLMVoice id değeri değişti.");
  }
  if (savedProject && savedProject.slug !== projectResult.snapshot.slug) problems.push("LLMVoice slug değeri değişti.");
  if (savedProject && savedProject.status !== "published") problems.push("LLMVoice published değil.");
  if (savedProject && savedProject.featured !== true) problems.push("LLMVoice featured değil.");
  if (savedProject && !sameList(savedProject.technologies, project.technologies)) {
    problems.push("LLMVoice teknolojileri yanlış.");
  }
  if (savedProject && savedProject.github_url !== (projectResult.snapshot.githubUrl ?? project.githubUrl)) {
    problems.push("LLMVoice GitHub adresi değişti.");
  }
  if (savedProject && savedProject.live_url !== (projectResult.snapshot.liveUrl ?? project.liveUrl)) {
    problems.push("LLMVoice canlı adresi değişti.");
  }
  if (savedProject && projectResult.snapshot.cover && savedProject.cover_image !== projectResult.snapshot.cover) {
    problems.push("LLMVoice kapağı değişti.");
  }
  if (savedProject && projectResult.snapshot.publishedAt && savedProject.published_at !== projectResult.snapshot.publishedAt) {
    problems.push("LLMVoice yayın tarihi değişti.");
  }
  if (savedProject && !String(savedProject.content ?? "").trim()) problems.push("LLMVoice içeriği boş.");

  const categorySlug = !postResult.snapshot.categoryId ? seedCategory?.slug : expectedCategory?.slug;
  const [{ count: categoryCount, error: categoryCountError }, { count: postCount, error: postCountError }, { count: projectCount, error: projectCountError }] =
    await Promise.all([
      supabase.from("categories").select("id", { count: "exact", head: true }).eq("slug", categorySlug ?? ""),
      supabase.from("posts").select("id", { count: "exact", head: true }).eq("id", savedPost?.id ?? ""),
      supabase.from("projects").select("id", { count: "exact", head: true }).eq("id", savedProject?.id ?? ""),
    ]);

  if (categoryCountError || postCountError || projectCountError) {
    problems.push("Kayıt sayısı doğrulanamadı.");
  }
  if (categoryCount !== 1) problems.push(`Kategori sayısı: ${categoryCount ?? "bilinmiyor"}.`);
  if (postCount !== 1) problems.push(`Vercel yazısı sayısı: ${postCount ?? "bilinmiyor"}.`);
  if (projectCount !== 1) problems.push(`LLMVoice sayısı: ${projectCount ?? "bilinmiyor"}.`);

  return { problems, savedPost, savedProject, expectedCategory };
}

function printDryRun(results) {
  console.log("[DRY RUN]");
  console.log("");
  for (const result of results) {
    if (result.kind === "Category") {
      console.log("Category:");
      console.log(result.label);
      console.log(`action: ${result.action}`);
    }
    if (result.kind === "Post") {
      console.log("");
      console.log("Post:");
      console.log(result.label);
      console.log(`action: ${result.action}`);
      console.log(`category action: ${result.categoryAction}`);
      console.log(`cover preserved: ${result.coverPreserved ? "yes" : "no"}`);
      console.log(`published_at preserved: ${result.publishedAtPreserved ? "yes" : "no"}`);
      console.log(`id preserved: ${result.idPreserved ? "yes" : "no"}`);
    }
    if (result.kind === "Project") {
      console.log("");
      console.log("Project:");
      console.log(result.label);
      console.log(`action: ${result.action}`);
      console.log(`live_url preserved: ${result.liveUrl}`);
      console.log(`cover preserved: ${result.coverPreserved ? "yes" : "no"}`);
      console.log(`published_at preserved: ${result.publishedAtPreserved ? "yes" : "no"}`);
      console.log(`id preserved: ${result.idPreserved ? "yes" : "no"}`);
    }
  }
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  const write = process.env.SEED_ALLOW_WRITE === "true";

  if (!url) {
    console.error("NEXT_PUBLIC_SUPABASE_URL tanımlı değil. Seed durdu.");
    process.exitCode = 1;
    return;
  }

  if (!key) {
    console.error("SUPABASE_SECRET_KEY tanımlı değil. Seed durdu.");
    process.exitCode = 1;
    return;
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const results = [];
  const failures = [];
  const categoryIds = new Map();

  for (const category of categories) {
    try {
      const result = await upsertCategory(supabase, category, write);
      categoryIds.set(category.slug, result);
      results.push({ kind: "Category", label: category.name, ...result });
    } catch (error) {
      failures.push(`Category ${category.name}: ${safeMessage(error)}`);
    }
  }

  let postResult = null;
  let projectResult = null;

  for (const post of posts) {
    const seedCategory = categoryIds.get(post.categorySlug) ?? null;
    if (!seedCategory?.id && write) {
      failures.push(`Post ${post.title}: kategori bulunamadı.`);
      continue;
    }
    try {
      postResult = await upsertPost(supabase, post, seedCategory, write);
      results.push({ kind: "Post", label: labelFor(post.title), ...postResult });
    } catch (error) {
      failures.push(`Post ${post.title}: ${safeMessage(error)}`);
    }
  }

  for (const project of projects) {
    try {
      const savedProjectResult = await upsertProject(supabase, project, write);
      if (project.slug === projects[0].slug) {
        projectResult = savedProjectResult;
      }
      results.push({ kind: "Project", label: project.title, ...savedProjectResult });
    } catch (error) {
      failures.push(`Project ${project.title}: ${safeMessage(error)}`);
    }
  }

  if (!write) {
    printDryRun(results);
    if (failures.length > 0) {
      console.error("");
      console.error("Seed FAILED.");
      for (const failure of failures) console.error(`- ${failure}`);
      process.exitCode = 1;
    }
    return;
  }

  if (failures.length === 0 && postResult && projectResult) {
    try {
      const verification = await verify(supabase, postResult, projectResult);
      failures.push(...verification.problems);
    } catch (error) {
      failures.push(`Doğrulama: ${safeMessage(error)}`);
    }
  }

  if (failures.length > 0) {
    console.error("Seed FAILED.");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
    return;
  }

  console.log("Seed completed successfully.");
}

main().catch((error) => {
  console.error(safeMessage(error));
  process.exitCode = 1;
});
