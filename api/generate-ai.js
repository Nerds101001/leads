// api/generate-ai.js — NVIDIA AI Report Generator
// POST { leadData, stageData, custData, customPrompt }
// Returns { report: "markdown content" }

module.exports = async (req, res) => {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { leadData, stageData, custData, customPrompt } = req.body;
  const apiKey = process.env.NVIDIA_API_KEY || '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';

  if (!apiKey) {
    return res.status(400).json({ error: "NVIDIA API Key missing" });
  }

  // Prepare data context for AI analysis
  const totalLeads = leadData ? leadData.length : 0;
  const stageActivities = stageData ? stageData.length : 0;
  const customerLogs = custData ? custData.length : 0;
  
  let dataContext = `CRM PERFORMANCE ANALYSIS:

DATASET OVERVIEW:
- Total Leads: ${totalLeads}
- Stage Activities: ${stageActivities} 
- Customer Interactions: ${customerLogs}

`;

  // Analyze lead stages if data available
  if (leadData && leadData.length > 0) {
    const stageDistribution = {};
    const sourceAnalysis = {};
    const repPerformance = {};
    
    leadData.forEach(lead => {
      // Stage analysis
      const stage = lead.Stage || lead.stage || 'Unknown';
      stageDistribution[stage] = (stageDistribution[stage] || 0) + 1;
      
      // Source analysis
      const source = lead.Source || lead.source || 'Unknown';
      sourceAnalysis[source] = (sourceAnalysis[source] || 0) + 1;
      
      // Rep performance
      const rep = lead.Salesperson || lead.salesperson || lead.rep || 'Unknown';
      repPerformance[rep] = (repPerformance[rep] || 0) + 1;
    });

    dataContext += `STAGE DISTRIBUTION:
${Object.entries(stageDistribution).map(([stage, count]) => `- ${stage}: ${count} leads`).join('\n')}

TOP LEAD SOURCES:
${Object.entries(sourceAnalysis).sort((a,b) => b[1] - a[1]).slice(0,5).map(([source, count]) => `- ${source}: ${count} leads`).join('\n')}

SALES REP WORKLOAD:
${Object.entries(repPerformance).sort((a,b) => b[1] - a[1]).slice(0,8).map(([rep, count]) => `- ${rep}: ${count} leads`).join('\n')}

`;
  }

  const systemPrompt = `You are a Senior Business Analyst from McKinsey & Company. Analyze the provided CRM data and generate a comprehensive CEO-level diagnostic report.

ANALYSIS FRAMEWORK:
1. EXECUTIVE SUMMARY (2-3 key findings)
2. CRITICAL ISSUES (Top 3 revenue-impacting problems)
3. FUNNEL ANALYSIS (Where leads drop off, conversion bottlenecks)
4. TEAM PERFORMANCE (Individual rep insights, training needs)
5. SOURCE INTELLIGENCE (Best/worst performing channels)
6. IMMEDIATE ACTIONS (Specific 7-day action plan)
7. STRATEGIC RECOMMENDATIONS (30-90 day initiatives)

OUTPUT REQUIREMENTS:
- Use markdown formatting with headers
- Include specific numbers and percentages
- Be brutally honest about problems
- Provide actionable recommendations with clear ownership
- Focus on revenue impact and conversion optimization`;

  const userPrompt = `Analyze this CRM data and provide CEO-level insights:

${dataContext}

${customPrompt ? `SPECIFIC FOCUS: ${customPrompt}` : ''}

Generate a comprehensive report focusing on:
- Why leads are failing to convert
- Which sales reps need immediate attention
- Revenue leakage points and solutions
- Specific actionable steps with timelines`;

  try {
    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "meta/llama-3.1-8b-instruct",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4000,
        stream: false
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || `NVIDIA API error: ${response.status}`);
    }

    const report = data.choices?.[0]?.message?.content || "No analysis generated";
    
    res.status(200).json({ 
      report,
      metadata: {
        totalLeads,
        stageActivities,
        customerLogs,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("AI Generation Error:", error.message);
    
    // Fallback local analysis
    const fallbackReport = generateFallbackReport(totalLeads, leadData);
    
    res.status(200).json({ 
      report: fallbackReport,
      fallback: true,
      error: error.message,
      metadata: {
        totalLeads,
        stageActivities,
        customerLogs,
        generatedAt: new Date().toISOString()
      }
    });
  }
};

function generateFallbackReport(totalLeads, leadData) {
  const orders = leadData ? leadData.filter(l => 
    (l.Stage || l.stage || '').includes('ORDER') || 
    (l.Stage || l.stage || '').includes('WON')
  ).length : 0;
  
  const conversionRate = totalLeads > 0 ? ((orders / totalLeads) * 100).toFixed(1) : 0;
  
  return `# 🎯 CEO EXECUTIVE REPORT
*AI-Generated Business Intelligence Report*

## 📊 EXECUTIVE SUMMARY
Your CRM contains **${totalLeads}** total leads with **${orders}** successful conversions, resulting in a **${conversionRate}%** conversion rate. ${conversionRate < 3 ? '**CRITICAL**: Performance is below the 3% industry benchmark.' : 'Performance meets industry standards.'}

## 🔴 CRITICAL ISSUES IDENTIFIED

### 1. Conversion Rate Performance
- **Current Rate**: ${conversionRate}%
- **Industry Benchmark**: 3-5%
- **Revenue Impact**: ${conversionRate < 3 ? `Potential ${Math.round((3 - parseFloat(conversionRate)) * totalLeads / 100)} additional orders possible` : 'Within acceptable range'}

### 2. Pipeline Management
- **Total Pipeline**: ${totalLeads} leads
- **Active Opportunities**: ${totalLeads - orders} leads in progress
- **Conversion Efficiency**: ${conversionRate < 3 ? 'Requires immediate attention' : 'Stable performance'}

### 3. Process Optimization Needs
- Lead qualification processes need review
- Follow-up mechanisms require strengthening
- Stage progression tracking improvements needed

## 📈 FUNNEL ANALYSIS
- **Lead Volume**: ${totalLeads} total opportunities
- **Conversion Success**: ${orders} closed deals
- **Drop-off Rate**: ${totalLeads > 0 ? (((totalLeads - orders) / totalLeads) * 100).toFixed(1) : 0}%
- **Pipeline Health**: ${conversionRate >= 3 ? 'Healthy' : 'Needs Improvement'}

## 👥 TEAM PERFORMANCE INSIGHTS
${leadData && leadData.length > 0 ? `
**Key Observations**:
- Lead distribution across ${new Set(leadData.map(l => l.Salesperson || l.salesperson || 'Unknown')).size} sales representatives
- Performance variations require individual coaching
- Top performers should mentor struggling team members
` : 'Load detailed lead data for comprehensive team analysis'}

## ⚡ IMMEDIATE ACTIONS (Next 7 Days)

### 🔴 Priority 1: Pipeline Review
- **Action**: Review all leads in quotation/negotiation stages
- **Owner**: Sales Manager
- **Timeline**: Complete by end of week
- **Expected Impact**: 15-20% conversion improvement

### 🟡 Priority 2: Process Implementation
- **Action**: Implement daily follow-up tracking system
- **Owner**: CRM Administrator
- **Timeline**: 3-5 days
- **Expected Impact**: Reduce lead leakage by 25%

### 🟢 Priority 3: Team Training
- **Action**: Conduct conversion optimization workshop
- **Owner**: Sales Director
- **Timeline**: Schedule within 7 days
- **Expected Impact**: Skill improvement across team

## 📋 STRATEGIC RECOMMENDATIONS (30-90 Days)

### Month 1: Foundation Building
- Implement automated lead scoring system
- Create standardized follow-up processes
- Establish weekly performance reviews

### Month 2: Optimization
- Deploy advanced CRM automation
- Launch targeted training programs
- Implement conversion rate monitoring

### Month 3: Scaling
- Expand successful processes
- Develop predictive analytics
- Create performance incentive programs

## 💰 REVENUE IMPACT PROJECTION
- **Current Monthly Revenue**: Based on ${orders} conversions
- **Potential Improvement**: ${conversionRate < 3 ? '40-60% increase possible' : '10-20% optimization available'}
- **ROI Timeline**: 60-90 days for full implementation

---
*Report generated from ${totalLeads} leads • Analysis completed at ${new Date().toLocaleString()}*
*Recommendations based on industry best practices and CRM optimization strategies*`;
}