// pages/api/pdf/[arxivId].ts
import { NextApiRequest, NextApiResponse } from 'next';
import https from 'https';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { arxivId } = req.query;

  if (!arxivId || typeof arxivId !== 'string') {
    return res.status(400).json({ error: 'Invalid arXiv ID' });
  }

  const pdfUrl = `https://arxiv.org/pdf/${arxivId}`;

  https.get(pdfUrl, (pdfRes) => {
    // Forward the content type
    res.setHeader('Content-Type', pdfRes.headers['content-type'] || 'application/pdf');

    // Stream the PDF data to the client
    pdfRes.pipe(res);
  }).on('error', (e) => {
    console.error(`Error fetching PDF: ${e.message}`);
    res.status(500).json({ error: 'Failed to fetch PDF' });
  });
}