import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, FileText, Star, Clock, Phone, Gift, Copy, Share2, Check } from 'lucide-react';
import { toast } from 'sonner';

const ThankYou = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [copied, setCopied] = useState(false);
  
  // Get affiliate code from URL params
  const affiliateCode = searchParams.get('affiliate_code');
  const referralLink = affiliateCode 
    ? `https://ofair.co.il/registration?ref=${affiliateCode}`
    : null;

  useEffect(() => {
    // Track conversion if needed
    const amount = searchParams.get('amount');
    const phone = searchParams.get('phone');
    if (amount || phone) {
      console.log('Registration completed:', {
        amount,
        phone,
        affiliateCode
      });
      // Add conversion tracking here (Google Analytics, Facebook Pixel, etc.)
    }
  }, [searchParams, affiliateCode]);

  const handleCopyLink = async () => {
    if (!referralLink) return;
    
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast.success('הקישור הועתק!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('לא ניתן להעתיק');
    }
  };

  const handleWhatsAppShare = () => {
    if (!referralLink) return;
    
    const message = `👋 היי!
רציתי לשתף אותך במשהו שאני נרשמתי בו לאחרונה – oFair.
זו פלטפורמה שמחברת בין בעלי מקצוע ללקוחות בצורה הוגנת, בלי מתווכים ובלי עמלות מיותרות.

יש עכשיו מבצע חבר מביא חבר על דמי ההקמה:
🎁 10% הנחה לך אם נרשמים דרך הקישור שלי
💸 ו־10% קרדיט אליי אם נרשמים עם הקוד שלי

בקצרה – מה זה oFair?
✔ שיתוף לידים בין בעלי מקצוע (ומאפשר להרוויח גם מהם)
✔ קבלת בקשות לפרויקטים ישירות מהצרכן
✔ פניות ישירות, בלי תיווך באמצע
✔ תשלום עמלה רק על עבודה שנסגרת בפועל

חשבתי שזה יכול להתאים לך, אז שווה לבדוק 👇
🔗 זה הקישור להצטרפות:
${referralLink}`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--hero-bg-start))] to-[hsl(var(--hero-bg-end))] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20 bg-">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/30 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 max-w-4xl">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <img src="/lovable-uploads/ofair-logo.png" alt="oFair Logo" className="h-20 mx-auto mb-6" />
        </div>

        {/* Main Title */}
        <div className="text-center mb-12 space-y-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/20 mb-4">
            <CheckCircle2 className="w-12 h-12 text-accent" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white">אתה בדרך להצטרף אלינו.. !</h1>
          <p className="text-2xl md:text-3xl font-semibold text-accent">
            תזכרו - אתם מרוויחים, אנחנו מרוויחים oFAIR
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Card 1 - Next Steps */}
          <Card className="glass-card border-primary/20 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl text-primary">
                <FileText className="w-6 h-6" />
                המשך התהליך
              </CardTitle>
              <CardDescription className="text-base">
                השלב הבא להצלחה שלכם
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                <p className="text-foreground">
                  קיבלתם הודעת וואטסאפ עם קישור להעלאת חשבוניות
                </p>
              </div>
              
              <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-accent" />
                  <p className="font-semibold text-foreground">העלו מינימום 5 חשבוניות</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  אבל אנחנו <strong className="text-accent text-base">ממליצים בחום כמה שיותר</strong> ⭐
                </p>
                <p className="text-sm text-muted-foreground">
                  ככל שתעלו יותר - כך נוכל לשרת אתכם טוב יותר!
                </p>
              </div>

              <Button 
                size="lg" 
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg py-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" 
                onClick={() => window.open('https://docs.ofair.co.il', '_blank')}
              >
                <FileText className="w-5 h-5 ml-2" />
                העלו חשבוניות עכשיו
              </Button>
            </CardContent>
          </Card>

          {/* Card 2 - What's Next */}
          <Card className="glass-card border-primary/20 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl text-primary">
                <Star className="w-6 h-6" />
                מה הלאה?
              </CardTitle>
              <CardDescription className="text-base">
                שלבי התהליך הבאים
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                    1
                  </div>
                  <p className="text-foreground">נשיג דירוג עליכם מלקוחות קודמים</p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                    2
                  </div>
                  <p className="text-foreground">
                    דירוג מתחת ל-4.2? <span className="font-semibold text-accent">תזוכו במלואו</span> ₪
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                    3
                  </div>
                  <div>
                    <p className="text-foreground">חשבונית נשלחה למייל שהזנתם</p>
                    <p className="text-muted-foreground mt-1 text-sm">
                      (לא הזנתם מייל? פנו אלינו בוואטסאפ 📱)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                    4
                  </div>
                  <p className="text-foreground">ניצור איתכם קשר בימים הקרובים</p>
                </div>
              </div>

              <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                <p className="text-sm text-foreground">
                  <strong className="text-lg">התהליך לוקח עד שבועיים</strong>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Affiliate Referral Card */}
        {affiliateCode && (
          <Card className="glass-card border-green-300/50 bg-gradient-to-br from-green-50/80 to-emerald-50/80 animate-fade-in mb-8" style={{ animationDelay: '0.35s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl text-green-700">
                <Gift className="w-6 h-6" />
                🎁 חבר מביא חבר
              </CardTitle>
              <CardDescription className="text-base text-green-600">
                הרוויחו 10% קרדיט על כל חבר שמצטרף דרככם!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* My Code Display */}
              <div className="bg-white/80 border-2 border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-700 mb-2 font-medium">הקוד שלי:</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-3xl font-bold tracking-wider text-green-800 bg-green-100 px-4 py-2 rounded-lg">
                    {affiliateCode}
                  </span>
                </div>
              </div>

              {/* Copy Link */}
              <div className="space-y-2">
                <p className="text-sm text-green-700 font-medium">קישור ההפניה שלי:</p>
                <div className="flex gap-2">
                  <div className="flex-1 bg-white/80 border border-green-200 rounded-lg px-3 py-2 text-sm text-green-800 truncate" dir="ltr">
                    {referralLink}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyLink}
                    className="border-green-300 text-green-700 hover:bg-green-100 shrink-0"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* WhatsApp Share Button */}
              <Button
                onClick={handleWhatsAppShare}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <Share2 className="w-5 h-5 ml-2" />
                שתף בוואטסאפ וקבל קרדיט
              </Button>

              {/* Info */}
              <div className="bg-green-100/50 border border-green-200 rounded-lg p-3 text-center">
                <p className="text-sm text-green-700">
                  🎁 החבר שלך מקבל <strong>10% הנחה</strong> על ההרשמה
                  <br />
                  💸 ואתה מקבל <strong>10% קרדיט</strong> (₪41.3) לחשבון שלך!
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <Button 
            size="lg" 
            variant="outline" 
            className="bg-card/80 backdrop-blur-md border-primary/30 hover:bg-card hover:border-primary/50 text-foreground" 
            onClick={() => window.open('https://wa.me/972505577565', '_blank')}
          >
            <Phone className="w-5 h-5 ml-2" />
            יש שאלות? דברו איתנו
          </Button>

          <Button 
            size="lg" 
            variant="ghost" 
            onClick={() => navigate('/')} 
            className="text-white hover:text-primary bg-blue-600 hover:bg-blue-500"
          >
            חזרה לעמוד הבית
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
