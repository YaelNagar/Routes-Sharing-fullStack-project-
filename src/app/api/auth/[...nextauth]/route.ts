
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connect from "@/app/lib/DB/connectDB";
import User from "@/app/lib/models/userModel"; 

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!, // שם משתנה תואם ל-.env
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'select_account', // מאפשר בחירת חשבון Google כל פעם
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET, // סוד לאימות

  callbacks: {
    async signIn({ user }) {
      await connect(); // חיבור למסד הנתונים
      try {
        const existingUser = await User.findOne({ email: user.email });
        
        if (!existingUser) {
          await User.create({
            fullName: user.name,
            email: user.email,
            password: "", // משתמש Google לא צריך סיסמה
            googleUser: true, // מזהה שמדובר במשתמש Google
          });
          alert("New user created:"+ user);
        } else {
          alert("User already exists:"+ user);
        }

        return true; // הצלחה בהתחברות
      } catch (error) {
        console.error("Error during sign-in:", error);
        return false; // כשלון בהתחברות
      }
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) {
        return url;
      }

      // נוודא שהמשתמש ינותב לדף הבית אם הוא קיים
      const user = await User.findOne({ email: url });
      if (user) {
        return `${baseUrl}`; // אם הוא קיים, הפנה לדף הבית
      } else {
        return `${baseUrl}/complete-details`; // אם הוא חדש, הפנה לדף הוספת פרטים
      }
    },
  },
});

export { handler as GET, handler as POST };
