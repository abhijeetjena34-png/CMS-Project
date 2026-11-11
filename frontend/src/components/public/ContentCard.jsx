import { Link } from 'react-router-dom';

const ContentCard = ({ item }) => {
  const fallbackImg = `https://placehold.co/600x400/f1f5f9/64748b?text=${encodeURIComponent(item.category || 'Article')}`;

  return (
    <article className="h-full">
      <Link
        to={`/articles/${item._id}`}
        className="group h-full flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200"
      >
        {/* Image with 16:10 aspect ratio */}
        <div className="aspect-[16/10] w-full overflow-hidden bg-slate-100 relative">
          <img
            src={item.image || fallbackImg}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300 ease-out"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = fallbackImg;
            }}
          />
        </div>

        {/* Card Body */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
              {item.category}
            </span>
            <div className="flex items-center text-xs text-slate-500 gap-1.5">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.253 18.75m3-18.75H3.75a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 003.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3z" />
              </svg>
              <time dateTime={item.createdAt}>
                {new Date(item.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </time>
            </div>
          </div>

          <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2 leading-snug">
            {item.title}
          </h3>

          <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 mb-4 flex-1">
            {item.description}
          </p>

          <div className="pt-3 border-t border-slate-100 flex items-center text-sm font-semibold text-blue-600 group-hover:text-blue-700">
            <span>Read Article</span>
            <svg
              className="w-4 h-4 ml-1.5 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default ContentCard;
