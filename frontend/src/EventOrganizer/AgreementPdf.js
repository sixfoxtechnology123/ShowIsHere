import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../utils/api';
import SignAgrement from '../utils/SignAgrement';

const AgreementPdf = () => {
  const { id } = useParams();
  const [account, setAccount] = useState(null);

  useEffect(() => {
    API.get(`/org/get-kyc?id=${id}`)
      .then((response) => setAccount(response.data || response))
      .catch(() => setAccount(false));
  }, [id]);

  if (account === null) return <p className="p-8 text-sm text-slate-600">Loading signed agreement...</p>;
  if (!account) return <p className="p-8 text-sm text-red-700">Signed agreement not found.</p>;

  return (
    <main className="min-h-screen bg-slate-100  print:bg-white print:py-0 print:m-0 print:p-0">
      <style>{`
        @media print {
          /* Hide main dashboard sidebars, headers, and download buttons */
          nav, aside, header, footer, .agreement-actions, [class*="Sidebar"], [class*="Header"] {
            display: none !important;
          }
          /* Reset body and wrapper backgrounds/margins for a clean print layout */
          body, html, main {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
        }
      `}</style>

      <div className="bg-white pb-24 min-h-screen p-6 sm:px-40 shadow-sm w-full max-w-5xl mx-auto my-auto relative overflow-hidden print:p-0 print:shadow-none print:max-w-none print:w-full">
        <div className="agreement-actions absolute top-6 right-6 z-10">
          <button 
            type="button" 
            onClick={() => window.print()} 
            className="rounded-md bg-blue-600 px-4 py-1 text-sm font-semibold text-white hover:bg-blue-700 transition cursor-pointer"
          >
            Download PDF
          </button>
        </div>

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
    </main>
  );
};

export default AgreementPdf;