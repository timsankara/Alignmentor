// pages/api/pdf/[arxivId].ts
import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { arxivId } = req.query;

  if (!arxivId || typeof arxivId !== 'string') {
    return res.status(400).json({ error: 'Invalid arXiv ID' });
  }

  const pdfUrl = `https://arxiv.org/pdf/${arxivId}`;

  try {
    const response = await fetch(pdfUrl, { redirect: 'follow' });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const pdfBuffer = await response.buffer();

    // Set the appropriate headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', pdfBuffer.length);

    // Send the PDF data
    res.send(pdfBuffer);
  } catch (error) {
    console.error(`Error fetching PDF: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch PDF' });
  }
}