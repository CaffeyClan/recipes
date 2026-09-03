"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { BookOpen, ChefHat, MessageCircle, Search, Star, Users } from "lucide-react";
import recipesData from "./data/recipes.json";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type Ingredient = { amount: string; name: string; note: string };
type Nutrition = { servings?: string | number | null; calories?: number | null; protein?: number | null; fat?: number | null; carbs?: number | null; fiber?: number | null; sodium?: number | null };
type Recipe = { id: string; title: string; category: string; meal: string; protein: string; tags: string[]; ingredients: Ingredient[]; instructions: string[]; notes: string[]; rating: number | null; nutrition: Nutrition | null; source: string };

const recipes = recipesData as Recipe[];
const mealTypes = ["Breakfast", "Lunch", "Dinner", "Sides", "Dessert", "Homemade Mixes"];
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

function NoteBubble({ note }: { note: string }) {
  return <Popover><PopoverTrigger asChild><button className="note-bubble" aria-label={`Open note: ${note}`}><MessageCircle aria-hidden="true" /></button></PopoverTrigger><PopoverContent align="start" className="note-card"><p className="note-label">Recipe note</p><p>{note}</p></PopoverContent></Popover>;
}

function RecipeDetail({ recipe }: { recipe: Recipe }) {
  const nutrition = recipe.nutrition;
  const groups = recipeGroups(recipe);
  return <div className="recipe-detail">
    <div className="detail-tags">{groups.meals.map((meal) => <span key={meal}>{meal}</span>)}<span>{groups.protein}</span>{recipe.rating ? <span><Star aria-hidden="true" /> {recipe.rating}/5</span> : null}</div>
    <section><h3>Ingredients</h3><ul className="ingredient-list">{recipe.ingredients.map((ingredient, index) => <li key={`${ingredient.name}-${index}`}>{ingredient.amount && <strong>{ingredient.amount}</strong>}<span>{ingredient.name}</span>{ingredient.note && <NoteBubble note={ingredient.note} />}</li>)}</ul></section>
    <section><h3>Directions</h3><ol className="instruction-list">{recipe.instructions.map((instruction, index) => <li key={index}><span>{index + 1}</span><p>{instruction.replace(/^\d+[.)]\s*/, "")}</p></li>)}</ol></section>
    {recipe.notes.length > 0 && <section className="family-note"><MessageCircle aria-hidden="true" /><div><h3>Good to know</h3>{recipe.notes.map((note) => <p key={note}>{note}</p>)}</div></section>}
    {nutrition && Object.values(nutrition).some(Boolean) && <section><h3>Nutrition</h3><div className="nutrition-grid">
      {nutrition.servings && <div><strong>{nutrition.servings}</strong><span>Serving</span></div>}{nutrition.calories && <div><strong>{nutrition.calories}</strong><span>Calories</span></div>}{nutrition.protein && <div><strong>{nutrition.protein}g</strong><span>Protein</span></div>}{nutrition.carbs && <div><strong>{nutrition.carbs}g</strong><span>Carbs</span></div>}{nutrition.fat && <div><strong>{nutrition.fat}g</strong><span>Fat</span></div>}{nutrition.fiber && <div><strong>{nutrition.fiber}g</strong><span>Fiber</span></div>}
    </div></section>}
  </div>;
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
    <header className="topbar"><a className="brand" href="#top" aria-label="Our Family Meals home"><span><ChefHat aria-hidden="true" /></span><strong>Our Family Meals</strong></a><div className="family-count"><Users aria-hidden="true" /> Made for our family</div></header>
    <section className="hero" id="top">
      <div className="hero-copy"><p className="eyebrow"><BookOpen aria-hidden="true" /> Our kitchen, collected</p><h1>What should we make?</h1><p>Family favorites, old standbys, and the recipes we want to remember—all in one place.</p><div className="search-wrap"><Search aria-hidden="true" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search recipes or ingredients…" aria-label="Search recipes or ingredients" /></div></div>
      <div className="hero-image"><Image src="/family-table.png" alt="A family table filled with homemade dishes" fill priority sizes="(max-width: 760px) 100vw, 48vw" /><span>{recipes.length} recipes</span></div>
    </section>
    <section className="library" aria-label="Recipe library">
      <div className="browse-filters">
        <Button className="all-recipes" size="sm" variant={filter === "All Recipes" ? "default" : "outline"} onClick={() => setFilter("All Recipes")} aria-pressed={filter === "All Recipes"}>All Recipes</Button>
        <div className="filter-group"><p>By meal</p><div className="filters" aria-label="Filter by meal type">{mealTypes.map((item) => <Button key={item} size="sm" variant={filter === item ? "default" : "outline"} onClick={() => setFilter(item)} aria-pressed={filter === item}>{item}</Button>)}</div></div>
        <div className="filter-group"><p>By protein</p><div className="filters" aria-label="Filter by protein">{proteinTypes.map((item) => <Button key={item} size="sm" variant={filter === item ? "default" : "outline"} onClick={() => setFilter(item)} aria-pressed={filter === item}>{item}</Button>)}</div></div>
      </div>
      <div className="results-heading"><div><p className="eyebrow">Recipe box</p><h2>{filter}</h2></div><p>{filtered.length} {filtered.length === 1 ? "recipe" : "recipes"}</p></div>
      {filtered.length ? <div className="recipe-grid">{filtered.map((recipe) => { const groups = recipeGroups(recipe); return <Sheet key={recipe.id}><SheetTrigger asChild><button className="recipe-card"><span className="card-body"><span className="card-category">{groups.meals.join(" · ")} · {groups.protein}</span><strong>{recipe.title}</strong><span className="ingredient-preview">{recipe.ingredients.slice(0, 3).map((i) => i.name).join(" · ") || "Open for the recipe"}</span></span><span className="open-recipe">View recipe <span aria-hidden="true">→</span></span></button></SheetTrigger><SheetContent className="recipe-sheet sm:max-w-2xl"><SheetHeader className="recipe-sheet-header"><SheetDescription>{recipe.source}</SheetDescription><SheetTitle>{recipe.title}</SheetTitle></SheetHeader><RecipeDetail recipe={recipe} /></SheetContent></Sheet>; })}</div> : <div className="empty-state"><Search aria-hidden="true" /><h3>No recipes found</h3><p>Try another ingredient or choose a different category.</p><Button variant="outline" onClick={() => { setQuery(""); setFilter("All Recipes"); }}>Clear search</Button></div>}
    </section>
    <footer>Collected with love for the people around our table.</footer>
  </main>;
}
