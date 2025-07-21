import React from "react";

const BusinessModelSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">
            המודל העסקי שלנו
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            שקיפות מלאה. תשלומים הוגנים. הצלחה משותפת.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Price Card */}
          <div className="lg:col-span-1">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 text-right">
              <h3 className="text-2xl font-bold mb-4 text-blue-900">
                💰 דמי הרשמה חד-פעמיים
              </h3>
              <div className="flex items-center justify-end gap-4 mb-3">
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  חיסכון ₪149!
                </span>
                <span className="text-4xl font-bold text-green-600">₪350</span>
                <span className="text-3xl font-bold text-red-500 line-through">₪499</span>
              </div>
              <p className="text-blue-700 font-medium text-right">
                מחיר מיוחד לתקופה מוגבלת!
              </p>
            </div>
          </div>

          {/* Benefits */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-2xl font-bold mb-6 text-gray-900 text-right">
              🎯 מה הרישום מקנה לכם?
            </h3>
            
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h4 className="font-bold text-green-700 mb-2 text-right">✅ גישה לכל החיים ל-oFair לצרכנים:</h4>
                <ul className="text-gray-600 space-y-1 text-right">
                  <li>• הגשת הצעות מחיר לבקשות מצרכנים</li>
                  <li>• נוכחות קבועה באתר</li>
                  <li>• דירוג והצגה לפי איכות השירות</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h4 className="font-bold text-blue-700 mb-2 text-right">🚀 גישה לפלטפורמת שיתוף הלידים הראשונה בעולם:</h4>
                <ul className="text-gray-600 space-y-1 text-right">
                  <li>• תקופת הרצה בחינם</li>
                  <li>• לאחר תקופת הרצה - מנוי חודשי</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 text-white rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-6 text-center">
            💼 עמלות - רק על עסקאות סגורות!
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">10%</div>
              <h4 className="font-bold mb-2">בקשות מצרכנים</h4>
              <p className="text-gray-300 text-sm">
                גם אם זה רק עלות ביקור
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">5%</div>
              <h4 className="font-bold mb-2">לידים שהועברו</h4>
              <p className="text-gray-300 text-sm">
                ממקבלי העבודה
              </p>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <p className="text-lg font-medium text-yellow-300">
              ⭐ אנחנו מרוויחים רק כשאתם מרוויחים!
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl p-6 max-w-2xl mx-auto">
            <h4 className="text-xl font-bold mb-2">🤝 השותפות המושלמת</h4>
            <p className="text-lg">
              אנחנו לא רק פלטפורמה - אנחנו השותפים שלכם להצלחה!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessModelSection;