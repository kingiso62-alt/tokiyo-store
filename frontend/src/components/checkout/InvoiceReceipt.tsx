import QRCode from "react-qr-code";

export function InvoiceReceipt() {
  const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  
  const whatsappUrl = `https://wa.me/252613631292?text=Hello%20Tokiyo%20Store,%20I%20have%20a%20question%20about%20my%20order%20${orderId}`;

  return (
    <div className="flex justify-center my-8">
      {/* POS Receipt Container */}
      <div className="bg-white w-80 text-black font-mono text-sm p-6 shadow-xl relative">
        
        {/* Receipt Zigzag Top Border */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCI+PHBvbHlnb24gcG9pbnRzPSIwLDEwIDEwLDAgMjAsMTAiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')] -mt-2"></div>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold uppercase mb-1">Tokiyo</h2>
          <p className="text-xs">Maka Al-Mukarama Road</p>
          <p className="text-xs">Mogadishu, Somalia</p>
          <p className="text-xs mt-1">Tel: +252 61 3631292</p>
        </div>

        {/* Divider */}
        <div className="border-t-2 border-dashed border-gray-300 my-4"></div>

        {/* Order Info */}
        <div className="text-xs space-y-1 mb-4">
          <div className="flex justify-between">
            <span>Order No:</span>
            <span className="font-bold">{orderId}</span>
          </div>
          <div className="flex justify-between">
            <span>Date:</span>
            <span>{date} {time}</span>
          </div>
          <div className="flex justify-between">
            <span>Customer:</span>
            <span>Guest User</span>
          </div>
        </div>

        <div className="border-t-2 border-dashed border-gray-300 my-4"></div>

        {/* Items */}
        <div className="mb-4">
          <div className="flex justify-between font-bold text-xs mb-2">
            <span>Item (Qty)</span>
            <span>Amount</span>
          </div>
          
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-start">
              <div className="pr-2">
                <p>Midnight Onyx Chronograph</p>
                <p className="text-gray-500">1 x $850.00</p>
              </div>
              <div className="font-semibold">$850.00</div>
            </div>
            
            <div className="flex justify-between items-start">
              <div className="pr-2">
                <p>Silk Blend Patterned Tie</p>
                <p className="text-gray-500">2 x $85.00</p>
              </div>
              <div className="font-semibold">$170.00</div>
            </div>
          </div>
        </div>

        <div className="border-t-2 border-dashed border-gray-300 my-4"></div>

        {/* Totals */}
        <div className="text-xs space-y-1 mb-4">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>$1,020.00</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>$15.00</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (5%):</span>
            <span>$51.00</span>
          </div>
        </div>

        <div className="border-t-2 border-dashed border-gray-300 my-4"></div>

        <div className="flex justify-between font-bold text-lg mb-6">
          <span>TOTAL</span>
          <span>$1,086.00</span>
        </div>

        {/* Payment Info */}
        <div className="text-center text-xs mb-6">
          <p className="mb-1 uppercase font-bold">Paid via EVC Plus</p>
          <p className="text-gray-500">Transaction ID: XXXXXXX</p>
        </div>

        {/* Real QR Code linking to WhatsApp */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-white p-1 border border-black inline-block mb-1">
            <QRCode value={whatsappUrl} size={90} />
          </div>
          <p className="text-[10px] text-gray-500 uppercase font-bold mt-1 tracking-wider">Scan for Support</p>
        </div>

        {/* Footer */}
        <div className="text-center text-xs space-y-1">
          <p className="font-bold">THANK YOU FOR YOUR PURCHASE!</p>
          <p>Please keep this receipt for your records.</p>
          <p>tokiyostore.com</p>
        </div>

        {/* Receipt Zigzag Bottom Border */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCI+PHBvbHlnb24gcG9pbnRzPSIwLDAgMTAsMTAgMjAsMCIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==')] -mb-2"></div>

      </div>
    </div>
  );
}
