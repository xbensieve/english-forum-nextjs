import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center px-4 sm:px-6 lg:px-8">
        <h1 className="text-6xl font-bold text-blue-900">404</h1>
        <p className="mt-3 text-lg text-gray-700">Trang này không khả dụng</p>
        <p className="mt-1 text-sm text-gray-500">
          Trang bạn đang tìm có thể đã bị xóa, hoặc đường dẫn không chính xác.
        </p>
        <Link
          href="/"
          className="mt-5 inline-block px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
