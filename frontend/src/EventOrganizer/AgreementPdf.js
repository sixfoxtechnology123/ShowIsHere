import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import API from '../utils/api';
import SignAgrement from '../utils/SignAgrement';

const AgreementPdf = ({ orgId, onClose }) => { 
  const { id: paramId } = useParams();
  const id = orgId || paramId;
  
  const [account, setAccount] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    API.get(`/org/get-kyc?id=${id}`)
      .then((response) => setAccount(response.data || response))
      .catch(() => setAccount(false));
  }, [id]);

const handleDownloadPDF = async () => {
    const el = document.getElementById("print-section");
    if (!el) return;

    setIsDownloading(true);

    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 15; // 15mm uniform padding on every page
      const printableWidth = pdfWidth - (margin * 2);
      const printableHeight = pdfHeight - (margin * 2);

el.style.setProperty('font-size', '18px', 'important');
      const paragraphs = el.querySelectorAll('p, span, h3, h4, th, td');
      paragraphs.forEach(p => p.style.setProperty('font-size', '16px', 'important'));

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: 1200
      });

      el.style.fontSize = '';
      paragraphs.forEach(p => p.style.fontSize = '');

      const pageHeightPx = Math.floor((canvas.width * printableHeight) / printableWidth);
      let heightLeft = canvas.height;
      let position = 0;
      let pageNum = 0;

      while (heightLeft > 0) {
        if (pageNum > 0) {
          pdf.addPage();
        }

        const currentSliceHeight = Math.min(pageHeightPx, heightLeft);

        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvas.width;
        pageCanvas.height = currentSliceHeight;

        const ctx = pageCanvas.getContext("2d");
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        
        ctx.drawImage(
          canvas,
          0, position, canvas.width, currentSliceHeight,
          0, 0, pageCanvas.width, currentSliceHeight
        );

        const sliceData = pageCanvas.toDataURL("image/png");
        const sliceHeightMm = (pageCanvas.height * printableWidth) / canvas.width;

        pdf.addImage(sliceData, "PNG", margin, margin, printableWidth, sliceHeightMm);

        heightLeft -= currentSliceHeight;
        position += currentSliceHeight;
        pageNum++;
      }

      pdf.save(`Signed-Agreement-${account?.orgName || id}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (account === null) return <p className="p-8 text-sm text-slate-600 text-center">Loading signed agreement...</p>;
  if (!account) return <p className="p-8 text-sm text-red-700 text-center">Signed agreement not found.</p>;

  return (
    <div className="bg-white w-full flex flex-col">
      <div className="agreement-header flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 shrink-0 sticky top-0 z-20 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900">Signed Agreement Preview</h3>
        <div className="flex items-center gap-3">
          <button 
            type="button" 
            onClick={handleDownloadPDF} 
            disabled={isDownloading}
            className="rounded-md bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition cursor-pointer shadow-sm disabled:opacity-50"
          >
            {isDownloading ? "Generating PDF..." : "Download PDF"}
          </button>
          {onClose && (
            <button 
              type="button" 
              onClick={onClose} 
              className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 text-slate-700 hover:bg-slate-300 transition text-sm font-bold cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div 
        id="print-section" 
        className="bg-white pb-12 p-6 sm:px-20 w-full max-w-5xl mx-auto overflow-y-visible flex-1 text-slate-800"
      >
        
        <SignAgrement
          signingDate={account.signingAt ? new Date(account.signingAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
          organizerName={account.orgName}
          organizerLocation={account.orgAddress || [account.address1, account.city, account.state].filter(Boolean).join(', ')}
          organizerPan={account.panNumber}
          organizerGst={account.gstinNumber}
          organizerType={account.panLinkedAadhaar}
          isPanLinkedWithAadhaar={account.panLinkedAadhaar}
          bankAccountName={account.accountHolderName} 
          bankName={account.bankName}
          bankAccountNumber={account.accountNumber}
          accountHolderName={account.accountHolderName}
          contactPersonName={account.contactFullName}
          contactMobile={account.contactMobile || account.loginMobileNumber}
          accountType={account.accountType}
          bankIfsc={account.bankIfsc}
          signatoryEmail={account.contactEmail}
          signedDateTime={account.signingAt ? new Date(account.signingAt).toLocaleString('en-IN') : ''}
          signatureImage={account.signatureImage}
          onCreateSignature={() => {}}
          onDeleteSignature={null}
        /> 
      </div>
    </div>
  );
};

export default AgreementPdf;