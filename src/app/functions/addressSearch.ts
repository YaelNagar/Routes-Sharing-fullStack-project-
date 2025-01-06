// פונקציה שתבדוק אם הכתובת לא ריקה
export const isValidAddress = (input: string): boolean => {
  return input.trim().length > 0;
};

export const handlePlaceSelect = (
  selectedAddress: string,
  setAddress: React.Dispatch<React.SetStateAction<string>>,
  setErrors: React.Dispatch<
    React.SetStateAction<{
      address?: string;
    }>
  >,
  setIsSelectedFromAutocomplete: (value: React.SetStateAction<boolean>) => void
) => {
  setAddress(selectedAddress); // עדכון הכתובת הנבחרת
  setErrors((prev) => ({ ...prev, address: undefined })); // איפוס שגיאות
  setIsSelectedFromAutocomplete(true); // הצבעה על כך שהכתובת נבחרה מתוך ההשלמה
};

export const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setChangeAddress: (changeAddress: string) => void,
  setInitialAddress: React.Dispatch<React.SetStateAction<string>>,
  setIsSelectedFromAutocomplete: (value: React.SetStateAction<boolean>) => void,
  filterAddress: boolean,
) => {
  if (e.target.value.length === 0 && !filterAddress) setInitialAddress("");
  setChangeAddress(e.target.value);
  // עדכון כתובת לפי הזנה חופשית של המשתמש
  setIsSelectedFromAutocomplete(false); // אם המשתמש התחיל להקליד, לא נבחרה כתובת מתוך ההשלמה
};
