export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <h3 className="font-bold text-gray-800 mb-2">고객센터</h3>
          <a
            href="tel:15887011"
            aria-label="고객센터 1588-7011에 전화하기"
            className="mb-1 inline-block text-2xl font-black text-[#e4003b] hover:underline"
          >
            1588-7011
          </a>
          <p className="text-xs">평일 09:00~18:00</p>
          <p className="text-xs">(점심 12:00~13:00 제외)</p>
        </div>
      </div>
    </footer>
  );
}
