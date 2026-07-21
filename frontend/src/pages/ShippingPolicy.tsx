export function ShippingPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 font-sans leading-relaxed">
      <h1 className="text-3xl font-extrabold uppercase tracking-widest text-gray-900 mb-8 border-b pb-4">
        Shipping & Returns / Rarista iyo Soo Celinta
      </h1>
      <p className="text-gray-500 text-xs mb-8">Last updated: July 21, 2026</p>

      <section className="space-y-6 text-gray-700 text-sm">
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide">1. Rarista Alaabta (Shipping Options & Fees)</h2>
          <p>
            Waxaan u rarnaa dalabaadka adduunka oo dhan. Lacagta rarista caadiga ah waa <strong>$15.00</strong>.
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Dalabaadka ka sarreeya $500</strong>: Raristu waa bilaash (Free Shipping).</li>
            <li><strong>Mogadishu & Gobolka Benadir</strong>: 24 saac gudahood ayaa lagu keenayaa.</li>
            <li><strong>Gobolada Kale ee Somalia</strong>: 3 - 5 maalmood.</li>
            <li><strong>Dunida Kale (International)</strong>: 5 - 10 maalmood oo shaqo.</li>
          </ul>
          <p className="mt-2 text-gray-500">
            We offer worldwide premium shipping. Standard delivery fee is $15.00. Orders exceeding $500 qualify for complimentary shipping. Local Mogadishu orders are fulfilled within 24 hours.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide">2. Shuruudaha Celinta Alaabta (Return Conditions)</h2>
          <p>
            Macaamiishu waxay xaq u leeyihiin inay ku soo celiyaan alaabta ay iibsadeen <strong>14 maalmood</strong> gudahood laga bilaabo maalinta dalabka la geeyey.
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Alaabtu waa inaysan noqon mid la xirtay, la dhaqay, ama la beddelay, waana in tag-keedu ku dheggan yahay.</li>
            <li>Alaabta lagu iibsaday "Clearance" ama "Final Sale" dib looma celin karo.</li>
            <li>Lacagta waxaa lagu soo celinayaa isla habkii aad ku bixisay 7 - 10 maalmood gudahood markay alaabtu nagu soo laabato.</li>
          </ul>
          <p className="mt-2 text-gray-500">
            We accept returns within 14 days of delivery. Items must be unworn, unwashed, unaltered, and with original tags attached. Final sale and clearance items are not eligible for returns. Refunds will be processed to the original payment method.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide">3. Habka Celinta (How to Return)</h2>
          <p>
            Si aad u dalbato celin alaab, fadlan gal akoonkaaga, raadi dalabkaagii, oo ku dhufo badhanka <strong>Request Return</strong>. Maamulkayaga ayaa dib u eegi doona oo kula soo xiriiri doona.
          </p>
          <p className="mt-2 text-gray-500">
            To initiate a return request, navigate to your Profile &gt; Orders, select the appropriate order, and submit a return request. You may also contact customer service at support@tokiyostore.com for further instructions.
          </p>
        </div>
      </section>
    </div>
  );
}
