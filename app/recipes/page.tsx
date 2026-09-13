"use client";

import { useMemo, useState } from "react";
import { BookOpen, ChefHat, Plus, Search, Users } from "lucide-react";
import recipesData from "../data/recipes.json";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Ingredient = { amount: string; name: string; note: string };
type Nutrition = { servings?: string | number | null; calories?: number | null; protein?: number | null; fat?: number | null; carbs?: number | null; fiber?: number | null; sodium?: number | null };
type Recipe = { id: string; title: string; category: string; meal: string; protein: string; tags: string[]; ingredients: Ingredient[]; instructions: string[]; notes: string[]; rating: number | null; nutrition: Nutrition | null; source: string };

const recipes = recipesData as Recipe[];
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const repositoryUrl = "https://github.com/CaffeyClan/recipes";
const mealTypes = ["Breakfast", "Lunch", "Dinner", "Sides", "Dessert", "Homemade Mixes", "Natural Remedies"];
const proteinTypes = ["Vegetarian", "Poultry", "Red Meat", "Seafood"];

function recipeGroups(recipe: Recipe) {
  const text = [recipe.title, ...recipe.ingredients.map((item) => item.name)].join(" ").toLowerCase();
  let meals = recipe.meal.split(",").map((item) => item.trim()).filter((item) => mealTypes.includes(item));
  if (mealTypes.includes(recipe.category)) meals.push(recipe.category === "Homemade Mixes & More" ? "Homemade Mixes" : recipe.category);
  if (recipe.category === "Homemade Mixes & More") meals.push("Homemade Mixes");
  if (["Poultry", "Red Meat", "Seafood", "Vegetarian"].includes(recipe.category) && meals.length === 0) meals.push("Dinner");
  if (recipe.title === "Fruit Salsa") meals = ["Breakfast", "Dessert"];
  if (recipe.title === "Guacamole Snack") meals = ["Sides"];
  meals = Array.from(new Set(meals.filter((item) => item !== "Snack")));

  let protein = recipe.protein && proteinTypes.includes(recipe.protein) ? recipe.protein : "";
  if (!protein && proteinTypes.includes(recipe.category)) protein = recipe.category;
  if (!protein) {
    if (/shrimp|salmon|seafood|fish|tuna|crab/.test(text)) protein = "Seafood";
    else if (/chicken|turkey|poultry/.test(text)) protein = "Poultry";
    else if (/beef|pork|bacon|sausage|meatball|steak|meatloaf/.test(text)) protein = "Red Meat";
    else protein = "Vegetarian";
  }
  return { meals, protein };
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All Recipes");
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return recipes.filter((recipe) => {
      const groups = recipeGroups(recipe);
      const haystack = [recipe.title, recipe.category, recipe.meal, recipe.protein, ...recipe.tags, ...recipe.ingredients.map((i) => i.name)].join(" ").toLowerCase();
      const inGroup = filter === "All Recipes" || groups.meals.includes(filter) || groups.protein === filter;
      return inGroup && (!needle || haystack.includes(needle));
    });
  }, [query, filter]);

  return <main>
    <header className="topbar"><a className="brand" href={`${basePath}/`} aria-label="The Caffey Clan Kitchen home"><span><ChefHat aria-hidden="true" /></span><strong>The Caffey Clan Kitchen</strong></a><nav className="topbar-nav" aria-label="Main navigation"><a href={`${basePath}/`}>Meet the Clan</a><a href="#recipes">Recipe Box</a></nav><div className="topbar-actions"><div className="family-count"><Users aria-hidden="true" /> Made for our clan</div><a className="add-recipe-link" href={`${repositoryUrl}/blob/main/recipes/README.md`} target="_blank" rel="noreferrer"><Plus aria-hidden="true" /> Add Recipe</a></div></header>
    <section className="recipe-page-hero">
      <div><p className="eyebrow"><BookOpen aria-hidden="true" /> The clan recipe box</p><h1>Raid the Recipes</h1><p>Search the family favorites, browse by meal or protein, and open any card for the full recipe.</p></div>
      <div className="search-wrap"><Search aria-hidden="true" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search recipes or ingredients…" aria-label="Search recipes or ingredients" /></div>
    </section>
    <section className="library" id="recipes" aria-label="Recipe library">
      <div className="browse-filters">
        <Button className="all-recipes" size="sm" variant={filter === "All Recipes" ? "default" : "outline"} onClick={() => setFilter("All Recipes")} aria-pressed={filter === "All Recipes"}>All Recipes</Button>
        <div className="filter-stack"><div className="filter-group"><p>By meal</p><div className="filters" aria-label="Filter by meal type">{mealTypes.map((item) => <Button key={item} size="sm" variant={filter === item ? "default" : "outline"} onClick={() => setFilter(item)} aria-pressed={filter === item}>{item}</Button>)}</div></div>
        <div className="filter-group"><p>By protein</p><div className="filters" aria-label="Filter by protein">{proteinTypes.map((item) => <Button key={item} size="sm" variant={filter === item ? "default" : "outline"} onClick={() => setFilter(item)} aria-pressed={filter === item}>{item}</Button>)}</div></div></div>
      </div>
      <div className="results-heading"><div><p className="eyebrow">Recipe box</p><h2>{filter}</h2></div><p>{filtered.length} {filtered.length === 1 ? "recipe" : "recipes"}</p></div>
      {filtered.length ? <div className="recipe-grid">{filtered.map((recipe) => { const groups = recipeGroups(recipe); return <a className="recipe-card" key={recipe.id} href={`${basePath}/recipes/${recipe.id}/`}><span className="card-body"><span className="card-category">{groups.meals.join(" · ")} · {groups.protein}</span><strong>{recipe.title}</strong><span className="ingredient-preview">{recipe.ingredients.slice(0, 3).map((i) => i.name).join(" · ") || "Open for the recipe"}</span></span><span className="open-recipe">View recipe <span aria-hidden="true">→</span></span></a>; })}</div> : <div className="empty-state"><Search aria-hidden="true" /><h3>No recipes found</h3><p>Try another ingredient or choose a different category.</p><Button variant="outline" onClick={() => { setQuery(""); setFilter("All Recipes"); }}>Clear search</Button></div>}
    </section>
    <footer>Collected with love for the people around our table.</footer>
  </main>;
}
