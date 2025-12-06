import { Sparkles } from "lucide-react";

const CyberMondayBanner = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-3 px-4 text-center animate-pulse">
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <Sparkles className="w-5 h-5 animate-spin" />
        <span className="font-bold text-lg">🔥 מבצע Cyber Monday!</span>
        <span className="text-base">
          הרשמה ב-<span className="font-bold underline">250₪+מע"מ</span> בלבד במקום 350₪!
        </span>
        <Sparkles className="w-5 h-5 animate-spin" />
      </div>
      <p className="text-sm mt-1 opacity-90">⏰ מבצע מוגבל - אל תפספסו!</p>
    </div>
  );
};

export default CyberMondayBanner;
