import React, { useState } from 'react';
import {
  X,
  CreditCard,
  QrCode,
  Building,
  CheckCircle2,
  Download,
  Printer,
  ShieldCheck,
  Receipt,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FeeItem } from '../../utils/academicCalculations';

interface FeePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  rollNo: string;
  department: string;
  pendingAmount: number;
  items: FeeItem[];
  scholarshipName: string;
  scholarshipAmount: number;
  onPaymentSuccess: (payment: {
    amount: number;
    method: string;
    transactionRef: string;
    receiptNumber: string;
  }) => void;
}

export const FeePaymentModal: React.FC<FeePaymentModalProps> = ({
  isOpen,
  onClose,
  studentName,
  rollNo,
  department,
  pendingAmount,
  items,
  scholarshipName,
  scholarshipAmount,
  onPaymentSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('aarav.sharma@okaxis');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 9012');
  const [expiry, setExpiry] = useState('08/29');
  const [cvv, setCvv] = useState('781');
  const [selectedBank, setSelectedBank] = useState('State Bank of India');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedReceipt, setCompletedReceipt] = useState<{
    receiptNumber: string;
    transactionRef: string;
    date: string;
    amount: number;
    method: string;
  } | null>(null);

  if (!isOpen) return null;

  const handlePayNow = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const receiptNo = `NU-RCT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const txRef = `SBI-EPAY-${Math.floor(100000000 + Math.random() * 900000000)}`;
      const date = new Date().toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });

      const paymentRecord = {
        amount: pendingAmount,
        method:
          selectedMethod === 'upi'
            ? 'Unified Payments Interface (UPI)'
            : selectedMethod === 'card'
            ? 'Credit/Debit Card (Visa)'
            : `NetBanking (${selectedBank})`,
        transactionRef: txRef,
        receiptNumber: receiptNo,
      };

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Safe fallback
      }

      setIsProcessing(false);
      setCompletedReceipt({
        ...paymentRecord,
        date,
      });
      onPaymentSuccess(paymentRecord);
    }, 1200);
  };

  const handleClose = () => {
    setCompletedReceipt(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Receipt className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold tracking-wide uppercase">
              {completedReceipt ? 'College Official Fee Receipt' : 'Online Payment Gateway · Nagarjuna College Of Engineering & Technology'}
            </h3>
          </div>
          <button onClick={handleClose} className="p-1 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {completedReceipt ? (
          /* Official Fee Receipt View */
          <div className="p-6 sm:p-8 space-y-6">
            <div className="p-6 bg-emerald-50/60 rounded-2xl border border-emerald-200 text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-emerald-950">Payment Successfully Processed</h3>
              <p className="text-xs text-emerald-800">
                Your fee dues have been cleared and reconciled in the College Finance Ledger.
              </p>
            </div>

            {/* Official Printable Receipt Slip */}
            <div className="border border-slate-200 rounded-xl p-5 bg-white space-y-4 text-xs font-mono">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 font-sans">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">NAGARJUNA COLLEGE OF ENGINEERING AND TECHNOLOGY</h4>
                  <p className="text-[11px] text-slate-500">Finance & Accounts Division · Mudugurki, Devanahalli, Bengaluru-562103</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Receipt No</span>
                  <p className="font-bold text-indigo-700">{completedReceipt.receiptNumber}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 font-sans">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Candidate Name</span>
                  <p className="font-bold text-slate-800">{studentName}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Roll Number</span>
                  <p className="font-bold text-slate-800">{rollNo}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Department</span>
                  <p className="text-slate-700">{department}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Transaction Ref</span>
                  <p className="text-slate-700 font-mono">{completedReceipt.transactionRef}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Payment Mode</span>
                  <p className="text-slate-700">{completedReceipt.method}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Date & Timestamp</span>
                  <p className="text-slate-700">{completedReceipt.date} · 03:14 PM IST</p>
                </div>
              </div>

              <div className="border-t border-b border-slate-200 py-3 font-sans flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 text-sm">Amount Paid in Words:</span>
                  <p className="text-[11px] text-slate-500">Thirty-Two Thousand Rupees Only</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500">Total Cleared:</span>
                  <p className="text-lg font-black text-slate-900 font-mono">
                    ₹{completedReceipt.amount.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between font-sans text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" /> Direct Bank Reconciled (Digitally Signed)
                </span>
                <span>Accounts Officer · NU</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <Printer className="w-3.5 h-3.5" /> Print Receipt
              </button>
              <button
                onClick={handleClose}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Payment Processing Form */
          <div className="p-6 sm:p-8 space-y-6">
            {/* Fee summary banner */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Outstanding Balance Due
                </span>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  ₹{pendingAmount.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Includes credit offset of ₹{scholarshipAmount.toLocaleString('en-IN')} from {scholarshipName}
                </div>
              </div>
              <div className="sm:text-right text-xs text-slate-500">
                <div>Candidate: <strong className="text-slate-800">{studentName}</strong></div>
                <div>Roll No: <strong className="text-slate-800 font-mono">{rollNo}</strong></div>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Select Payment Mode
              </label>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('upi')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                    selectedMethod === 'upi'
                      ? 'border-indigo-600 bg-indigo-50/60 text-indigo-900 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <QrCode className="w-5 h-5 mb-1 text-indigo-600" />
                  <span>UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('card')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                    selectedMethod === 'card'
                      ? 'border-indigo-600 bg-indigo-50/60 text-indigo-900 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mb-1 text-indigo-600" />
                  <span>Debit / Credit</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('netbanking')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                    selectedMethod === 'netbanking'
                      ? 'border-indigo-600 bg-indigo-50/60 text-indigo-900 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Building className="w-5 h-5 mb-1 text-indigo-600" />
                  <span>NetBanking</span>
                </button>
              </div>
            </div>

            {/* Payment details form based on selected tab */}
            {selectedMethod === 'upi' && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800">Scan QR Code with any UPI App</span>
                  <span className="text-[11px] text-indigo-600 font-semibold">GPay · PhonePe · Paytm</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-white border border-slate-300 rounded-lg p-2 flex items-center justify-center shrink-0">
                    <QrCode className="w-20 h-20 text-slate-900" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="text-[11px] font-semibold text-slate-600 block">
                      Or enter Virtual Payment Address (UPI ID)
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@bank"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-600 bg-white"
                    />
                    <span className="text-[10px] text-slate-400 block">Instant debit confirmation via NPCI UPI 2.0</span>
                  </div>
                </div>
              </div>
            )}

            {selectedMethod === 'card' && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-600 bg-white font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Valid Thru</label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-600 bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">CVV / Security Code</label>
                    <input
                      type="password"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      maxLength={3}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-600 bg-white font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedMethod === 'netbanking' && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <label className="text-[11px] font-semibold text-slate-600 block">
                  Select Participating Bank
                </label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-600 bg-white font-medium"
                >
                  <option value="State Bank of India">State Bank of India (SBI)</option>
                  <option value="HDFC Bank">HDFC Bank</option>
                  <option value="ICICI Bank">ICICI Bank</option>
                  <option value="Axis Bank">Axis Bank</option>
                  <option value="Canara Bank">Canara Bank</option>
                  <option value="Punjab National Bank">Punjab National Bank</option>
                </select>
                <span className="text-[10px] text-slate-400 block">
                  You will be securely redirected to your bank portal for two-factor OTP verification.
                </span>
              </div>
            )}

            {/* Security Guarantee & Pay Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>256-Bit SSL Encrypted Payment Gateway</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-1/2 sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handlePayNow}
                  className="w-1/2 sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authorizing...</span>
                    </>
                  ) : (
                    <>
                      <span>Pay ₹{pendingAmount.toLocaleString('en-IN')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
