import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import CommissionForm from '@/components/commission/CommissionForm';
import CommissionResult from '@/components/commission/CommissionResult';
import { CommissionResultProps } from '@/types/commission';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { T } from '@/components/translation/T';

const CommissionCalculator = () => {
  const [result, setResult] = useState<Omit<CommissionResultProps, 'children'> | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      <Navbar />

      <div className="container mx-auto px-4 py-12 md:py-20">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors group"
          >
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <span className="font-medium"><T>חזרה לדף הבית</T></span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12 md:mb-16 animate-fade-in">
          <div className="inline-block relative mb-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-l from-primary via-accent to-primary bg-clip-text text-transparent">
              <T>מחשבון עמלות oFair</T>
            </h1>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-primary to-accent rounded-full animate-pulse"></div>
          </div>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            <T>חשבו בקלות את העמלה על פי המקצוע וסכום העסקה</T>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              <span><T>חישוב מיידי</T></span>
            </div>
            <div className="flex items-center gap-2 bg-accent/5 px-4 py-2 rounded-full">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
              <span><T>שקוף והוגן</T></span>
            </div>
            <div className="flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              <span><T>ללא עלויות נסתרות</T></span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
          <CommissionForm onCalculate={setResult} />
        </div>

        {/* Results */}
        {result && (
          <CommissionResult {...result} />
        )}

        {/* Info Section */}
        {!result && (
          <div className="max-w-4xl mx-auto mt-16 grid md:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '400ms' }}>
            {[
              {
                icon: '💼',
                title: 'שירותים מקצועיים',
                description: 'עמלה קבועה 10% לעורכי דין, רואי חשבון ועוד'
              },
              {
                icon: '🔧',
                title: 'שירותי בית',
                description: 'עמלות מדורגות 5-10% לפי סכום העסקה'
              },
              {
                icon: '🏗️',
                title: 'בניה ושיפוצים',
                description: 'עמלות מותאמות לפרויקטים גדולים'
              }
            ].map((item, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-primary/20 rounded-2xl p-6 text-center hover:border-primary/40 transition-all duration-300 hover:scale-105"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-lg font-bold text-primary mb-2"><T>{item.title}</T></h3>
                <p className="text-sm text-muted-foreground"><T>{item.description}</T></p>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CommissionCalculator;
