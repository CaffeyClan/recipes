import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const recipes = JSON.parse(await readFile(path.join(root, "app/data/recipes.json"), "utf8"));
await mkdir(path.join(root, "recipes"), { recursive: true });

const clean = (value) => String(value ?? "").replace(/\r?\n/g, " ").trim();
const mealTypes = ["Breakfast", "Lunch", "Dinner", "Sides", "Dessert", "Homemade Mixes"];

function mealsFor(recipe) {
  if (recipe.title === "Fruit Salsa") return ["Breakfast", "Dessert"];
  if (recipe.title === "Guacamole Snack") return ["Sides"];
  const values = `${recipe.meal},${recipe.category}`
    .replaceAll("Homemade Mixes & More", "Homemade Mixes")
    .split(",")
    .map((item) => item.trim())
    .filter((item) => mealTypes.includes(item));
  if (!values.length && ["Poultry", "Red Meat", "Seafood", "Vegetarian"].includes(recipe.category)) values.push("Dinner");
  return [...new Set(values)];
}

function proteinFor(recipe) {
  if (["Poultry", "Red Meat", "Seafood", "Vegetarian"].includes(recipe.category)) return recipe.category;
  const text = [recipe.title, ...recipe.ingredients.map((item) => item.name)].join(" ").toLowerCase();
  if (/shrimp|salmon|seafood|fish|tuna|crab/.test(text)) return "Seafood";
  if (/chicken|turkey|poultry/.test(text)) return "Poultry";
  if (/beef|pork|bacon|sausage|meatball|steak|meatloaf/.test(text)) return "Red Meat";
  return "Vegetarian";
}

for (const recipe of recipes) {
  const nutrition = recipe.nutrition ?? {};
  const lines = [
    `title: ${clean(recipe.title)}`,
    `meals: ${mealsFor(recipe).join(", ")}`,
    `protein: ${proteinFor(recipe)}`,
    `tags: ${recipe.tags.map(clean).join(", ")}`,
    `source: ${clean(recipe.source)}`,
    `rating: ${recipe.rating ?? ""}`,
    `servings: ${clean(nutrition.servings)}`,
    `calories: ${nutrition.calories ?? ""}`,
    `protein grams: ${nutrition.protein ?? ""}`,
    `carb grams: ${nutrition.carbs ?? ""}`,
    `fat grams: ${nutrition.fat ?? ""}`,
    `fiber grams: ${nutrition.fiber ?? ""}`,
    `sodium mg: ${nutrition.sodium ?? ""}`,
    "",
    "## Ingredients",
    "",
    ...recipe.ingredients.map((item) => `- ${clean(item.amount)} | ${clean(item.name)} | ${clean(item.note)}`),
    "",
    "## Directions",
    "",
    ...recipe.instructions.map((instruction, index) => `${index + 1}. ${clean(instruction).replace(/^\d+[.)]\s*/, "")}`),
    "",
    "## Family Notes",
    "",
    ...(recipe.notes.length ? recipe.notes.map((note) => `- ${clean(note)}`) : ["- Add family notes here."]),
    "",
  ];
  await writeFile(path.join(root, "recipes", `${recipe.id}.md`), lines.join("\n"));
}

console.log(`Created ${recipes.length} easy-to-edit recipe files.`);
