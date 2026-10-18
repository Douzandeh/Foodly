import MenuPage from "@/components/template/MenuPage";

async function Menu() {
  const res = await fetch(`${process.env.BASE_URL}/data`);
  const data = await res.json();

  return <MenuPage data={data} />;
}

export default Menu;
