import { Instagram } from "lucide-react";

interface InstagramButtonProps {
  instagramUrl?: string;
}

const InstagramButton = ({
  instagramUrl = "https://www.instagram.com/the_rainbow_palatte",
}: InstagramButtonProps) => {
  const handleClick = () => {
    window.open(instagramUrl, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-24 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#dc2743] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl animate-fade-up"
      aria-label="Visit Instagram"
    >
      <Instagram className="h-6 w-6" />
    </button>
  );
};

export default InstagramButton;
