export default function Header() {
  return (
    <header className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-white">
      <h1 className="text-xl font-semibold text-gray-800">
        Hookah Mix Creator (React/Firestore)
      </h1>
      
      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
        </button>
        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        </button>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition">
            Код
          </button>
          <button className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg font-medium">
            Предпросмотр
          </button>
          <button className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition">
            Поделиться
          </button>
        </div>
      </div>
    </header>
  );
}