export function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 font-sans leading-relaxed">
      <h1 className="text-3xl font-extrabold uppercase tracking-widest text-gray-900 mb-8 border-b pb-4">
        Terms of Service / Shuruudaha Adeegga
      </h1>
      <p className="text-gray-500 text-xs mb-8">Last updated: July 21, 2026</p>

      <section className="space-y-6 text-gray-700 text-sm">
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide">1. Shuruudaha Guud (General Terms)</h2>
          <p>
            Markaad booqato ama aad wax ka iibsato Tokiyo Store, waxaad ogolaanaysaa inaad u hoggaansanto shuruudahaan adeegga. Waxaan xaq u leedahay inaan beddelno adeegyada ama qiimaha alaabta mar kasta oo aan u baahano.
          </p>
          <p className="mt-2 text-gray-500">
            By accessing or placing an order on Tokiyo Store, you agree to comply with and be bound by these terms. We reserve the right to modify services, prices, or inventory configurations without prior notice.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide">2. Xaqiijinta Lacag Bixinta (Payment Verification)</h2>
          <p>
            Dalabka macaamiisha ee la adeegsado EVC/Zaad/Sahal ama wareejin bangi (manual payments) looma aqoonsan doono "Paid" ilaa maamuluhu uu xaqiijiyo tixraaca lacag bixinta. Dalabaadka aan la bixin lacagtooda 48 saac gudahood si toos ah ayaa loo baabi'in doonaa.
          </p>
          <p className="mt-2 text-gray-500">
            Orders using manual bank transfer or local mobile money remain unpaid and pending confirmation until payment references are validated server-side. Unpaid orders will automatically expire after 48 hours.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide">3. Kaydka & Xaddidnaanta (Inventory & Stock Limits)</h2>
          <p>
            Haddii alaab ay ka dhammaato kaydka dhexda laga iibsado ka dib, waxaan xaq u leenahay inaan baajino dalabka oo aan lacagtaada si toos ah dib ugu soo celino (full refund).
          </p>
          <p className="mt-2 text-gray-500">
            In the event of a stock discrepancy or system error regarding availability, we reserve the right to cancel the order and provide a full refund.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide">4. Mas'uuliyadda (Limitation of Liability)</h2>
          <p>
            Ma nihin mas'uul wixii khasaare ah oo ka dhasha dib-u-dhaca raridda maraakiibta dibadda ama shirkadaha maxalliga ah ee alaabta keena, in kasta oo aan samayn doonno dadaal kasta si alaabtaadu ay kuugu soo gaarto waqtiga ugu habboon.
          </p>
          <p className="mt-2 text-gray-500">
            Tokiyo Store is not liable for external carrier delays, custom holds, or force majeure events impacting shipping timelines.
          </p>
        </div>
      </section>
    </div>
  );
}
