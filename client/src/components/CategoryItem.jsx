import { Link } from "react-router-dom";

const CategoryItem = ({ category }) => {
  return (
    <div className="group relative h-96 w-full overflow-hidden rounded-lg">
      <Link to={`/category/${category.slug}`}>
        <div className="h-full w-full cursor-pointer">
          <div className="absolute inset-0 z-10 bg-linear-to-b from-transparent to-gray-900 opacity-50" />
          {category.imageUrl ? (
            <img
              src={category.imageUrl}
              alt={category.name}
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-800/60 to-gray-950 px-6 text-center text-3xl font-semibold text-white">
              {category.name}
            </div>
          )}
          <div className="absolute right-0 bottom-0 left-0 z-20 p-4">
            <h3 className="mb-2 text-2xl font-bold text-white">
              {category.name}
            </h3>
            <p className="text-sm text-gray-200">Explore {category.name}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CategoryItem;
