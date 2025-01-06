import Link from "next/link";

const NoAccess = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">אין לך גישה לדף זה</h1>
      <p>אנא התחבר כדי להמשיך.</p>
      <Link href="/pages/login">
        <p className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          מעבר לדף התחברות
        </p>
      </Link>
    </div>
  );
};

export default NoAccess;
