import { useIntl } from "react-intl";
import type { IPost } from "../../types";
import type { IPostDisplay } from "../../lib/postLocalization";
import { getTimelineDotColor, getTimelineProgress } from "../../lib/timelineGradient";
import { AdminActions } from "../common/AdminActions";

interface IMemoryTimelineItemProps {
  post: IPostDisplay;
  index: number;
  totalPosts: number;
  isAdmin: boolean;
  onOpenPost: (post: IPostDisplay) => void;
  onEdit: (post: IPost) => void;
  onDelete: (id: string) => void;
}

export const MemoryTimelineItem = ({
  post,
  index,
  totalPosts,
  isAdmin,
  onOpenPost,
  onEdit,
  onDelete,
}: IMemoryTimelineItemProps) => {
  const intl = useIntl();
  const isRight = index % 2 === 1;
  const dotColor = getTimelineDotColor(getTimelineProgress(index, totalPosts));

  return (
    <div className="relative pl-10 lg:pl-0 lg:grid lg:grid-cols-2 lg:gap-x-12">
      <span
        className="absolute left-4 lg:left-1/2 top-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ backgroundColor: dotColor }}
      />
      <article
        onClick={() => onOpenPost(post)}
        className={`bg-surface rounded-xl overflow-hidden transition-shadow duration-500 cursor-pointer ${
          isRight ? "lg:col-start-2" : "lg:col-start-1"
        }`}
      >
        <img
          src={post.image}
          alt={post.displayTitle}
          className="w-full h-56 sm:h-64 lg:h-72 object-cover"
        />
        <div className="p-5">
          <div className="text-xs text-neon font-medium">
            {intl.formatDate(post.date, {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
          <h3 className="text-xl font-semibold mt-1">{post.displayTitle}</h3>
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
      </article>
    </div>
  );
};
