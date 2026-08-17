import { useState } from "react";
import { useIntl } from "react-intl";
import type { IPost } from "../../types";
import { useLocale } from "../../i18n/LocaleContext";
import { getPostContent, getPostTitle, hasPostTranslation } from "../../lib/postLocalization";
import { TIMELINE_LINE_GRADIENT } from "../../lib/timelineGradient";
import { EmptyState } from "../common/EmptyState";
import { MemoryTimelineItem } from "./MemoryTimelineItem";
import { ReadingModal } from "./ReadingModal";
import { PageBanner } from "../common/PageBanner";

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
  const { locale } = useLocale();
  const [modalPost, setModalPost] = useState<IPost | null>(
    () => posts.find((p) => p.id === highlightId) ?? null,
  );

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
          title={getPostTitle(modalPost, locale) ?? intl.formatMessage({ id: "post.missingTranslationTitle" })}
          content={getPostContent(modalPost, locale) ?? intl.formatMessage({ id: "post.missingTranslationContent" })}
          date={intl.formatDate(modalPost.date, { day: "numeric", month: "long", year: "numeric" })}
          isTranslated={hasPostTranslation(modalPost, locale)}
          untranslatedLabel={intl.formatMessage({ id: "post.untranslatedBadge" })}
          onClose={() => setModalPost(null)}
        />
      )}
    </section>
  );
};

export { MemoriesView };
