import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, FileText, Star, Clock, Phone } from 'lucide-react';

const ThankYou = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Track conversion if needed
    const amount = searchParams.get('amount');
    const phone = searchParams.get('phone');
    
    if (amount || phone) {
      console.log('Registration completed:', { amount, phone });
      // Add conversion tracking here (Google Analytics, Facebook Pixel, etc.)
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--hero-bg-start))] to-[hsl(var(--hero-bg-end))] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/30 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 max-w-4xl">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <img 
            src="/lovable-uploads/ofair-logo.png" 
            alt="oFair Logo" 
            className="h-20 mx-auto mb-6"
          />
        </div>

        {/* Main Title */}
        <div className="text-center mb-12 space-y-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/20 mb-4">
            <CheckCircle2 className="w-12 h-12 text-accent" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            תודה על האמון, ביחד בעז"ה נגדל ביחד
          </h1>
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
                    <p className="text-xs text-muted-foreground mt-1">
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
                  <strong>התהליך לוקח עד שבועיים</strong>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

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
            className="text-white hover:text-primary hover:bg-white/10"
            onClick={() => navigate('/')}
          >
            חזרה לעמוד הבית
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
