import { useIntl } from "react-intl";
import type { IPost } from "../../types";
import type { IPostDisplay } from "../../lib/postLocalization";
import { AdminActions } from "../common/AdminActions";

interface IMemoryTimelineItemProps {
  post: IPostDisplay;
  index: number;
  isAdmin: boolean;
  onOpenPost: (post: IPostDisplay) => void;
  onEdit: (post: IPost) => void;
  onDelete: (id: string) => void;
}

export const MemoryTimelineItem = ({
  post,
  index,
  isAdmin,
  onOpenPost,
  onEdit,
  onDelete,
}: IMemoryTimelineItemProps) => {
  const intl = useIntl();
  const imageOnRight = index % 2 === 0;

  return (
    <div
      onClick={() => onOpenPost(post)}
      className="relative pl-10 lg:pl-0 lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-center cursor-pointer group"
    >
      <img
        src={post.image}
        alt={post.displayTitle}
        loading="lazy"
        decoding="async"
        className={`w-full h-56 sm:h-64 lg:h-72 object-cover rounded-xl transition-opacity group-hover:opacity-90 ${
          imageOnRight ? "lg:col-start-2" : "lg:col-start-1"
        }`}
      />

      <div
        className={`mt-4 lg:mt-0 ${
          imageOnRight ? "lg:col-start-1 lg:row-start-1 lg:text-right" : "lg:col-start-2 lg:row-start-1"
        }`}
      >
        <h3 className="text-xl font-semibold">{post.displayTitle}</h3>
        <div className="text-base text-neon font-medium mt-1">
          {intl.formatDate(post.date, {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
        <p className="mt-2 text-gray-300 text-sm whitespace-pre-wrap line-clamp-3">
          {post.displayContent}
        </p>
        {isAdmin && (
          <div className="mt-4 flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <AdminActions
              onEdit={() => onEdit(post)}
              onDelete={() => onDelete(post.id)}
            />
            {!post.isTranslated && (
              <span className="text-xs text-amber-400">
                {intl.formatMessage({ id: "post.untranslatedBadge" })}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
