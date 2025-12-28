import { useState, useMemo } from "react";
import { useGallery } from "@/context/GalleryContext";
import { Painting, SortOption } from "@/types/painting";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PaintingCard from "@/components/PaintingCard";
import PaintingModal from "@/components/PaintingModal";
import GalleryFilters from "@/components/GalleryFilters";
import WhatsAppButton from "@/components/WhatsAppButton";
import InstagramButton from "@/components/InstagramButton";
import { Palette } from "lucide-react";
import heroImage from "@/assets/hero-gallery.jpg";

const Index = () => {
  const { paintings, loading } = useGallery();
  const [selectedPainting, setSelectedPainting] = useState<Painting | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  const filteredAndSortedPaintings = useMemo(() => {
    let result = [...paintings];

    // Filter by category
    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by availability
    if (showAvailableOnly) {
      result = result.filter((p) => p.available);
    }

    // Sort
    switch (sortOption) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "name":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return result;
  }, [paintings, selectedCategory, sortOption, showAvailableOnly]);

  const handlePaintingClick = (painting: Painting) => {
    setSelectedPainting(painting);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPainting(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Hero Image Background */}
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Art Gallery" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
        </div>

        <div className="container relative py-20 md:py-32">
          <div className="max-w-2xl space-y-6 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 backdrop-blur-sm text-primary">
              <Palette className="h-4 w-4" />
              <span className="font-body text-sm font-medium">Original Artworks</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Discover Extraordinary{" "}
              <span className="text-gradient">Art</span>
            </h1>

            <p className="font-body text-lg md:text-xl text-muted-foreground max-w-xl">
              Explore our curated collection of original paintings from talented artists.
              Each piece tells a unique story waiting to grace your space.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-12 md:py-16">
        <div className="container">
          <GalleryFilters
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            sortOption={sortOption}
            onSortChange={setSortOption}
            showAvailableOnly={showAvailableOnly}
            onAvailabilityChange={setShowAvailableOnly}
            totalCount={paintings.length}
            filteredCount={filteredAndSortedPaintings.length}
          />

          {/* Paintings Grid */}
          {loading ? (
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/5] bg-muted rounded-xl" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedPaintings.map((painting, index) => (
                <div
                  key={painting.id}
                  className="opacity-0 animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <PaintingCard
                    painting={painting}
                    onClick={() => handlePaintingClick(painting)}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredAndSortedPaintings.length === 0 && (
            <div className="text-center py-16">
              <p className="font-display text-2xl text-muted-foreground">
                No paintings found
              </p>
              <p className="font-body text-muted-foreground mt-2">
                Try adjusting your filters to see more results
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Painting Detail Modal */}
      <PaintingModal
        painting={selectedPainting}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Footer */}
      <Footer />

      {/* Floating Social Buttons */}
      <InstagramButton />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
