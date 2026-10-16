import CategoriesPage from "../../components/template/CategoriesPage";

async function Categories({ searchParams }) {
  const { difficulty, time } = await searchParams;

  const res = await fetch(`http://localhost:4000/data`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  const data = await res.json();

  const filteredData = data.filter((item) => {
    const difficultyResult = item.details.some(
      (detail) => detail.Difficulty && detail.Difficulty === difficulty,
    );

    const timeResult = item.details.some((detail) => {
      const cookingTime = detail["Cooking Time"] || "";
      const timeDetail = parseInt(cookingTime, 10);

      if (time === "less") {
        return !Number.isNaN(timeDetail) && timeDetail <= 30;
      }

      if (time === "more") {
        return !Number.isNaN(timeDetail) && timeDetail > 30;
      }

      return true;
    });

    return (!difficulty || difficultyResult) && (!time || timeResult);
  });

  return <CategoriesPage data={filteredData} />;
}

export default Categories;
