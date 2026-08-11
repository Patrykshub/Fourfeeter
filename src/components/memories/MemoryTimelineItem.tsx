import { useIntl } from "react-intl";
import type { IPost } from "../../types";
import { getTimelineDotColor, getTimelineProgress } from "../../lib/timelineGradient";
import { AdminActions } from "../common/AdminActions";

interface IMemoryTimelineItemProps {
  post: IPost;
  index: number;
  totalPosts: number;
  isAdmin: boolean;
  isExpanded: boolean;
  isHighlighted: boolean;
  onToggleExpand: (id: string) => void;
  onEdit: (post: IPost) => void;
  onDelete: (id: string) => void;
  registerRef: (id: string, el: HTMLElement | null) => void;
}

const MemoryTimelineItem = ({
  post,
  index,
  totalPosts,
  isAdmin,
  isExpanded,
  isHighlighted,
  onToggleExpand,
  onEdit,
  onDelete,
  registerRef,
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
        ref={(el) => registerRef(post.id, el)}
        onClick={() => onToggleExpand(post.id)}
        className={`bg-[#071018] rounded-xl overflow-hidden transition-shadow duration-500 cursor-pointer ${
          isRight ? "lg:col-start-2" : "lg:col-start-1"
        } ${isHighlighted ? "ring-2 ring-neon" : ""}`}
      >
        <img
          src={post.image}
          alt={post.title}
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
          <h3 className="text-xl font-semibold mt-1">{post.title}</h3>
          <p
            className={`mt-2 text-gray-300 text-sm whitespace-pre-wrap ${
              isExpanded ? "" : "line-clamp-3"
            }`}
          >
            {post.content}
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(post.id);
            }}
            className="mt-2 text-xs text-neon"
          >
            {intl.formatMessage({
              id: isExpanded ? "common.showLess" : "common.showMore",
            })}
          </button>
          {isAdmin && (
            <div onClick={(e) => e.stopPropagation()}>
              <AdminActions
                className="mt-4"
                onEdit={() => onEdit(post)}
                onDelete={() => onDelete(post.id)}
              />
            </div>
          )}
        </div>
      </article>
    </div>
  );
};

export { MemoryTimelineItem };
