import { Link } from "react-router-dom";
import { mediaUrl, storyPath, type Story } from "../content";
import SmartImage from "./SmartImage";

interface StoryCardProps {
  item: Story;
}

function StoryCard({ item }: StoryCardProps) {
  return (
    <div className=" flex flex-col gap-4 xl:gap-16">
      <SmartImage
        src={mediaUrl(item.coverImage.full)}
        alt={item.title}
        className="h-[35cqh] min-w-full object-cover"
      />

      <div className="flex flex-col gap-5 xl:gap-16">
        <h2 className="text-2xl xl:text-[60px]">{item.title}</h2>

        {/* Use the line-clamp utility to limit text to 3 lines */}
        <p className="text-[1cqw] xl:text-[0.9cqw] text-white xl:leading-[1.2] line-clamp-3 ">
          {item.coverText}
        </p>

        <div>
          <Link
            relative="path"
            to={storyPath(item)}
            state={item}
            className="px-[2cqw]  py-[0.7cqw] text-[0.9cqw] border-accent-green border-(length:--line-1) hover:bg-accent-green hover:text-dark-green active:opacity-70 duration-200 transition-all"
          >
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
}

export default StoryCard;
