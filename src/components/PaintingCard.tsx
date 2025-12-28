import { Painting } from "@/types/painting";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

interface PaintingCardProps {
  painting: Painting;
  onClick: () => void;
}

const PaintingCard = ({ painting, onClick }: PaintingCardProps) => {
  return (
    <article
      onClick={onClick}
      className="group cursor-pointer overflow-hidden rounded-xl bg-card border border-border/50 shadow-card card-hover"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={painting.imageUrl}
          alt={painting.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        {/* Availability Badge */}
        <div className="absolute top-3 right-3">
          <Badge
            variant={painting.available ? "default" : "secondary"}
            className={painting.available 
              ? "bg-accent text-accent-foreground" 
              : "bg-muted text-muted-foreground"
            }
          >
            {painting.available ? "Available" : "Sold"}
          </Badge>
        </div>

        {/* Quick View on Hover */}
        <div className="absolute inset-x-4 bottom-4 opacity-0 transition-all duration-300 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
          <p className="font-body text-sm text-primary-foreground line-clamp-2">
            {painting.description}
          </p>
        </div>
      </div>

      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 min-w-0">
            <h3 className="font-display text-lg font-semibold text-foreground truncate">
              {painting.title}
            </h3>
            <p className="font-body text-sm text-muted-foreground truncate">
              by {painting.artist}
            </p>
          </div>
          <p className="font-display text-lg font-bold text-primary shrink-0">
            {formatPrice(painting.price)}
          </p>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <Badge variant="outline" className="font-body text-xs">
            {painting.category}
          </Badge>
          <span className="font-body text-xs text-muted-foreground">
            {painting.medium}
          </span>
        </div>
      </div>
    </article>
  );
};

export default PaintingCard;
