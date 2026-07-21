export function SizeGuide() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 font-sans leading-relaxed">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold uppercase tracking-widest text-gray-900 mb-4">
          Size Guide / Cabbirada Dharka
        </h1>
        <p className="text-gray-500">
          U dooro cabbirka kuugu habboon si dhar fiican oo kugu habboon aad u hesho.
        </p>
      </div>

      <div className="space-y-12">
        {/* Suits & Blazers */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-bold uppercase tracking-wider text-gray-900 mb-4 border-b pb-2">
            1. Suits & Blazers / Suutarka iyo Blazerada
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                  <th className="p-3 border">Size (US/UK)</th>
                  <th className="p-3 border">EU Size</th>
                  <th className="p-3 border">Chest (Inches)</th>
                  <th className="p-3 border">Waist (Inches)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                <tr><td className="p-3 border font-semibold">36R</td><td className="p-3 border">46</td><td className="p-3 border">36"</td><td className="p-3 border">30"</td></tr>
                <tr><td className="p-3 border font-semibold">38R</td><td className="p-3 border">48</td><td className="p-3 border">38"</td><td className="p-3 border">32"</td></tr>
                <tr><td className="p-3 border font-semibold">40R</td><td className="p-3 border">50</td><td className="p-3 border">40"</td><td className="p-3 border">34"</td></tr>
                <tr><td className="p-3 border font-semibold">42R</td><td className="p-3 border">52</td><td className="p-3 border">42"</td><td className="p-3 border">36"</td></tr>
                <tr><td className="p-3 border font-semibold">44R</td><td className="p-3 border">54</td><td className="p-3 border">44"</td><td className="p-3 border">38"</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Shirts */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-bold uppercase tracking-wider text-gray-900 mb-4 border-b pb-2">
            2. Dress Shirts / Shaatiyada Formal-ka
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                  <th className="p-3 border">Size Label</th>
                  <th className="p-3 border">Collar Size (Inches)</th>
                  <th className="p-3 border">Sleeve Length (Inches)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                <tr><td className="p-3 border font-semibold">S</td><td className="p-3 border">14" - 14.5"</td><td className="p-3 border">32" - 33"</td></tr>
                <tr><td className="p-3 border font-semibold">M</td><td className="p-3 border">15" - 15.5"</td><td className="p-3 border">33" - 34"</td></tr>
                <tr><td className="p-3 border font-semibold">L</td><td className="p-3 border">16" - 16.5"</td><td className="p-3 border">34" - 35"</td></tr>
                <tr><td className="p-3 border font-semibold">XL</td><td className="p-3 border">17" - 17.5"</td><td className="p-3 border">35" - 36"</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Shoes */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-bold uppercase tracking-wider text-gray-900 mb-4 border-b pb-2">
            3. Footwear / Kabaha Leather-ka ah
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                  <th className="p-3 border">US Size</th>
                  <th className="p-3 border">UK Size</th>
                  <th className="p-3 border">EU Size</th>
                  <th className="p-3 border">Foot Length (cm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                <tr><td className="p-3 border font-semibold">8</td><td className="p-3 border">7.5</td><td className="p-3 border">41</td><td className="p-3 border">25.4 cm</td></tr>
                <tr><td className="p-3 border font-semibold">9</td><td className="p-3 border">8.5</td><td className="p-3 border">42</td><td className="p-3 border">26.2 cm</td></tr>
                <tr><td className="p-3 border font-semibold">10</td><td className="p-3 border">9.5</td><td className="p-3 border">43</td><td className="p-3 border">27.0 cm</td></tr>
                <tr><td className="p-3 border font-semibold">11</td><td className="p-3 border">10.5</td><td className="p-3 border">44</td><td className="p-3 border">27.9 cm</td></tr>
                <tr><td className="p-3 border font-semibold">12</td><td className="p-3 border">11.5</td><td className="p-3 border">45</td><td className="p-3 border">28.7 cm</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
