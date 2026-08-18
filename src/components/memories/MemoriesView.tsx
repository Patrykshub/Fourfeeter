import { useState } from "react";
import { useIntl } from "react-intl";
import type { IPost } from "../../types";
import type { IPostDisplay } from "../../lib/postLocalization";
import { TIMELINE_LINE_GRADIENT } from "../../lib/timelineGradient";
import { AddNewButton } from "../common/AddNewButton";
import { PageSection } from "../common/PageSection";
import { MemoryTimelineItem } from "./MemoryTimelineItem";
import { ReadingModal } from "./ReadingModal";
import { PageBanner } from "../common/PageBanner";

interface IMemoriesViewProps {
  posts: IPostDisplay[];
  isAdmin: boolean;
  onEdit: (post: IPost) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  highlightId?: string | null;
  banner: string | null;
  onChangeBanner: (url: string) => void;
}

export const MemoriesView = ({
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
  const [modalPost, setModalPost] = useState<IPostDisplay | null>(
    () => posts.find((p) => p.id === highlightId) ?? null,
  );

  const header = (
    <PageBanner image={banner} isAdmin={isAdmin} onChangeImage={onChangeBanner}>
      <AddNewButton isAdmin={isAdmin} onClick={onAdd} />
    </PageBanner>
  );

  return (
    <PageSection
      header={header}
      isEmpty={posts.length === 0}
      emptyMessage={intl.formatMessage({ id: "memories.emptyState" })}
      isAdmin={isAdmin}
      onAdd={onAdd}
    >
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
              onOpenPost={setModalPost}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </div>

      {modalPost && (
        <ReadingModal
          image={modalPost.image}
          title={modalPost.displayTitle}
          content={modalPost.displayContent}
          date={intl.formatDate(modalPost.date, {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
          isTranslated={modalPost.isTranslated}
          untranslatedLabel={intl.formatMessage({
            id: "post.untranslatedBadge",
          })}
          onClose={() => setModalPost(null)}
        />
      )}
    </PageSection>
  );
};
