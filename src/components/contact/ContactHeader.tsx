
import React from "react";

const ContactHeader = () => {
  return (
    <div className="text-center mb-10">
      <h2 className="text-3xl md:text-4xl font-bold mb-6 text-ofair-900">
        צור קשר
      </h2>
      <p className="text-lg text-muted-foreground mb-2">
        יש לכם שאלות? אנחנו כאן בשבילכם.
      </p>
      <p className="text-muted-foreground mb-4">
        מלאו את הטופס ונחזור אליכם בהקדם האפשרי.
      </p>
      <div className="inline-block bg-ofair-100 text-ofair-900 px-4 py-2 rounded-md font-medium border border-ofair-200 mb-6">
        שימו לב: זהו טופס צור קשר בלבד ואינו מהווה טופס הרשמה לשירות
      </div>
    </div>
  );
};

export default ContactHeader;
