import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import playBtn from "../assets/images/play.svg";

import { stories, mediaUrl, storyPath, type Story } from "../content";
import rightArrow from "../assets/images/chevron-right.svg";
import leftArrow from "../assets/images/chevron-left.svg";
import close from "../assets/images/cancel icon.svg";
import SmartImage from "../components/SmartImage";
import LightboxMedia, { LightboxItem } from "../components/LightboxMedia";
import { useLightbox } from "../hooks/useLightbox";
import { handleRowKeys } from "../hooks/useKeyboard";

export default function StoryPage() {
  const params = useParams();

  // Memoised so the story object is stable between renders
  const data: Story | null = useMemo(
    () => stories.find((item) => storyPath(item) === params.title) ?? null,
    [params.title]
  );

  // The story's own content is the first tab; `tabs` adds more after it
  const sections = useMemo(() => (data ? [data, ...(data.tabs ?? [])] : []), [data]);
  const [tab, setTab] = useState(0);
  const section = sections[tab] ?? null;

  // Combine images and videos for easy navigation
  // src is the full image or HLS playlist for the lightbox; preview is the small slider image
  const media: (LightboxItem & { preview: string })[] = useMemo(
    () =>
      section
        ? [
            ...(section.videos ?? []).map((v) => ({
              type: "video" as const,
              src: mediaUrl(v.src.hls),
              thumb: mediaUrl(v.thumb.full),
              preview: mediaUrl(v.thumb.thumb),
              width: v.src.width,
              height: v.src.height,
            })),
            ...section.images.map((image) => ({
              type: "image" as const,
              src: mediaUrl(image.full),
              preview: mediaUrl(image.thumb),
              width: image.width,
              height: image.height,
            })),
          ]
        : [],
    [section]
  );

  const lightbox = useLightbox(media.length);
  const currentIndex = lightbox.index;
  const swipeDirection = lightbox.direction;

  if (!data || !section) {
    return <h1>Loading</h1>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="w-full h-full flex flex-col py-6 justify-center items-center"
    >
      <div className="bg-dark-green border-accent-green border-(length:--line-hair) xl:h-[90%] h-full w-full flex justify-center items-center py-7">
        <div className="w-[90%] gap-7 xl:gap-16 flex h-[80%] justify-center items-start">
          {/* Cover Image */}
          <div className="w-[50%] h-full">
            <SmartImage
              key={section.coverImage.full}
              src={mediaUrl(section.coverImage.full)}
              fetchPriority="high"
              alt="Cover"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Story Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="w-[60%] flex flex-col h-full gap-[0.5cqw]"
          >
            <h1 className="text-[2.8cqw] font-bold w-full text-left xl:text-[100px] text-white">
              {data.title}
            </h1>

            {sections.length > 1 && (
              <div role="tablist" className="flex gap-[0.8cqw] mb-[0.5cqw]">
                {sections.map((s, idx) => (
                  <button
                    key={s.title}
                    type="button"
                    role="tab"
                    aria-selected={idx === tab}
                    onClick={() => setTab(idx)}
                    className={`px-[1.5cqw] py-[0.5cqw] text-[0.9cqw] cursor-pointer border-accent-green border-(length:--line-1) duration-200 transition-all ${
                      idx === tab
                        ? "bg-accent-green text-dark-green"
                        : "text-white hover:bg-accent-green/20"
                    }`}
                  >
                    {s.title}
                  </button>
                ))}
              </div>
            )}

            <div
              className={`border-accent-green border-(length:--line-hair) max-w-full flex justify-center items-center mb-3 ${
                sections.length > 1 ? "min-h-[52%] max-h-[52%]" : "min-h-[60%] max-h-[60%]"
              }`}
            >
              <div key={tab} className="overflow-y-auto custom-scrollbar h-[80%] w-[95%] xl:text-[40px]">
                {section.text && (
                  <p className="text-white text-[1cqw] xl:text-[0.9cqw] p-3">
                    {section.text} <br />
                    {section.title === "Making More Health" && (
                      <>
                        <br />
                        Continuing the journey in 2024.
                      </>
                    )}
                  </p>
                )}

                {/* Render lists if they exist */}
                {section.lists && section.lists.length > 0 && (
                  <div className="flex flex-col gap-[1cqw] mt-4 p-3">
                    {section.lists.map((list, idx) => (
                      <div key={idx} className="flex flex-col gap-[0.5cqw]">
                        <h3 className="font-semibold text-white text-[1cqw] xl:text-[0.9cqw]">
                          {list.listHead}:
                        </h3>
                        <ul className="list-disc pl-5 flex flex-col gap-[0.5cqw] text-[1cqw] xl:text-[0.9cqw] text-white">
                          {list.listPoints.map((point, pIdx) => (
                            <li key={pIdx}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Media Slider */}
            {media.length > 0 && (
              <div
                key={tab}
                className="flex w-full h-[40%] overflow-x-auto gap-4 custom-scrollbar-y"
                onKeyDown={handleRowKeys}
              >
                {media.map((item, idx) => (
                  <button
                    key={`${item.src}-${idx}`}
                    ref={lightbox.thumbRef(idx)}
                    type="button"
                    data-row-item
                    aria-label={`Open ${item.type === "video" ? "video" : "photo"} ${idx + 1} of ${media.length}`}
                    onClick={() => lightbox.open(idx)}
                    className="thumb-focus relative shrink-0 cursor-zoom-in outline-hidden"
                  >

                    {item.type === "video" ? (
                      <div className="relative h-full">
                        <SmartImage
                          src={item.preview}
                          loading="lazy"
                          className="min-w-[15cqw] h-full object-cover cursor-zoom-in"
                          alt="Video Thumbnail"
                        />
                        <img
                          src={playBtn}
                          alt="Play Button"
                          className="cursor-zoom-in absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[4cqw] h-[4cqw] bg-black/40 rounded-full"
                        />
                      </div>
                    ) : (
                      <SmartImage
                        src={item.preview}
                        loading="lazy"
                        alt="Story Image"
                        className="min-w-[16.2cqw] h-full object-cover cursor-zoom-in"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Modal for media viewer */}
      <AnimatePresence>
      {currentIndex !== null && (
        <motion.div
          key="lightbox"
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)", transition: { duration: 0.3, delay: 0.1 } }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          ref={lightbox.dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Media viewer"
          tabIndex={-1}
          className="fixed inset-0 flex justify-center items-center bg-dark-green/95 z-50 text-accent-green outline-hidden"
          onClick={(e) => {
            if (!(e.target as HTMLElement).closest("[data-lightbox-frame], button")) lightbox.close();
          }}
        >
          {/* Close Button */}
          <motion.button
            type="button"
            aria-label="Close (Esc)"
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0, transition: { duration: 0.4, delay: 0.15 } }}
            exit={{ opacity: 0, rotate: -90, transition: { duration: 0.2 } }}
            whileHover={{ rotate: 90, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            // Big round hit area around the thin icon; negative margin keeps the icon where it was
            className="absolute xl:right-20 xl:top-20 right-10 top-10 cursor-pointer p-[1.2cqw] -m-[1.2cqw] rounded-full hover:bg-white/10 transition-colors"
            onClick={lightbox.close}
          >
            <img src={close} alt="" className="w-[1.5cqw] h-auto" />
          </motion.button>

          {/* Prev Button */}
          <button
            onClick={lightbox.prev}
            aria-label="Previous (←)"
            disabled={currentIndex === 0}
            className={`absolute left-8 cursor-pointer z-50 text-accent-green p-[1cqw] -m-[1cqw] rounded-full hover:bg-white/10 transition-colors ${
              currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <img src={leftArrow} alt="" className="w-[3cqw] h-auto" />
          </button>

          {/* Media Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
            exit={{ opacity: 0, scale: 0.94, y: 24, filter: "blur(8px)", transition: { duration: 0.25, ease: "easeIn" } }}
            className="h-[90%] w-full flex justify-center items-center"
          >
          <motion.div
            key={currentIndex}
            initial={swipeDirection ? { opacity: 0, x: swipeDirection === "left" ? 100 : -100 } : false}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: swipeDirection === "left" ? -100 : 100 }}
            transition={{ duration: 0.5 }}
            className="h-full w-auto flex justify-center items-center"
          >
            <LightboxMedia
              media={media}
              index={currentIndex}
              className="w-auto border-accent-green border-(length:--line-2)"
            />
          </motion.div>
          </motion.div>

          {/* Next Button */}
          <button
            onClick={lightbox.next}
            aria-label="Next (→)"
            disabled={currentIndex === media.length - 1}
            className={`absolute right-8 cursor-pointer z-50 text-accent-green p-[1cqw] -m-[1cqw] rounded-full hover:bg-white/10 transition-colors ${
              currentIndex === media.length - 1
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            <img src={rightArrow} alt="" className="w-[3cqw] h-auto" />
          </button>
        </motion.div>
      )}
      </AnimatePresence>
    </motion.div>
  );
}
