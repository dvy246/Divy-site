import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve directory paths in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function syncMedium() {
  console.log('Fetching latest articles from Medium RSS feed...');
  
  const rssUrl = 'https://medium.com/feed/@yadavdivy296';
  const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
  
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    if (data.status !== 'ok') {
      throw new Error(`API error: ${data.message || 'Unknown error'}`);
    }
    
    const items = data.items || [];
    console.log(`Successfully fetched ${items.length} articles.`);
    
    // Map items to the schema used by data/articles.json
    const formattedArticles = items.map((item) => {
      // 1. Extract clean summary text from HTML content or description
      let cleanText = item.description || item.content || '';
      // Strip HTML tags
      cleanText = cleanText
        .replace(/<[^>]*>/g, ' ')
        // Remove Medium RSS truncation message
        .replace(/Continue reading on.*/gi, '')
        // Strip duplicate spaces
        .replace(/\s+/g, ' ')
        .trim();
        
      // Limit to ~160 chars with ellipsis
      const summary = cleanText.length > 160 
        ? cleanText.slice(0, 160) + '…' 
        : cleanText;
        
      // 2. Map high-end engineering tags based on title keywords
      const titleLower = item.title.toLowerCase();
      let finalTags = [];

      if (titleLower.includes('cost optimization') || titleLower.includes('bill')) {
        finalTags = ['Agents', 'AWS'];
      } else if (titleLower.includes('hacked') || titleLower.includes('hack')) {
        finalTags = ['Agents', 'Security', 'AWS'];
      } else if (titleLower.includes('kimi k3') || titleLower.includes('gpt-5') || titleLower.includes('opus')) {
        finalTags = ['LLMs', 'Python'];
      } else if (titleLower.includes('claude code') || titleLower.includes('codex')) {
        finalTags = ['Agents', 'Python'];
      } else if (titleLower.includes('context rot') || titleLower.includes('long sessions')) {
        finalTags = ['LLMs', 'Python'];
      } else if (titleLower.includes('6 ai concepts') || titleLower.includes('become an ai engineer')) {
        finalTags = ['LLMs', 'Python'];
      } else if (titleLower.includes('rag experiment') || titleLower.includes('was never the problem')) {
        finalTags = ['RAG', 'Python'];
      } else if (titleLower.includes('kill rag') || titleLower.includes('open knowledge format')) {
        finalTags = ['RAG', 'AWS'];
      } else if (titleLower.includes('boilerplate') || titleLower.includes('python libraries')) {
        finalTags = ['Python', 'AWS'];
      } else if (titleLower.includes('openwiki brains') || titleLower.includes('remember you')) {
        finalTags = ['Agents', 'RAG'];
      } else {
        // Fallback parsed tags from Medium
        const parsedTags = (item.categories || []).map((cat) => {
          return cat
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        });
        finalTags = parsedTags.length > 0 ? parsedTags : ['LLMs', 'Python'];
      }
      
      // 3. Format Date to YYYY-MM-DD
      const date = item.pubDate 
        ? item.pubDate.split(' ')[0] 
        : new Date().toISOString().split('T')[0];
        
      return {
        title: item.title,
        url: item.link,
        date: date,
        summary: summary,
        tags: finalTags
      };
    });
    
    // Output path: data/articles.json
    const outputPath = path.resolve(__dirname, '../data/articles.json');
    
    // Ensure output data directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write JSON to file
    fs.writeFileSync(outputPath, JSON.stringify(formattedArticles, null, 2), 'utf8');
    console.log(`Successfully synced and saved articles to: ${outputPath}`);
    
  } catch (error) {
    console.error('Error syncing Medium articles:', error.message);
    process.exit(1);
  }
}

syncMedium();
