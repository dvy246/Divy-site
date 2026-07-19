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
        
      // 2. Format tags to Title Case and clean up
      const tags = (item.categories || []).map((cat) => {
        return cat
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      });
      
      // Fallback tags if empty
      const finalTags = tags.length > 0 ? tags : ['AI Engineering', 'Technology'];
      
      // 3. Format Date to YYYY-MM-DD
      const date = item.pubDate 
        ? item.pubDate.split(' ')[0] 
        : new Date().toISOString().split('T')[0];
        
      return {
        title: item.title,
        url: item.link,
        date: date,
        summary: summary,
        tags: finalTags.slice(0, 3) // maximum of 3 tags for layout spacing
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
