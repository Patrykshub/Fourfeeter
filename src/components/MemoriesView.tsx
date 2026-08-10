import { useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import type { IPost } from "../types";
import { TIMELINE_LINE_GRADIENT } from "../lib/timelineGradient";
import { EmptyState } from "./EmptyState";
import { MemoryTimelineItem } from "./MemoryTimelineItem";
import { PageBanner } from "./PageBanner";

interface IMemoriesViewProps {
  posts: IPost[];
  isAdmin: boolean;
  onEdit: (post: IPost) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  highlightId?: string | null;
  banner: string | null;
  onChangeBanner: (url: string) => void;
}

const MemoriesView = ({
  posts,
  isAdmin,
  onEdit,
  onDelete,
  onAdd,
  highlightId,
  banner,
  onChangeBanner,
}: IMemoriesViewProps) => {
  const intl = useIntl();
  const itemRefs = useRef<Record<string, HTMLElement | null>>({});
  const [highlighted, setHighlighted] = useState(highlightId ?? null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!highlightId) return;
    itemRefs.current[highlightId]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    const timeout = setTimeout(() => setHighlighted(null), 2000);
    return () => clearTimeout(timeout);
  }, [highlightId]);

  const registerItemRef = (id: string, el: HTMLElement | null) => {
    itemRefs.current[id] = el;
  };

  const toggleExpanded = (id: string) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  const header = (
    <PageBanner image={banner} isAdmin={isAdmin} onChangeImage={onChangeBanner}>
      <div className="flex justify-between items-center">
        <h2 className="uppercase text-sm text-gray-300">
          {intl.formatMessage({ id: "memories.heading" })}
        </h2>
        {isAdmin && (
          <button onClick={onAdd} className="flex items-center gap-2 text-neon">
            {intl.formatMessage({ id: "common.addNew" })}
          </button>
        )}
      </div>
    </PageBanner>
  );

  if (posts.length === 0) {
    return (
      <section>
        {header}
        <EmptyState
          message={intl.formatMessage({ id: "memories.emptyState" })}
          isAdmin={isAdmin}
          onAdd={onAdd}
        />
      </section>
    );
  }

  return (
    <section>
      {header}

      <div className="relative">
        <div
          className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-0.5 lg:-translate-x-1/2"
          style={{ background: TIMELINE_LINE_GRADIENT }}
        />

        <div className="space-y-10">
          {posts.map((post, index) => (
            <MemoryTimelineItem
              key={post.id}
              post={post}
              index={index}
              totalPosts={posts.length}
              isAdmin={isAdmin}
              isExpanded={expandedId === post.id}
              isHighlighted={highlighted === post.id}
              onToggleExpand={toggleExpanded}
              onEdit={onEdit}
              onDelete={onDelete}
              registerRef={registerItemRef}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export { MemoriesView };
