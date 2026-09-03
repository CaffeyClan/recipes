import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const recipesDirectory = path.join(root, "recipes");
const outputFile = path.join(root, "app", "data", "recipes.json");

function splitList(value = "") {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function numberOrNull(value) {
  if (!value?.trim()) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function parseRecipe(filename, text) {
  const sections = text.replace(/\r\n/g, "\n").split(/^## /m);
  const header = sections.shift();
  const metadata = {};

  for (const line of header.split("\n")) {
    const match = line.match(/^([a-z]+):\s*(.*)$/i);
    if (match) metadata[match[1].toLowerCase()] = match[2].trim();
  }

  const content = Object.fromEntries(sections.map((section) => {
    const [heading, ...lines] = section.split("\n");
    return [heading.trim().toLowerCase(), lines];
  }));

  const ingredients = (content.ingredients ?? [])
    .filter((line) => /^-\s+/.test(line))
    .map((line) => {
      const [amount = "", name = "", note = ""] = line.replace(/^-\s+/, "").split("|").map((part) => part.trim());
      return { amount, name, note };
    })
    .filter((ingredient) => ingredient.name);

  const instructions = (content.directions ?? [])
    .filter((line) => /^\d+[.)]\s+/.test(line))
    .map((line) => line.replace(/^\d+[.)]\s+/, "").trim());

  const notes = (content["family notes"] ?? [])
    .filter((line) => /^-\s+/.test(line))
    .map((line) => line.replace(/^-\s+/, "").trim())
    .filter((note) => note && note !== "Add family notes here.");

  const meals = splitList(metadata.meals);
  return {
    id: filename.replace(/\.md$/, ""),
    title: metadata.title || filename.replace(/\.md$/, "").replaceAll("-", " "),
    category: metadata.category || meals[0] || "Dinner",
    meal: meals.join(", "),
    protein: metadata.protein || "Vegetarian",
    tags: splitList(metadata.tags),
    ingredients,
    instructions,
    notes,
    rating: numberOrNull(metadata.rating),
    nutrition: {
      servings: metadata.servings || null,
      calories: numberOrNull(metadata.calories),
      protein: numberOrNull(metadata["protein grams"]),
      fat: numberOrNull(metadata["fat grams"]),
      carbs: numberOrNull(metadata["carb grams"]),
      fiber: numberOrNull(metadata["fiber grams"]),
      sodium: numberOrNull(metadata["sodium mg"]),
    },
    source: metadata.source || "Family recipe",
  };
}

const filenames = (await readdir(recipesDirectory))
  .filter((filename) => filename.endsWith(".md") && filename !== "TEMPLATE.md" && filename !== "README.md")
  .sort();

const recipes = await Promise.all(filenames.map(async (filename) => {
  const text = await readFile(path.join(recipesDirectory, filename), "utf8");
  return parseRecipe(filename, text);
}));

await writeFile(outputFile, `${JSON.stringify(recipes, null, 2)}\n`);
console.log(`Prepared ${recipes.length} recipes for the website.`);
