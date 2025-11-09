"use client";

import { useState } from 'react';
import { Mail, Share2, Search, Target, Zap, BarChart3, Users, TrendingUp } from 'lucide-react';

interface MarketingCampaign {
  id: string;
  name: string;
  type: 'email' | 'social' | 'seo' | 'ads';
  status: 'active' | 'draft' | 'completed';
  reach: number;
  engagement: number;
  budget?: number;
  startDate: string;
  endDate?: string;
}

export default function MarketingTools() {
  const [activeTool, setActiveTool] = useState<'email' | 'social' | 'seo' | 'analytics'>('email');
  const [campaigns] = useState<MarketingCampaign[]>([
    {
      id: '1',
      name: 'Holiday Sale Email Campaign',
      type: 'email',
      status: 'active',
      reach: 12500,
      engagement: 8.5,
      startDate: '2024-11-01'
    },
    {
      id: '2',
      name: 'Black Friday Social Media',
      type: 'social',
      status: 'draft',
      reach: 0,
      engagement: 0,
      startDate: '2024-11-29'
    },
    {
      id: '3',
      name: 'SEO Optimization Q4',
      type: 'seo',
      status: 'active',
      reach: 50000,
      engagement: 12.3,
      startDate: '2024-10-01'
    }
  ]);

  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('all');

  const handleSendEmail = async () => {
    if (!emailSubject || !emailContent) {
      alert('Please fill in both subject and content');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/marketing/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          subject: emailSubject,
          content: emailContent,
          segment: selectedSegment
        })
      });

      if (response.ok) {
        alert('Email campaign created successfully!');
        setEmailSubject('');
        setEmailContent('');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to send email campaign');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email campaign');
    }
  };

  const handleCreateSocialPost = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/marketing/social', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          content: 'Sample social media post content',
          platforms: ['facebook', 'twitter'],
          scheduledDate: new Date().toISOString()
        })
      });

      if (response.ok) {
        alert('Social media post scheduled successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to schedule social post');
      }
    } catch (error) {
      console.error('Error creating social post:', error);
      alert('Failed to schedule social post');
    }
  };

  const handleOptimizeSEO = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/marketing/seo/optimize', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('SEO optimization recommendations generated!');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to generate SEO recommendations');
      }
    } catch (error) {
      console.error('Error optimizing SEO:', error);
      alert('Failed to generate SEO recommendations');
    }
  };

  const handleSEOKeywordResearch = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/marketing/seo/keywords', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Keyword research completed!');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to research keywords');
      }
    } catch (error) {
      console.error('Error researching keywords:', error);
      alert('Failed to research keywords');
    }
  };

  const handleGenerateMetaTags = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/marketing/seo/metatags', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Meta tags generated successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to generate meta tags');
      }
    } catch (error) {
      console.error('Error generating meta tags:', error);
      alert('Failed to generate meta tags');
    }
  };

  const handleRunSEOAudit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/marketing/seo/audit', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('SEO audit completed!');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to run SEO audit');
      }
    } catch (error) {
      console.error('Error running SEO audit:', error);
      alert('Failed to run SEO audit');
    }
  };

  return (
    <div className="space-y-6">
      {/* Tool Selection */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Digital Marketing Tools</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { id: 'email', label: 'Email Marketing', icon: Mail, color: 'bg-blue-500' },
              { id: 'social', label: 'Social Media', icon: Share2, color: 'bg-green-500' },
              { id: 'seo', label: 'SEO Tools', icon: Search, color: 'bg-purple-500' },
              { id: 'analytics', label: 'Marketing Analytics', icon: BarChart3, color: 'bg-orange-500' }
            ].map(({ id, label, icon: Icon, color }) => (
              <button
                key={id}
                onClick={() => setActiveTool(id as 'email' | 'social' | 'seo' | 'analytics')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  activeTool === id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mb-3 mx-auto`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-medium text-gray-900 text-center">{label}</h3>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Email Marketing Tool */}
      {activeTool === 'email' && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Email Campaign Creator</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Subject
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email subject line"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Segment
                </label>
                <select
                  value={selectedSegment}
                  onChange={(e) => setSelectedSegment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Subscribers</option>
                  <option value="active">Active Customers</option>
                  <option value="inactive">Inactive Customers</option>
                  <option value="new">New Subscribers</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Content
              </label>
              <textarea
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write your email content here..."
              />
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                <p>Estimated recipients: 12,500</p>
                <p>Estimated open rate: 24%</p>
              </div>
              <button
                onClick={handleSendEmail}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Mail className="w-4 h-4 mr-2" />
                Send Campaign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Social Media Tool */}
      {activeTool === 'social' && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Social Media Scheduler</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Post Content
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="What's on your mind?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platforms
                </label>
                <div className="space-y-2">
                  {['Facebook', 'Instagram', 'Twitter', 'LinkedIn'].map(platform => (
                    <label key={platform} className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                      <span className="ml-2 text-sm text-gray-700">{platform}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Schedule Date & Time
              </label>
              <input
                type="datetime-local"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleCreateSocialPost}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Schedule Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SEO Tools */}
      {activeTool === 'seo' && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">SEO Optimization Tools</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 border rounded-lg">
                <Search className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900">Keyword Research</h4>
                <p className="text-sm text-gray-600 mt-1">Find high-ranking keywords</p>
                <button
                  onClick={handleSEOKeywordResearch}
                  className="mt-3 px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700"
                >
                  Research Keywords
                </button>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900">Meta Tags</h4>
                <p className="text-sm text-gray-600 mt-1">Optimize page meta tags</p>
                <button
                  onClick={handleGenerateMetaTags}
                  className="mt-3 px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700"
                >
                  Generate Tags
                </button>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <Zap className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900">Performance</h4>
                <p className="text-sm text-gray-600 mt-1">Check site performance</p>
                <button
                  onClick={handleOptimizeSEO}
                  className="mt-3 px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700"
                >
                  Run Audit
                </button>
              </div>
            </div>

            <div className="border-t pt-6">
              <h4 className="font-medium text-gray-900 mb-4">SEO Recommendations</h4>
              <div className="space-y-3">
                <div className="flex items-start p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="shrink-0">
                    <Search className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-800">
                      Add meta descriptions to 15 pages missing them
                    </p>
                  </div>
                </div>

                <div className="flex items-start p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="shrink-0">
                    <Target className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-800">
                      Improve mobile page speed - currently 2.8s (target: under 2.5s)
                    </p>
                  </div>
                </div>

                <div className="flex items-start p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="shrink-0">
                    <Zap className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-800">
                      Add structured data to product pages for rich snippets
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Marketing Analytics */}
      {activeTool === 'analytics' && (
        <div className="space-y-6">
          {/* Campaign Performance */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Campaign Performance</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Campaign
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reach
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Engagement
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {campaign.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {campaign.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          campaign.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : campaign.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {campaign.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {campaign.reach.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {campaign.engagement}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Marketing Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Email Open Rate</p>
                  <p className="text-2xl font-bold text-gray-900">24.5%</p>
                  <p className="text-sm text-green-600">+2.1% from last month</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Social Followers</p>
                  <p className="text-2xl font-bold text-gray-900">15.2K</p>
                  <p className="text-sm text-green-600">+8.5% from last month</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Search className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Organic Traffic</p>
                  <p className="text-2xl font-bold text-gray-900">45.8K</p>
                  <p className="text-sm text-green-600">+12.3% from last month</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">ROI</p>
                  <p className="text-2xl font-bold text-gray-900">342%</p>
                  <p className="text-sm text-green-600">+15.7% from last month</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}