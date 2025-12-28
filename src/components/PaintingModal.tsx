import { Painting } from "@/types/painting";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { MessageCircle, X } from "lucide-react";

interface PaintingModalProps {
  painting: Painting | null;
  isOpen: boolean;
  onClose: () => void;
  whatsappNumber?: string;
}

const PaintingModal = ({
  painting,
  isOpen,
  onClose,
  whatsappNumber = "1234567890",
}: PaintingModalProps) => {
  if (!painting) return null;

  const handleWhatsAppInquiry = () => {
    const message = `Hello! I'm interested in the painting "${painting.title}" by ${painting.artist} priced at ${formatPrice(painting.price)}. Is it still available?`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Section */}
          <div className="relative aspect-square md:aspect-auto md:h-full">
            <img
              src={painting.imageUrl}
              alt={painting.title}
              className="h-full w-full object-cover"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 md:hidden bg-background/80 backdrop-blur"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Details Section */}
          <div className="p-6 md:p-8 space-y-6">
            <DialogHeader className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <DialogTitle className="font-display text-2xl md:text-3xl font-bold text-foreground">
                    {painting.title}
                  </DialogTitle>
                  <p className="font-body text-lg text-muted-foreground mt-1">
                    by {painting.artist}
                  </p>
                </div>
                <Badge
                  variant={painting.available ? "default" : "secondary"}
                  className={`shrink-0 ${
                    painting.available
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {painting.available ? "Available" : "Sold"}
                </Badge>
              </div>
            </DialogHeader>

            {/* Price */}
            <div className="space-y-1">
              <p className="font-body text-sm text-muted-foreground uppercase tracking-wider">
                Price
              </p>
              <p className="font-display text-3xl font-bold text-primary">
                {formatPrice(painting.price)}
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <p className="font-body text-sm text-muted-foreground uppercase tracking-wider">
                About This Work
              </p>
              <p className="font-body text-foreground leading-relaxed">
                {painting.description}
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">
                  Medium
                </p>
                <p className="font-body text-sm text-foreground mt-1">
                  {painting.medium}
                </p>
              </div>
              <div>
                <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">
                  Dimensions
                </p>
                <p className="font-body text-sm text-foreground mt-1">
                  {painting.dimensions}
                </p>
              </div>
              <div>
                <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">
                  Category
                </p>
                <p className="font-body text-sm text-foreground mt-1">
                  {painting.category}
                </p>
              </div>
              <div>
                <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">
                  Year
                </p>
                <p className="font-body text-sm text-foreground mt-1">
                  {painting.year}
                </p>
              </div>
            </div>

            {/* CTA Button */}
            {painting.available && (
              <Button
                variant="whatsapp"
                size="lg"
                className="w-full font-body"
                onClick={handleWhatsAppInquiry}
              >
                <MessageCircle className="h-5 w-5" />
                Inquire on WhatsApp
              </Button>
            )}

            {!painting.available && (
              <div className="p-4 rounded-lg bg-muted text-center">
                <p className="font-body text-muted-foreground">
                  This painting has been sold. Contact us for similar works.
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaintingModal;
