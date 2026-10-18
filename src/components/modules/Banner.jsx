import Link from "next/link";
import styles from "./Banner.module.css";
import Image from "next/image";

function Banner() {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <h2>Foodly</h2>
        <p>Food Delivery and Takeout!</p>
        <span>
          Foodly is an online food ordering and delivery platform launched by
          Uber in 2026. Meals are delivered by couriers using cars, scooters,
          bikes, or on foot.
        </span>
        <Link href="/menu">See All</Link>
      </div>
      <div className={styles.right}>
        <Image src="/images/banner.png" width={500} height={300} alt="Food image" />
      </div>
    </div>
  );
}

export default Banner;
