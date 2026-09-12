import { notFound } from "next/navigation";
import { BookOpen, ChefHat, MessageCircle, Star, Users } from "lucide-react";
import recipesData from "../../data/recipes.json";
import RecipeExperience, { PrintRecipeButton } from "./RecipeExperience";

type Ingredient = { amount: string; name: string; note: string };
type Nutrition = { servings?: string | number | null; calories?: number | null; protein?: number | null; fat?: number | null; carbs?: number | null; fiber?: number | null; sodium?: number | null };
type Recipe = { id: string; title: string; category: string; meal: string; protein: string; tags: string[]; ingredients: Ingredient[]; instructions: string[]; notes: string[]; rating: number | null; nutrition: Nutrition | null; source: string };

const recipes = recipesData as Recipe[];
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function generateStaticParams() {
  return recipes.map((recipe) => ({ id: recipe.id }));
}

export default async function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const recipe = recipes.find((item) => item.id === id);
  if (!recipe) notFound();

  const meals = recipe.meal.split(",").map((item) => item.trim()).filter(Boolean);
  const nutrition = recipe.nutrition;

  return <main>
    <header className="topbar no-print"><a className="brand" href={`${basePath}/`} aria-label="The Caffey Clan Kitchen home"><span><ChefHat aria-hidden="true" /></span><strong>The Caffey Clan Kitchen</strong></a><nav className="topbar-nav" aria-label="Main navigation"><a href={`${basePath}/`}>Meet the Clan</a><a href={`${basePath}/recipes/`}>Recipe Box</a></nav><div className="topbar-actions"><div className="family-count"><Users aria-hidden="true" /> Made for our clan</div><a className="recipe-box-link" href={`${basePath}/recipes/`}>All Recipes</a></div></header>

    <article className="recipe-post">
      <header className="recipe-post-header"><a className="back-to-recipes no-print" href={`${basePath}/recipes/`}>← Back to the Recipe Box</a><p className="eyebrow"><BookOpen aria-hidden="true" /> Family recipe</p><h1>{recipe.title}</h1><div className="detail-tags">{meals.map((meal) => <span key={meal}>{meal}</span>)}{recipe.protein && <span>{recipe.protein}</span>}{recipe.rating && <span><Star aria-hidden="true" /> {recipe.rating}/5</span>}</div></header>

      <div className="print-title"><p>The Caffey Clan Kitchen</p><h1>{recipe.title}</h1></div>
      <PrintRecipeButton />

      <div className="recipe-card-page">
        <section><h2>Ingredients</h2><ul className="ingredient-list">{recipe.ingredients.map((ingredient, index) => <li key={`${ingredient.name}-${index}`}>{ingredient.amount && <strong>{ingredient.amount}</strong>}<span>{ingredient.name}</span>{ingredient.note && <em>{ingredient.note}</em>}</li>)}</ul></section>
        <section><h2>Directions</h2><ol className="instruction-list">{recipe.instructions.map((instruction, index) => <li key={index}><span>{index + 1}</span><p>{instruction.replace(/^\d+[.)]\s*/, "")}</p></li>)}</ol></section>
        {recipe.notes.length > 0 && <section className="family-note"><MessageCircle aria-hidden="true" /><div><h2>Recipe Notes</h2>{recipe.notes.map((note) => <p key={note}>{note}</p>)}</div></section>}
        {nutrition && Object.values(nutrition).some(Boolean) && <section><h2>Nutrition</h2><div className="nutrition-grid">{nutrition.servings && <div><strong>{nutrition.servings}</strong><span>Serving</span></div>}{nutrition.calories && <div><strong>{nutrition.calories}</strong><span>Calories</span></div>}{nutrition.protein && <div><strong>{nutrition.protein}g</strong><span>Protein</span></div>}{nutrition.carbs && <div><strong>{nutrition.carbs}g</strong><span>Carbs</span></div>}{nutrition.fat && <div><strong>{nutrition.fat}g</strong><span>Fat</span></div>}{nutrition.fiber && <div><strong>{nutrition.fiber}g</strong><span>Fiber</span></div>}</div></section>}
      </div>
      <RecipeExperience recipeId={recipe.id} recipeTitle={recipe.title} />
    </article>
    <footer className="no-print">Collected with love for the people around our table.</footer>
  </main>;
}
