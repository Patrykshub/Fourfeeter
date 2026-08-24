import { useState } from "react";
import { useIntl } from "react-intl";
import type { IPost } from "../../types";
import type { IPostDisplay } from "../../lib/postLocalization";
import { PageSection } from "../common/PageSection";
import { MemoryTimelineItem } from "./MemoryTimelineItem";
import { ReadingModal } from "./ReadingModal";
import { TimelineLine } from "./TimelineLine";

interface IMemoriesViewProps {
  posts: IPostDisplay[];
  isAdmin: boolean;
  onEdit: (post: IPost) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  isLoading: boolean;
  initialModalPost?: IPostDisplay | null;
  banner: string | null;
  onChangeBanner: (url: string) => void;
}

export const MemoriesView = ({
  posts,
  isAdmin,
  onEdit,
  onDelete,
  onAdd,
  isLoading,
  initialModalPost,
  banner,
  onChangeBanner,
}: IMemoriesViewProps) => {
  const intl = useIntl();
  const [modalPost, setModalPost] = useState<IPostDisplay | null>(
    () => initialModalPost ?? null,
  );

  return (
    <PageSection
      banner={banner}
      onChangeBanner={onChangeBanner}
      isEmpty={!isLoading && posts.length === 0}
      emptyMessage={intl.formatMessage({ id: "memories.emptyState" })}
      isAdmin={isAdmin}
      onAdd={onAdd}
    >
      <div className="pt-16 pb-32">
        <div className="relative">
          <TimelineLine />

          <div className="space-y-10">
            {posts.map((post, index) => (
              <MemoryTimelineItem
                key={post.id}
                post={post}
                index={index}
                isAdmin={isAdmin}
                onOpenPost={setModalPost}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
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
          closeLabel={intl.formatMessage({ id: "common.close" })}
          onClose={() => setModalPost(null)}
        />
      )}
    </PageSection>
  );
};
