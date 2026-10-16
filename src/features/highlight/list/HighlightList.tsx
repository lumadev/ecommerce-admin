import { Highlight } from "../types/highlight.types";
import HighlightCard from "./HighlightCard";

interface Props {
  highlights: Highlight[];
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => Promise<void>;
}

const HighlightList = ({ highlights, onIncrease, onDecrease, onRemove }: Props) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {highlights.map((highlight, index) => (
        <HighlightCard
          key={highlight.id}
          highlight={highlight}
          index={index}
          isFirst={index === 0}
          isLast={index === highlights.length - 1}
          onIncrease={onIncrease}
          onDecrease={onDecrease}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

export default HighlightList;
