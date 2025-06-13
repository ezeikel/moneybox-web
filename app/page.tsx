import ProductCarousel from "@/components/ProductCarousel/ProductCarousel";
import { getCategories } from "@/lib/sanity";

export const revalidate = 60;

const Home = async () => {
  const categories = await getCategories();

  return (
    <div className="bg-moneybox-teal p-4 pt-16">
      <ProductCarousel categories={categories} />
    </div>
  );
}

export default Home;