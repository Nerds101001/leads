# LRX CRM Dashboard

AI-Enhanced Business Intelligence Dashboard with NVIDIA API Integration

## 🚀 Features

- **File Upload**: Support for Excel/CSV CRM data files
- **Interactive Dashboard**: Overview, Funnel Analysis, Team Performance
- **AI Report Generation**: McKinsey-grade CEO reports powered by NVIDIA AI
- **Real-time Analytics**: Charts and KPIs with live data
- **Responsive Design**: Works on desktop and mobile

## 📁 Project Structure

```
LRX/
├── api/
│   └── generate-ai.js      # NVIDIA AI API endpoint
├── index-new.html          # Main dashboard (clean version)
├── package.json            # Dependencies
├── vercel.json            # Vercel deployment config
├── .env.local             # Environment variables
└── README.md              # This file
```

## 🛠 Setup & Deployment

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run locally:**
   ```bash
   npm run dev
   ```

3. **Access dashboard:**
   ```
   http://localhost:3000
   ```

### Vercel Deployment

1. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

2. **Set environment variables in Vercel dashboard:**
   - `NVIDIA_API_KEY`: Your NVIDIA API key

### Hostinger Deployment

1. **Upload files:**
   - Upload `index-new.html` as `index.html`
   - Upload `api/` folder to your domain root
   - Ensure PHP/Node.js support is enabled

## 📊 Usage

1. **Upload CRM Files:**
   - Assigned Lead Report (Excel/CSV)
   - Lead Stage Log Report (Excel/CSV) 
   - Customer Stage Change Log (Excel/CSV)

2. **Generate Dashboard:**
   - Click "Generate Dashboard" after uploading files
   - View analytics in Overview, Funnel, and Team tabs

3. **AI Report:**
   - Navigate to "AI Report" tab
   - Click "Generate Report" for CEO-level analysis
   - Get actionable insights and recommendations

## 🔧 API Endpoints

### POST /api/generate-ai

Generates AI business intelligence report from CRM data.

**Request:**
```json
{
  "leadData": [...],
  "stageData": [...], 
  "custData": [...],
  "customPrompt": "Focus areas"
}
```

**Response:**
```json
{
  "report": "# CEO Report...",
  "metadata": {
    "totalLeads": 1250,
    "generatedAt": "2024-01-01T00:00:00Z"
  }
}
```

## 🎯 Key Features

- ✅ **No CORS Issues**: Server-side API handles NVIDIA integration
- ✅ **Professional UI**: Clean, responsive dashboard design
- ✅ **Real Analytics**: Charts and KPIs from actual data
- ✅ **AI Insights**: McKinsey-grade business analysis
- ✅ **Easy Deployment**: Works on Vercel, Hostinger, any hosting

## 🔑 Environment Variables

- `NVIDIA_API_KEY`: Your NVIDIA API key for AI report generation

## 📈 Data Format

Expected Excel/CSV columns:

**Assigned Leads:**
- Stage, Source, Salesperson, Company, etc.

**Stage Log:**
- Lead ID, Stage, Date, Salesperson, etc.

**Customer Log:**
- Customer ID, Stage, Date, Activity, etc.

## 🚀 Live Demo

Upload your files and see instant results:
- Interactive charts and analytics
- AI-powered business insights
- Actionable CEO-level recommendations

---

**Built with NVIDIA AI • Optimized for Business Intelligence**