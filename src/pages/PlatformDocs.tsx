import React, { useState } from 'react';
import { ChevronDown, ChevronRight, BookOpen, Users, Target, Shield, Zap, TrendingUp, MapPin, Smartphone, Globe, Lock, Award, ArrowRight, X, Menu } from 'lucide-react';

interface DocsSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function DocsSection({ title, icon, children, defaultOpen = false }: DocsSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-green-50 to-white hover:from-green-100 hover:to-green-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="text-green-600">{icon}</div>
          <h3 className="font-bold text-lg text-gray-900">{title}</h3>
        </div>
        {isOpen ? (
          <ChevronDown className="w-5 h-5 text-green-600" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-400" />
        )}
      </button>
      {isOpen && (
        <div className="px-6 py-5 text-gray-700 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}

interface PlatformDocsProps {
  onClose?: () => void;
}

export function PlatformDocs({ onClose }: PlatformDocsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'userflow' | 'technical'>('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-12 px-4 shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <BookOpen className="w-10 h-10" />
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">सही Mandi Documentation</h1>
                <p className="text-green-100 mt-1">Complete Platform Guide & Roadmap</p>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
            {[
              { id: 'overview', label: 'Overview', icon: <Target className="w-4 h-4" /> },
              { id: 'features', label: 'Features', icon: <Zap className="w-4 h-4" /> },
              { id: 'userflow', label: 'User Flow', icon: <Users className="w-4 h-4" /> },
              { id: 'technical', label: 'Technical', icon: <Smartphone className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white text-green-600 shadow-md'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        
        {activeTab === 'overview' && (
          <>
            {/* Mission Statement */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 text-white shadow-xl">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Target className="w-7 h-7" />
                Our Mission
              </h2>
              <p className="text-lg text-green-50 leading-relaxed">
                Help rural farmers discover the best mandis (agricultural markets) and analyze crop prices to maximize their income through data-driven decision making. We bridge the information gap between farmers and agricultural markets by providing real-time price insights, smart recommendations, and actionable market intelligence.
              </p>
            </div>

            {/* Platform Overview */}
            <DocsSection
              title="What is सही Mandi?"
              icon={<BookOpen className="w-6 h-6" />}
              defaultOpen={true}
            >
              <div className="space-y-4">
                <p>
                  <strong>सही Mandi</strong> is a comprehensive React-based web platform designed specifically to empower Indian farmers by helping them make informed decisions about where and when to sell their crops for maximum profit.
                </p>
                
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="font-medium text-blue-900 mb-2">Platform Name Meaning:</p>
                  <ul className="space-y-1 text-blue-800">
                    <li>• <strong>सही</strong> (Sahi) = Right/Correct in Hindi</li>
                    <li>• <strong>Mandi</strong> = Agricultural wholesale market in India</li>
                    <li>• <strong>Combined:</strong> "The Right Market" - helping farmers find the correct mandi for their crops</li>
                  </ul>
                </div>
              </div>
            </DocsSection>

            {/* Target Audience */}
            <DocsSection
              title="Target Audience"
              icon={<Users className="w-6 h-6" />}
            >
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Primary Users: Farmers</h4>
                  <ul className="space-y-2 ml-4">
                    <li>• <strong>Demographics:</strong> Rural Indian farmers with varying literacy levels</li>
                    <li>• <strong>Crop Types:</strong> Wheat, Rice, Cotton, Sugarcane, and more</li>
                    <li>• <strong>Pain Points:</strong></li>
                  </ul>
                  <div className="ml-8 mt-2 space-y-1 text-sm">
                    <p>- Lack of real-time price information</p>
                    <p>- Difficulty comparing multiple mandis</p>
                    <p>- Transportation cost uncertainty</p>
                    <p>- Limited market access and information asymmetry</p>
                    <p>- Low digital literacy</p>
                  </div>
                </div>

                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <h4 className="font-bold text-green-900 mb-2">Design Considerations for Rural Users:</h4>
                  <ul className="space-y-1 text-green-800">
                    <li>✓ Visual-first design with icons, images, and colors</li>
                    <li>✓ Hindi language support (bilingual interface)</li>
                    <li>✓ Voice assistance features (planned)</li>
                    <li>✓ Large touch targets for mobile</li>
                    <li>✓ Simple navigation with minimal clicks</li>
                  </ul>
                </div>
              </div>
            </DocsSection>

            {/* Design Philosophy */}
            <DocsSection
              title="Design Philosophy"
              icon={<Award className="w-6 h-6" />}
            >
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Color Palette</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-green-600 rounded-lg text-white text-center">
                      <div className="font-bold">Primary</div>
                      <div className="text-sm">#16a34a</div>
                    </div>
                    <div className="p-4 bg-blue-600 rounded-lg text-white text-center">
                      <div className="font-bold">Info</div>
                      <div className="text-sm">#2563eb</div>
                    </div>
                    <div className="p-4 bg-orange-600 rounded-lg text-white text-center">
                      <div className="font-bold">Warning</div>
                      <div className="text-sm">#ea580c</div>
                    </div>
                    <div className="p-4 bg-red-600 rounded-lg text-white text-center">
                      <div className="font-bold">Error</div>
                      <div className="text-sm">#dc2626</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Trust Score Colors</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-6 bg-green-700 rounded"></div>
                      <span>90-100: Excellent</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-6 bg-green-500 rounded"></div>
                      <span>75-89: Good</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-6 bg-yellow-500 rounded"></div>
                      <span>60-74: Average</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-6 bg-red-500 rounded"></div>
                      <span>0-59: Poor</span>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                  <h4 className="font-bold text-purple-900 mb-2">Accessibility Features</h4>
                  <ul className="space-y-1 text-purple-800">
                    <li>• Semantic HTML for screen readers</li>
                    <li>• WCAG AA color contrast compliance</li>
                    <li>• Keyboard navigation support</li>
                    <li>• Adjustable text size (Normal/Large)</li>
                    <li>• Clear focus indicators</li>
                  </ul>
                </div>
              </div>
            </DocsSection>
          </>
        )}

        {activeTab === 'features' && (
          <>
            {/* Key Features */}
            <DocsSection
              title="1. Mandi Discovery System"
              icon={<MapPin className="w-6 h-6" />}
              defaultOpen={true}
            >
              <div className="space-y-3">
                <p className="font-medium text-gray-900">Browse and search mandis by location, distance, and ratings</p>
                <ul className="space-y-2 ml-4">
                  <li>• Real-time search with filtering</li>
                  <li>• Trust Score algorithm (0-100) based on:</li>
                  <div className="ml-6 text-sm space-y-1">
                    <p>- User ratings (30%)</p>
                    <p>- Price competitiveness (25%)</p>
                    <p>- Payment reliability (25%)</p>
                    <p>- Facility quality (20%)</p>
                  </div>
                  <li>• Detailed mandi profiles with contact info and facilities</li>
                  <li>• Operating hours and location details</li>
                </ul>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-gray-600 mb-2">Access Level:</p>
                  <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    <Globe className="w-4 h-4" />
                    Public Access (No Login Required)
                  </span>
                </div>
              </div>
            </DocsSection>

            <DocsSection
              title="2. Smart Analyzer"
              icon={<TrendingUp className="w-6 h-6" />}
            >
              <div className="space-y-3">
                <p className="font-medium text-gray-900">Crop-specific price comparison and recommendations</p>
                <ul className="space-y-2 ml-4">
                  <li>• Select any crop to compare prices across all mandis</li>
                  <li>• AI-powered best mandi recommendations with reasoning</li>
                  <li>• Visual indicators:
                    <div className="ml-6 mt-2 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">BEST PRICE</span>
                        <span className="text-sm">Highest available rate</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold">NEAREST</span>
                        <span className="text-sm">Closest to your location</span>
                      </div>
                    </div>
                  </li>
                  <li>• Detailed cost breakdown including:
                    <div className="ml-6 text-sm space-y-1">
                      <p>- Market price per quintal</p>
                      <p>- Transport cost (based on distance)</p>
                      <p>- Loading/unloading charges</p>
                      <p>- Net profit calculation</p>
                    </div>
                  </li>
                  <li>• Trust score display for reliability</li>
                  <li>• "Why This Mandi?" insights explaining recommendations</li>
                </ul>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-gray-600 mb-2">Access Level:</p>
                  <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                    <Lock className="w-4 h-4" />
                    Requires Login/Registration
                  </span>
                </div>
              </div>
            </DocsSection>

            <DocsSection
              title="3. Farmer Dashboard"
              icon={<Users className="w-6 h-6" />}
            >
              <div className="space-y-3">
                <p className="font-medium text-gray-900">Personalized control center for farmers</p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">Overview Tab</h4>
                    <ul className="space-y-1 ml-4 text-sm">
                      <li>• Personalized crop cards for your selected crops</li>
                      <li>• Best available price for each crop</li>
                      <li>• Recommended mandi with distance</li>
                      <li>• One-click "View Details" to Smart Analyzer</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">Profile Tab</h4>
                    <ul className="space-y-1 ml-4 text-sm">
                      <li>• Upload profile avatar</li>
                      <li>• Edit personal details (Name, Age, Gender)</li>
                      <li>• Update location information</li>
                      <li>• Manage farm size and crop preferences</li>
                      <li>• Save changes instantly</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">Settings Tab</h4>
                    <ul className="space-y-1 ml-4 text-sm">
                      <li>• Language selection (English ↔️ Hindi)</li>
                      <li>• Text size adjustment (Normal/Large)</li>
                      <li>• Voice assistance toggle</li>
                      <li>• Notification preferences</li>
                      <li>• Help & Support access</li>
                      <li>• Secure logout option</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-gray-600 mb-2">Access Level:</p>
                  <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                    <Lock className="w-4 h-4" />
                    Requires Login/Registration
                  </span>
                </div>
              </div>
            </DocsSection>

            <DocsSection
              title="4. Authentication System"
              icon={<Shield className="w-6 h-6" />}
            >
              <div className="space-y-3">
                <p className="font-medium text-gray-900">Phone/OTP based secure authentication</p>
                
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-bold text-gray-800 mb-3">5-Step Registration Process:</h4>
                  <div className="space-y-3">
                    {[
                      { step: 1, title: 'Phone Number', desc: 'Enter 10-digit Indian mobile number' },
                      { step: 2, title: 'OTP Verification', desc: 'Verify with 6-digit code (Demo: 123456)' },
                      { step: 3, title: 'User Profile', desc: 'Name (required), Age & Gender (optional)' },
                      { step: 4, title: 'Location Details', desc: 'State → District → Pincode → Village/City' },
                      { step: 5, title: 'Crop Selection', desc: 'Choose crops you grow (multi-select)' },
                    ].map((item) => (
                      <div key={item.step} className="flex items-start gap-3">
                        <div className="bg-green-600 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {item.step}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{item.title}</p>
                          <p className="text-sm text-gray-600">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <ul className="space-y-2 ml-4 mt-4">
                  <li>• Progress indicator shows current step (1/5, 2/5, etc.)</li>
                  <li>• Back button available on each step</li>
                  <li>• Form validation before proceeding</li>
                  <li>• Auto-redirect to Dashboard after completion</li>
                </ul>
              </div>
            </DocsSection>

            <DocsSection
              title="5. Mandi Admin Portal"
              icon={<Smartphone className="w-6 h-6" />}
            >
              <div className="space-y-3">
                <p className="font-medium text-gray-900">Separate dashboard for mandi operators</p>
                <ul className="space-y-2 ml-4">
                  <li>• Secure admin login (Demo: admin/admin123)</li>
                  <li>• Performance analytics dashboard</li>
                  <li>• Real-time stats:
                    <div className="ml-6 text-sm space-y-1">
                      <p>- Today's transactions count</p>
                      <p>- Revenue tracking</p>
                      <p>- Registered farmers count</p>
                      <p>- Active crop listings</p>
                    </div>
                  </li>
                  <li>• Price management for all crops</li>
                  <li>• Visual analytics with charts</li>
                  <li>• Market insights and trends</li>
                </ul>
              </div>
            </DocsSection>
          </>
        )}

        {activeTab === 'userflow' && (
          <>
            {/* User Flow */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <ArrowRight className="w-6 h-6 text-green-600" />
                Complete User Journey
              </h2>

              {/* Flow 1 */}
              <div className="space-y-6">
                <div className="border-l-4 border-green-500 pl-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Flow 1: First-Time Visitor → Registered Farmer</h3>
                  
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                      <p className="font-bold text-blue-900 mb-2">Step 1: Landing Page</p>
                      <ul className="text-sm text-blue-800 space-y-1 ml-4">
                        <li>• User visits website homepage</li>
                        <li>• Sees hero section with platform benefits</li>
                        <li>• Featured mandis showcase</li>
                        <li>• Trust indicators (ratings, verified badges)</li>
                        <li>• "Get Started" CTA button</li>
                        <li>• Can browse public content without login</li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                      <p className="font-bold text-green-900 mb-2">Step 2: Authentication Flow</p>
                      <ul className="text-sm text-green-800 space-y-1 ml-4">
                        <li>• Click "Login/Register" or access Dashboard/Smart Analyzer</li>
                        <li>• Full-screen auth modal opens</li>
                        <li>• Screen 1: Enter 10-digit phone number</li>
                        <li>• Screen 2: Verify 6-digit OTP (Demo: 123456)</li>
                        <li>• Screen 3: Create profile (Name, Age, Gender)</li>
                        <li>• Screen 4: Location (State, District, Pincode, Village)</li>
                        <li>• Screen 5: Select crops (multi-select grid)</li>
                        <li>• Complete registration → Auto-redirect to Dashboard</li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                      <p className="font-bold text-purple-900 mb-2">Step 3: Farmer Dashboard</p>
                      <ul className="text-sm text-purple-800 space-y-1 ml-4">
                        <li>• Welcome message with user name</li>
                        <li>• Overview tab shows personalized crop cards</li>
                        <li>• Each card displays:
                          <div className="ml-4 mt-1">
                            <p>- Crop name and best market price</p>
                            <p>- Recommended mandi with distance</p>
                            <p>- "View Details" button</p>
                          </div>
                        </li>
                        <li>• Click "View Details" → Redirects to Smart Analyzer</li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg">
                      <p className="font-bold text-orange-900 mb-2">Step 4: Smart Analyzer</p>
                      <ul className="text-sm text-orange-800 space-y-1 ml-4">
                        <li>• Crop is pre-selected from dashboard</li>
                        <li>• Shows 3-6 mandi comparison cards</li>
                        <li>• Each card displays:
                          <div className="ml-4 mt-1">
                            <p>- Mandi name, rating, trust score</p>
                            <p>- Price per quintal with badges</p>
                            <p>- Distance and transport cost</p>
                            <p>- Net profit breakdown</p>
                            <p>- "Why This Mandi?" insights</p>
                          </div>
                        </li>
                        <li>• Click "विवरण" → View full mandi details</li>
                        <li>• Make informed decision about where to sell</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-blue-500 pl-6 mt-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Flow 2: Discovering Mandis (Public)</h3>
                  
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-4 rounded-lg">
                      <p className="font-bold text-teal-900 mb-2">No Login Required</p>
                      <ul className="text-sm text-teal-800 space-y-1 ml-4">
                        <li>• Navigate to "Mandis" from header</li>
                        <li>• Search bar with real-time filtering</li>
                        <li>• Filter by distance (&lt;10km, &lt;25km, 50km+)</li>
                        <li>• Filter by rating (4+★, 3+★)</li>
                        <li>• Sort by distance, price, or rating</li>
                        <li>• Browse mandi cards in grid layout</li>
                        <li>• Click any card → View detailed mandi page</li>
                        <li>• See prices, facilities, reviews, location</li>
                        <li>• Call mandi or get directions</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-red-500 pl-6 mt-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Flow 3: Admin Dashboard</h3>
                  
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg">
                      <p className="font-bold text-red-900 mb-2">Mandi Operators Only</p>
                      <ul className="text-sm text-red-800 space-y-1 ml-4">
                        <li>• Navigate to "Mandi Admin" from header</li>
                        <li>• Login with credentials (Demo: admin/admin123)</li>
                        <li>• View dashboard with key stats:
                          <div className="ml-4 mt-1">
                            <p>- Today's transactions</p>
                            <p>- Revenue tracking</p>
                            <p>- Registered farmers count</p>
                            <p>- Active listings</p>
                          </div>
                        </li>
                        <li>• Manage crop prices in real-time</li>
                        <li>• View analytics charts and trends</li>
                        <li>• Monitor market performance</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'technical' && (
          <>
            {/* Technical Details */}
            <DocsSection
              title="Technology Stack"
              icon={<Zap className="w-6 h-6" />}
              defaultOpen={true}
            >
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Frontend</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      'React 18+',
                      'TypeScript',
                      'Tailwind CSS v4',
                      'React Router',
                      'Recharts',
                      'Lucide Icons',
                    ].map((tech) => (
                      <div key={tech} className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center font-medium text-blue-900">
                        {tech}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Current Data Layer</h4>
                  <ul className="space-y-1 ml-4">
                    <li>• Mock data stored in <code className="bg-gray-100 px-2 py-1 rounded text-sm">/lib/mockData.ts</code></li>
                    <li>• CROPS: 20+ crop varieties with images</li>
                    <li>• MANDIS: 10+ market locations with details</li>
                    <li>• CURRENT_PRICES: Price matrix (mandi × crop)</li>
                    <li>• PRICE_HISTORY: 7-day historical data</li>
                    <li>• TRUST_SCORES: Reliability ratings</li>
                  </ul>
                </div>

                <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                  <h4 className="font-bold text-orange-900 mb-2">Planned: Supabase Backend</h4>
                  <ul className="space-y-1 text-orange-800">
                    <li>• PostgreSQL database for production data</li>
                    <li>• Supabase Auth with real phone/OTP</li>
                    <li>• Real-time price update subscriptions</li>
                    <li>• Cloud storage for images</li>
                    <li>• Row Level Security for data protection</li>
                  </ul>
                </div>
              </div>
            </DocsSection>

            <DocsSection
              title="File Structure"
              icon={<Menu className="w-6 h-6" />}
            >
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{`/
├── App.tsx                    # Main app router
├── components/
│   ├── layout/
│   │   ├── Header.tsx        # Navigation bar
│   │   └── Footer.tsx        # Site footer
│   ├── auth/
│   │   └── AuthModal.tsx     # Login/Registration
│   └── figma/
│       └── ImageWithFallback.tsx
├── pages/
│   ├── Home.tsx              # Landing page
│   ├── MandiDiscovery.tsx    # Mandi listing
│   ├── MandiDetails.tsx      # Individual mandi
│   ├── SmartAnalyzer.tsx     # Price comparison
│   ├── FarmerDashboard.tsx   # User dashboard
│   ├── Admin.tsx             # Mandi admin
│   ├── Chat.tsx              # AI assistant
│   └── PlatformDocs.tsx      # This page!
├── lib/
│   └── mockData.ts           # Mock database
└── styles/
    └── globals.css           # Global styles`}</pre>
              </div>
            </DocsSection>

            <DocsSection
              title="Data Schema"
              icon={<BookOpen className="w-6 h-6" />}
            >
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Crop Interface</h4>
                  <div className="bg-gray-900 text-blue-300 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    <pre>{`interface Crop {
  id: string;           // 'wheat', 'rice'
  name: string;         // Display name
  nameHindi: string;    // हिंदी नाम
  category: string;     // 'grains', 'vegetables'
  image: string;        // Unsplash URL
  unit: string;         // 'quintal', 'kg'
}`}</pre>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Mandi Interface</h4>
                  <div className="bg-gray-900 text-blue-300 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    <pre>{`interface Mandi {
  id: string;              // 'azadpur'
  name: string;            // 'Azadpur Mandi'
  location: string;        // 'New Delhi, Delhi'
  distance: string;        // '15 km'
  rating: number;          // 4.8 (out of 5)
  reviews: number;         // 234 reviews
  phone: string;           // Contact number
  operatingHours: string;  // 'Mon-Sat: 6 AM - 8 PM'
  facilities: string[];    // ['Parking', 'Storage']
}`}</pre>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Trust Score Algorithm</h4>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                    <p className="font-mono text-sm text-purple-900">
                      Trust Score = (<br />
                      &nbsp;&nbsp;Base Rating × 30 +<br />
                      &nbsp;&nbsp;Price Competitiveness × 25 +<br />
                      &nbsp;&nbsp;Payment Reliability × 25 +<br />
                      &nbsp;&nbsp;Facility Quality × 20<br />
                      ) / 100
                    </p>
                    <p className="text-sm text-purple-800 mt-3">Result: 0-100 score indicating mandi reliability</p>
                  </div>
                </div>
              </div>
            </DocsSection>

            <DocsSection
              title="Future Roadmap"
              icon={<TrendingUp className="w-6 h-6" />}
            >
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-5 rounded-xl">
                  <h4 className="font-bold text-lg mb-3">Phase 1: Supabase Integration (Next)</h4>
                  <ul className="space-y-2 text-green-50">
                    <li>✓ PostgreSQL database setup</li>
                    <li>✓ Real phone/OTP authentication</li>
                    <li>✓ Live price updates</li>
                    <li>✓ User data persistence</li>
                    <li>✓ Image storage (avatars, mandi photos)</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-5 rounded-xl">
                  <h4 className="font-bold text-lg mb-3">Phase 2: Enhanced Features</h4>
                  <ul className="space-y-2 text-blue-50">
                    <li>• Price alerts (SMS/Push notifications)</li>
                    <li>• Booking system for mandi space</li>
                    <li>• Payment integration</li>
                    <li>• Advanced analytics & ML predictions</li>
                    <li>• Community features (forums, reviews)</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-5 rounded-xl">
                  <h4 className="font-bold text-lg mb-3">Phase 3: Multilingual & Accessibility</h4>
                  <ul className="space-y-2 text-purple-50">
                    <li>• Full Hindi translation</li>
                    <li>• Regional languages (Punjabi, Marathi, Tamil, etc.)</li>
                    <li>• Voice search & text-to-speech</li>
                    <li>• Low-literacy mode with icons</li>
                    <li>• Tutorial videos</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-5 rounded-xl">
                  <h4 className="font-bold text-lg mb-3">Phase 4: Mobile App</h4>
                  <ul className="space-y-2 text-orange-50">
                    <li>• React Native iOS/Android app</li>
                    <li>• Offline mode with sync</li>
                    <li>• GPS-based distance calculation</li>
                    <li>• Push notifications</li>
                    <li>• Camera integration for crop photos</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-pink-500 to-rose-600 text-white p-5 rounded-xl">
                  <h4 className="font-bold text-lg mb-3">Phase 5: AI & Advanced Intelligence</h4>
                  <ul className="space-y-2 text-pink-50">
                    <li>• Machine learning price predictions</li>
                    <li>• Demand forecasting</li>
                    <li>• AI chatbot assistant</li>
                    <li>• Natural language queries</li>
                    <li>• Market trend analysis</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-5 rounded-xl">
                  <h4 className="font-bold text-lg mb-3">Phase 6: Ecosystem Expansion</h4>
                  <ul className="space-y-2 text-indigo-50">
                    <li>• Government partnerships (official data)</li>
                    <li>• Financial services (loans, insurance)</li>
                    <li>• Transport company integration</li>
                    <li>• B2B buyer marketplace</li>
                    <li>• Cold storage booking</li>
                  </ul>
                </div>
              </div>
            </DocsSection>

            <DocsSection
              title="Security & Privacy"
              icon={<Shield className="w-6 h-6" />}
            >
              <div className="space-y-4">
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <h4 className="font-bold text-green-900 mb-2">Data Protection</h4>
                  <ul className="space-y-1 text-green-800">
                    <li>✓ Phone numbers encrypted</li>
                    <li>✓ HTTPS secure communication</li>
                    <li>✓ No PII collection without consent</li>
                    <li>✓ Regular security audits planned</li>
                  </ul>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <h4 className="font-bold text-blue-900 mb-2">User Privacy</h4>
                  <ul className="space-y-1 text-blue-800">
                    <li>✓ Transparent data usage policy</li>
                    <li>✓ Opt-in for marketing communications</li>
                    <li>✓ Right to delete account</li>
                    <li>✓ Data export capability</li>
                  </ul>
                </div>
              </div>
            </DocsSection>
          </>
        )}

        {/* Bottom CTA */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-white text-center shadow-xl">
          <h3 className="text-2xl font-bold mb-3">Ready to Get Started?</h3>
          <p className="text-green-100 mb-6 max-w-2xl mx-auto">
            Join thousands of farmers who are already making better decisions with सही Mandi. 
            Find the best prices, discover trusted mandis, and maximize your profit today.
          </p>
          {onClose && (
            <button
              onClick={onClose}
              className="bg-white text-green-600 px-8 py-3 rounded-xl font-bold hover:bg-green-50 transition-colors shadow-lg"
            >
              Start Using सही Mandi
            </button>
          )}
        </div>
      </div>
    </div>
  );
}