import jwt from 'jsonwebtoken';


const SECRET_KEY = process.env.SECRET_KEY || "";

//יצירת טוקן
export const generateToken = (id: string, email: string, name:string, address: string, googleUser: boolean) => {
    return jwt.sign(
      {id: id, email: email, name: name, address: address, isGoogleUser: googleUser },
      SECRET_KEY, 
      { expiresIn: '2h' } 
    );
  };
 
//אימות טוקן
export const verifyToken = (token: string) => {
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      return decoded;
    } catch {
      throw new Error("Invalid token");
    }
};
