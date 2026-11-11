import { Link } from 'react-router-dom';

const ContentCard = ({ item }) => {
  const fallbackImg = `https://placehold.co/600x400/e2e8f0/64748b?text=${encodeURIComponent(item.category)}`;

  return (
    <Link
      to={`/articles/${item._id}`}
      className="card hover:shadow-md transition-shadow duration-200 overflow-hidden group flex flex-col"
    >
      {/* Image */}
      <div className="h-48 overflow-hidden bg-gray-100">
        <img
          src={item.image || fallbackImg}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = fallbackImg; }}
        />
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full font-semibold">
            {item.category}
          </span>
          <span className="text-xs text-gray-400">
            {new Date(item.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', year: 'numeric',
            })}
          </span>
        </div>

        <h3 className="text-base font-bold text-gray-900 leading-snug mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
          {item.title}
        </h3>

        <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 flex-1">
          {item.description}
        </p>

        <span className="mt-4 text-blue-600 text-sm font-medium group-hover:underline">
          Read more →
        </span>
      </div>
    </Link>
  );
};

export default ContentCard;

