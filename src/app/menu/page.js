import MenuPage from "@/components/template/MenuPage";

async function Menu() {
  const res = await fetch("http://localhost:4000/data");
  const data = await res.json();

  return <MenuPage data={data} />;
}

export default Menu;
