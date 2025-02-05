import axios, { AxiosRequestConfig, Method } from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { URL } from 'url';

export const config = {
  api: {
    responseLimit: false,
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  try {
    const { url } = req.query;

    if (!url || typeof url !== 'string') {
      res.status(400).json({ error: 'URL parameter is missing or invalid' });
      return;
    }

    let targetUrl: string;
    try {
      const parsedUrl = new URL(url.startsWith('http') ? url : `http://${url}`);
      targetUrl = parsedUrl.href;
    } catch {
      res.status(400).json({ error: 'Invalid URL format' });
      return;
    }

    const method: Method = req.method as Method;
    const isGet = method === 'GET';

    // Preserve the original range headers for video streaming
    const headers: Record<string, string> = {
      ...req.headers,
    } as Record<string, string>;

    const axiosConfig: AxiosRequestConfig = {
      method,
      url: targetUrl,
      headers,
      data: isGet ? undefined : req.body,
      responseType: 'stream', // Use stream instead of arraybuffer for large video files
    };

    const response = await axios(axiosConfig);

    // Set headers for video streaming
    res.setHeader('Content-Type', response.headers['content-type'] || 'application/octet-stream');
    res.setHeader('Content-Length', response.headers['content-length'] || '0');

    // Handle video streaming with `Range` support
    if (req.headers.range && response.status === 200) {
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Content-Range', response.headers['content-range'] || `bytes 0-${response.headers['content-length']}/${response.headers['content-length']}`);
      res.status(206); // Partial Content
    } else {
      res.status(response.status);
    }

    // Pipe the response stream directly to the client
    response.data.pipe(res);
  } catch (error: any) {
    res.status(error.response?.status || 500).json({
      message: 'Proxy request failed',
      error: error.response?.data || error.message,
    });
  }
}
