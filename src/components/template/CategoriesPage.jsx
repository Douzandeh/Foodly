
"use client";

import styles from "./CategoriesPage.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import Card from "../modules/Card";
import Image from "next/image";

function CategoriesPage({ data }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read filters from the URL
  const difficulty = searchParams.get("difficulty") || "";
  const time = searchParams.get("time") || "";

  // Determine whether the user has applied a filter
  const isSearched = Boolean(difficulty || time);

  const searchHandler = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const selectedDifficulty = formData.get("difficulty");
    const selectedTime = formData.get("time");

    const params = new URLSearchParams();

    if (selectedDifficulty) {
      params.set("difficulty", selectedDifficulty);
    }

    if (selectedTime) {
      params.set("time", selectedTime);
    }

    const search = params.toString();

    router.push(search ? `/categories?${search}` : "/categories");
  };

  return (
    <div className={styles.container}>
      <h2>Categories</h2>

      <div className={styles.subContainer}>
        <form className={styles.select} onSubmit={searchHandler}>
          <select
            name="difficulty"
            defaultValue={difficulty}
          >
            <option value="">Difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <select
            name="time"
            defaultValue={time}
          >
            <option value="">Cooking time</option>
            <option value="more">More than 30 min</option>
            <option value="less">Less than 30 min</option>
          </select>

          <button type="submit">Search</button>
        </form>
      </div>

      <div className={styles.cards}>
        {!isSearched ? (
          <Image
            src="/images/search.png"
            alt="Search categories"
            width={300}
            height={300}
          />
        ) : data.length > 0 ? (
          data.map((food) => (
            <Card key={food.id} {...food} />
          ))
        ) : (
          <p>No foods found.</p>
        )}
      </div>
    </div>
  );
}

export default CategoriesPage;
