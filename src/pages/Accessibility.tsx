import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Accessibility = () => {
  return (
    <div className="min-h-screen bg-background py-12 px-4" dir="rtl">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ArrowRight className="h-4 w-4" />
              חזרה לדף הבית
            </Button>
          </Link>
        </div>

        <div className="bg-card rounded-xl shadow-lg p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
            הצהרת נגישות – פלטפורמת oFair
          </h1>
          <p className="text-muted-foreground mb-8">עודכן לאחרונה: פברואר 2025</p>

          <div className="prose prose-lg max-w-none text-foreground">
            <p className="text-lg leading-relaxed mb-8">
              אנו ב-oFair רואים חשיבות עליונה במתן שירות שוויוני לכלל המשתמשים ובשיפור השירות הניתן לאנשים עם מוגבלות. אנו משקיעים משאבים רבים בהנגשת האתר והמערכת על מנת להפוך אותם לזמינים, נוחים וידידותיים לשימוש עבור אנשים עם מוגבלויות, מתוך אמונה כי לכל אדם מגיעה הזכות לחיות בכבוד, בשוויון, בנוחות ובעצמאות.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">רמת הנגישות באתר</h2>
              <p>
                האתר מונגש בהתאם להוראות חוק שוויון זכויות לאנשים עם מוגבלות, תשנ"ח-1998 ולתקנות שהותקנו מכוחו. ההתאמות בוצעו על פי התקן הישראלי (ת"י 5568) לנגישות תכנים באינטרנט ברמת AA, ובהתאם למסמך הקווים המנחים של הארגון הבינלאומי (WCAG 2.0).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">התאמות הנגישות שבוצעו באתר</h2>
              <p className="mb-4">באתר זה בוצעו התאמות נגישות הכוללות בין היתר:</p>
              <ul className="list-disc list-inside space-y-3 mr-4">
                <li>
                  <strong>תמיכה בדפדפנים ומכשירים:</strong> האתר מותאם לצפייה בכל הדפדפנים הנפוצים (Chrome, Firefox, Edge, Safari) וכן מותאם לשימוש במכשירים ניידים (סמארטפונים) וטאבלטים.
                </li>
                <li>
                  <strong>ניווט מקלדת:</strong> אפשרות לניווט מלא באתר באמצעות המקלדת בלבד (Tab, Arrows, Enter) ללא צורך בשימוש בעכבר.
                </li>
                <li>
                  <strong>תוכן חזותי:</strong> לכל התמונות והכפתורים הגרפיים באתר קיים טקסט חלופי (Alt Text) למטרת הקראה על ידי קוראי מסך.
                </li>
                <li>
                  <strong>עיצוב וניגודיות:</strong> האתר עוצב תוך שימוש בניגודיות צבעים ברורה, ומאפשר שינוי גודל הגופנים באמצעות הדפדפן (Ctrl + / Ctrl -).
                </li>
                <li>
                  <strong>מבנה האתר:</strong> מבנה הכותרות והתוכן מסודר בצורה היררכית וברורה כדי להקל על ההתמצאות בעמוד.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">סייג לנגישות</h2>
              <p>
                למרות מאמצינו להנגיש את כלל הדפים והתכנים באתר, ייתכן כי יתגלו חלקים או יכולות שטרם הונגשו במלואם, או שטרם נמצא עבורם הפתרון הטכנולוגי המתאים (למשל, מסמכים ישנים או תכנים המוזנים על ידי צד שלישי). אנו ממשיכים במאמצים לשפר את נגישות האתר כחלק ממחויבותנו לאפשר שימוש בו לכלל האוכלוסייה, כולל אנשים עם מוגבלויות.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">דרכי פנייה לבקשות והצעות שיפור בנושא נגישות</h2>
              <p className="mb-4">
                אם נתקלתם בבעיה או בתקלה כלשהי בנושא הנגישות, או אם אתם זקוקים לעזרה בביצוע פעולה באתר, נשמח שתעדכנו אותנו ואנו נעשה כל מאמץ למצוא עבורכם פתרון מתאים ולטפל בתקלה בהקדם.
              </p>
              <p className="mb-4">ניתן לפנות לרכז הנגישות של oFair באמצעים הבאים:</p>
              <ul className="list-disc list-inside space-y-2 mr-4 mb-4">
                <li>
                  <strong>דואר אלקטרוני:</strong>{" "}
                  <a href="mailto:info@ofair.co.il" className="text-primary hover:underline">
                    info@ofair.co.il
                  </a>
                </li>
                <li>
                  <strong>טלפון:</strong>{" "}
                  <a href="tel:+972545308505" className="text-primary hover:underline">
                    054-5308505
                  </a>
                </li>
                <li>
                  <strong>פנייה דרך האתר:</strong> באמצעות עמוד "צור קשר"
                </li>
              </ul>
              <p className="mb-2">כדי שנוכל לטפל בבעיה בצורה הטובה ביותר, מומלץ לצרף לפנייה פרטים מלאים ככל הניתן:</p>
              <ul className="list-disc list-inside space-y-1 mr-4">
                <li>תיאור הבעיה.</li>
                <li>באיזה עמוד גלשתם.</li>
                <li>סוג הדפדפן ומערכת ההפעלה בהם השתמשתם.</li>
              </ul>
            </section>

            {/* English Version */}
            <hr className="my-12 border-border" />

            <h2 className="text-3xl font-bold text-primary mb-2">
              Accessibility Statement – oFair Platform
            </h2>
            <p className="text-muted-foreground mb-8">Last Updated: February 2025</p>

            <p className="text-lg leading-relaxed mb-8">
              At oFair, we see great importance in providing equal service to all users and improving the service provided to people with disabilities. We invest significant resources in making our website and platform accessible, available, comfortable, and user-friendly for people with disabilities, out of the belief that every person deserves the right to live with dignity, equality, comfort, and independence.
            </p>

            <section className="mb-8">
              <h3 className="text-2xl font-semibold text-primary mb-4">Accessibility Level</h3>
              <p>
                This website has been adjusted according to the requirements of the Equal Rights for Persons with Disabilities Law, 5758-1998, and the regulations enacted under it. The adjustments were made according to the Israeli Standard (IS 5568) for Web Content Accessibility at Level AA, and in accordance with the international Web Content Accessibility Guidelines (WCAG 2.0).
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-2xl font-semibold text-primary mb-4">Accessibility Adjustments Made</h3>
              <p className="mb-4">The following accessibility adjustments have been implemented on this website:</p>
              <ul className="list-disc list-inside space-y-3 ml-4">
                <li>
                  <strong>Browser and Device Support:</strong> The website is optimized for all common browsers (Chrome, Firefox, Edge, Safari) and is adapted for use on mobile devices (smartphones) and tablets.
                </li>
                <li>
                  <strong>Keyboard Navigation:</strong> The site allows for full navigation using the keyboard only (Tab, Arrows, Enter) without the need for a mouse.
                </li>
                <li>
                  <strong>Visual Content:</strong> All images and graphic buttons on the site have alternative text (Alt Text) for screen reader compatibility.
                </li>
                <li>
                  <strong>Design and Contrast:</strong> The website was designed with clear color contrast and allows font resizing via the browser (Ctrl + / Ctrl -).
                </li>
                <li>
                  <strong>Site Structure:</strong> Headings and content are organized in a clear, hierarchical structure to facilitate orientation.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-2xl font-semibold text-primary mb-4">Exceptions</h3>
              <p>
                Despite our efforts to make all pages and content on the site accessible, some parts or capabilities may not yet be fully accessible, or a suitable technological solution may not have been found for them yet (e.g., older documents or third-party content). We continue our efforts to improve the site's accessibility as part of our commitment to enabling its use for the entire population, including people with disabilities.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-2xl font-semibold text-primary mb-4">Contact for Requests and Suggestions</h3>
              <p className="mb-4">
                If you encounter any accessibility-related problem or malfunction, or if you need assistance performing an action on the site, please let us know. We will make every effort to find a suitable solution and address the issue as soon as possible.
              </p>
              <p className="mb-4">You can contact the oFair Accessibility Coordinator via the following channels:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>
                  <strong>Email:</strong>{" "}
                  <a href="mailto:info@ofair.co.il" className="text-primary hover:underline">
                    info@ofair.co.il
                  </a>
                </li>
                <li>
                  <strong>Phone:</strong>{" "}
                  <a href="tel:+972545308505" className="text-primary hover:underline">
                    054-5308505
                  </a>
                </li>
                <li>
                  <strong>Via the website:</strong> Using the "Contact Us" page
                </li>
              </ul>
              <p className="mb-2">To help us handle the issue effectively, please include as many details as possible:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Description of the problem.</li>
                <li>The specific page where you encountered the issue.</li>
                <li>The type of browser and operating system you used.</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accessibility;
