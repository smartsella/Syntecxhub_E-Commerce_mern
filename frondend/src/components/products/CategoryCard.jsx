import { Link } from "react-router-dom";

const categoryImages = {
  electronics:
    "https://images.unsplash.com/photo-1587202372775-98927f19f347?auto=format&fit=crop&w=600&q=80", // Laptop + RGB
  fashion:
    "https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=600&q=80", // Clothes rack
  home: "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=600&q=80", // Home interior
  sports:
    "https://images.unsplash.com/photo-1584467735815-f0a5107171f2?auto=format&fit=crop&w=600&q=80", // Football gear
  default:
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80", // Shopping misc
};

const CategoryCard = ({ title, slug }) => {
  const img = categoryImages[slug] || categoryImages.default;

  return (
    <Link
      to={`/shop?category=${slug}`}
      className="group block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition"
    >
      <div className="h-40 overflow-hidden">
        <img
          src={img}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
      </div>

      <div className="p-4 text-center">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">Explore Now</p>
      </div>
    </Link>
  );
};

export default CategoryCard;
