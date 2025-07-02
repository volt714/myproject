import React from 'react';
import { FileText } from 'lucide-react';
import { RFQ, Quote } from '@/types';

interface QuoteComparisonProps {
  rfqs: RFQ[];
  quotes: Quote[];
}

const getStatusColor = (status: Quote['status']): string => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'under_review':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-blue-100 text-blue-800';
  }
};

const handleAcceptQuote = (quoteId: string): void => {
  // TODO: Implement quote acceptance logic
  console.log(`Accepting quote: ${quoteId}`);
};

const handleRequestChanges = (quoteId: string): void => {
  // TODO: Implement request changes logic
  console.log(`Requesting changes for quote: ${quoteId}`);
};

const QuoteComparison: React.FC<QuoteComparisonProps> = ({ rfqs, quotes }) => {
  const rfqsWithQuotes = rfqs
    .map(rfq => ({
      ...rfq,
      quotes: quotes.filter(quote => quote.rfqId === rfq.rfqId),
    }))
    .filter(rfq => rfq.quotes.length > 0);

  if (rfqsWithQuotes.length === 0) {
    return (
      <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-200 text-center">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No Quotes Available</h3>
        <p className="text-gray-600">There are no quotes submitted for any of the available RFQs yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Quotes</h1>
      {rfqsWithQuotes.map(rfq => (
        <section key={rfq.id}>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            {rfq.title} <span className="text-base font-normal text-gray-500">({rfq.rfqId})</span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {rfq.quotes.map((quote: Quote) => (
              <div 
                key={quote.id} 
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{quote.vendorName}</h3>
                      <p className="text-sm text-gray-600">Quote ID: {quote.id}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
                      {quote.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-semibold text-green-600 text-lg">
                        ${quote.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Delivery:</span>
                      <span className="font-medium">{quote.deliveryTime}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Valid Until:</span>
                      <span className="font-medium">{new Date(quote.validUntil).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {quote.documents && quote.documents.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm font-semibold text-gray-600 mb-2">Documents:</p>
                      <div className="space-y-1">
                        {quote.documents.map((doc) => (
                          <div key={doc.id} className="flex items-center gap-2 text-sm">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline cursor-pointer">{doc.name}</a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex gap-2 pt-4 border-t border-gray-200">
                  <button 
                    onClick={() => handleAcceptQuote(quote.id)}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors text-sm font-medium"
                    disabled={quote.status === 'approved'}
                  >
                    Accept Quote
                  </button>
                  <button 
                    onClick={() => handleRequestChanges(quote.id)}
                    className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors text-sm font-medium"
                    disabled={quote.status === 'approved' || quote.status === 'rejected'}
                  >
                    Request Changes
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default QuoteComparison;