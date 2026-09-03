# Adding a family recipe

Each recipe is one ordinary text file. You can edit these files directly on GitHub—no coding is required.

1. Open `TEMPLATE.md` and choose **Copy raw file**.
2. Return to the `recipes` folder and choose **Add file → Create new file**.
3. Name it with lowercase words and dashes, such as `grandmas-chicken-soup.md`.
4. Paste the template, replace its example text, and select **Commit changes**.

## Category choices

- `meals`: Breakfast, Lunch, Dinner, Sides, Dessert, Homemade Mixes. A recipe can use more than one, separated by commas.
- `protein`: Vegetarian, Poultry, Red Meat, or Seafood.
- `tags`: Add any helpful descriptions, separated by commas.

## Ingredient format

Write one ingredient per line using three parts separated by `|`:

```text
- amount | ingredient | optional note
```

Example:

```text
- 2 cups | all-purpose flour | spooned and leveled
```

Leave the last section empty when there is no note:

```text
- 1 teaspoon | salt |
```

The website rebuilds itself after a recipe file is committed.
