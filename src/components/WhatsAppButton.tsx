import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
}

const WhatsAppButton = ({
  phoneNumber = "1234567890",
  message = "Hello! I'm interested in one of your paintings.",
}: WhatsAppButtonProps) => {
  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message);
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodedMessage}`,
      "_blank"
    );
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-primary-foreground shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl animate-fade-up"
      aria-label="Contact on WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
    </button>
  );
};

export default WhatsAppButton;
