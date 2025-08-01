import { CreditCard, CalendarDays, BadgeCheck, BadgeX, Timer, Download } from "lucide-react";
import { getISTTime } from "../../../services/utils/utilFunctions";
import { jsPDF } from 'jspdf';




const HistoryCard = ({ membership, name }) => {

    
        const generatePDF = () => {
        const doc = new jsPDF();
    
        // Add logo image (x, y, width, height)
        // doc.addImage(gymLogoBase64, 'PNG', 20, 6, 30, 30);
    
        // Gym name and address next to logo
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Minimalist Gyms", 55, 18);
    
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Raj College More, Burdwan, WB, 713101, India", 55, 24);
        doc.text("Contact: +91 9999999999 | www.minimalistgyms.com", 55, 30);
    
        // Line separator
        doc.setDrawColor(200);
        doc.line(20, 35, 190, 35);
    
        // Invoice Title
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Membership Invoice", 20, 45);
    
        // Membership Details
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
    
        const lines = [
          `User ID: ${membership.userId}`,
          `Name: ${name}`,
          `Plan ID: ${membership.planId}`,
          `Order ID: ${membership.orderId}`,
          `Payment ID: ${membership.paymentId}`,
          `Payment Method: ${membership.paymentMethod}`,
          `Amount: Rs. ${membership.amount}`,
          `Paid on: ${getISTTime(membership.createdAt).toLocaleString()}`,
          `Expires on: ${getISTTime(membership.endDate)}`,
        ];
    
        lines.forEach((line, index) => {
          doc.text(line, 20, 60 + index * 10);
        });
    
        // Save the PDF
        doc.save(`invoice_minimalist_gyms.pdf`);
      };

  return (
    <div className="rounded bg-slate-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-100">Plan: {membership?.planId.toUpperCase()}</h2>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${membership?.status === "active"
          ? "bg-green-700 text-white"
          : "bg-red-700 text-white"
          } flex items-center gap-1`}>
          {membership?.status === "active" ? (
            <>
              <BadgeCheck size={16} /> Active
            </>
          ) : (
            <>
              <BadgeX size={16} /> Inactive
            </>
          )}
        </span>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 text-sm text-slate-300">
        <p><CreditCard className="inline mr-2 text-orange-600" size={16} /><strong>Payment ID:</strong> {membership?.paymentId}</p>
        <p><CreditCard className="inline mr-2 text-orange-600" size={16} /><strong>Order ID:</strong> {membership?.orderId}</p>
        <p><CalendarDays className="inline mr-2 text-orange-600" size={16} /><strong>Paid on:</strong> {getISTTime(membership?.createdAt)}</p>
        <p><CalendarDays className="inline mr-2 text-orange-600" size={16} /><strong>Expires on:</strong> {getISTTime(membership?.endDate)}</p>
        <p><Timer className="inline mr-2 text-orange-600" size={16} /><strong>Amount:</strong> ₹{membership?.amount}</p>
        <p><CreditCard className="inline mr-2 text-orange-600" size={16} /><strong>Method:</strong> {membership?.paymentMethod}</p>
      </div>

      <div className="mt-6 text-right max-sm:flex justify-center">
        <button
          onClick={generatePDF}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium px-4 py-1 rounded-full transition duration-200 cursor-pointer border border-orange-600 text-slate-300 hover:text-white"
        >
          <Download size={16} />
          Download Invoice
        </button>
      </div>
    </div>
  );
};

export default HistoryCard;
