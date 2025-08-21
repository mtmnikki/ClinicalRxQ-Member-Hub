import React, { useState, useMemo } from 'react'
import Header from '../components/layout/Header'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Link } from 'react-router'
import {
  // Icons used in replaced sections
  Play,
  Users,
  Clock,
  CheckCircle,
  ArrowRight,
  Star,
  Target,
  Zap,
  Shield,
  Award,
  FileText,
  Heart,
  // Icons used in the rest of the existing sections (kept)
  Users as UsersIcon,
  Quote,
  BookOpen,
  Stethoscope,
  TrendingUp,
  Lightbulb
} from 'lucide-react'

/**
 * Interface for safely renderable text values
 */
interface SafeTextProps {
  /** String to render safely with fallback */
  value?: string
  /** Optional className for styling */
  className?: string
}

/**
 * Renders text with a safe fallback to avoid undefined in the UI
 */
const SafeText: React.FC<SafeTextProps> = ({ value, className }) => {
  return <span className={className}>{value ?? ''}</span>
}

/**
 * Program card item interface for the (replaced) Programs section
 */
interface ProgramCardItem {
  /** Program display name */
  title: string
  /** Short description for the program card */
  description: string
  /** Lucide icon component for the card */
  icon: React.ComponentType<{ className?: string }>
  /** Bullet features to display under the description */
  features: string[]
}

/**
 * Small reusable card to display program information in the Programs section (replaced design)
 */
function ProgramCard({ item }: { item: ProgramCardItem }) {
  return (
    <Card className="bg-gray-800/70 border-gray-700 hover:bg-gray-800 transition-colors">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <item.icon className="h-5 w-5 text-white" />
          </div>
          <CardTitle className="text-white text-lg">
            <SafeText value={item.title} />
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300 text-sm mb-4">
          <SafeText value={item.description} />
        </p>
        <ul className="space-y-2">
          {item.features.map((feature, idx) => (
            <li key={idx} className="flex items-center text-sm text-gray-400">
              <CheckCircle className="h-3 w-3 text-green-400 mr-2" />
              <SafeText value={feature} />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

/**
 * Home Page component
 * The first three sections are replaced per user's exact code.
 */
const HomePage: React.FC = () => {
  /**
   * Active feature card index for subtle selected styling in the Advantage section
   */
  const [activeFeature, setActiveFeature] = useState(0)

  /**
   * Feature list for "The ClinicalRxQ Advantage" section
   * Matches exactly the provided content (3 items).
   */
  const features = [
    {
      title: 'Operational Flywheel',
      description:
        'Transform from reactive dispensing to proactive, appointment-based care with TimeMyMeds synchronization',
      icon: Target,
      color: 'from-green-300 to-teal-400'
    },
    {
      title: 'Technician Force Multiplier',
      description:
        'Empower your pharmacy technicians to handle operational tasks, freeing pharmacists for clinical excellence',
      icon: Users,
      color: 'from-teal-500 to-cyan-300'
    },
    {
      title: 'Turnkey Clinical Infrastructure',
      description:
        'Complete business-in-a-box solution with protocols, forms, billing codes, and implementation guides',
      icon: Shield,
      color: 'from-cyan-400 to-blue-700'
    }
  ]

  /**
   * Programs displayed in the homepage programs section
   * Matches exactly the provided content.
   */
  const programs: ProgramCardItem[] = [
    {
      title: 'TimeMyMeds',
      description:
        'Create predictable appointment schedules that enable clinical service delivery',
      icon: Clock,
      features: ['Comprehensive Reviews', 'Billing Expertise', 'Patient Outcomes']
    },
    {
      title: 'MTM The Future Today',
      description:
        'Team-based Medication Therapy Management with proven protocols and technician workflows',
      icon: FileText,
      features: ['Comprehensive Reviews', 'Billing Expertise', 'Patient Outcomes']
    },
    {
      title: 'Test & Treat Services',
      description:
        'Point-of-care testing and treatment for Flu, Strep, and COVID-19',
      icon: Zap,
      features: ['CLIA-Waived Testing', 'State Protocols', 'Medical Billing']
    },
    {
      title: 'HbA1c Testing',
      description:
        'Diabetes management with point-of-care A1c testing and clinical integration',
      icon: Award,
      features: ['Quality Metrics', 'Provider Communication', 'Value-Based Care']
    },
    {
      title: 'Pharmacist-Initiated Oral Contraceptives',
      description:
        'From patient intake to medical billing, our protocols are here for your team and patients',
      icon: Heart,
      features: [
        'Practice-Based Clinical Skills',
        'Pharmacy Tech Training',
        'Prescribing with Confidence'
      ]
    }
  ]

  // Keep existing memoized list for other preserved sections if needed.
  const preservedPrograms = useMemo(() => [], [])

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section (REPLACED - exact as provided) */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-300 via-cyan-200 to-Teal-200 opacity-10"></div>
        <div className="absolute inset-0 bg-[url('https://pub-cdn.sider.ai/u/U03VH4NVNOE/web-coder/687655a5b1dac45b18db4f5c/resource/cd53336d-d6e2-4c6b-bf62-bba9d1f359ba.png')] bg-center bg-cover opacity-20"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-6">
                <Badge className="bg-gradient-to-r from-blue-600 to-teal-400 text-white border-0">
                  Where Dispensing Meets Direct Patient Care
                </Badge>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                Transform Your{' '}
                <span className="bg-gradient-to-r from-blue-600 via-cyan-400 to-teal-300 bg-clip-text text-transparent">
                  Pharmacy Practice
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                The complete ecosystem for community pharmacy teams to deliver profitable, patient-centered
                clinical services with proven protocols and turnkey infrastructure.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/programs">
                  <Button
                    size="lg"
                    className="bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-teal-300 hover-border-2 border-gradient-blue-500 text-white shadow-lg"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Explore Programs
                  </Button>
                </Link>
                <Link to="/enroll">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-blue-600 text-blue-700 hover: hover:bg-blue-200"
                  >
                    Get Started Today
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  No long-term contracts
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  30-day money-back guarantee
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <img
                  src="https://pub-cdn.sider.ai/u/U03VH4NVNOE/web-coder/687655a5b1dac45b18db4f5c/resource/586a328a-c576-4a4b-ab52-e4c62129d105.png"
                  alt="Pharmacist providing clinical care"
                  className="rounded-2xl shadow-2xl"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-full h-full bg-gradient-to-br from-cyan-500 to-cyan-500 rounded-2xl opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* The ClinicalRxQ Advantage (REPLACED - exact as provided) */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-blue-400 to-cyan-500 text-white border-0 mb-4">
              THE CLINICALRXQ ADVANTAGE
            </Badge>
            <h2 className="text-4xl font-bold mb-4">
              A better way to build your{' '}
              <span className="bg-gradient-to-r from-cyan-500 to-teal-600 bg-clip-text text-transparent">clinical practice</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our integrated ecosystem addresses the primary barriers—time, workflow, and profitability—that
              have historically hindered widespread adoption of advanced clinical services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer ${
                  activeFeature === index ? 'ring-2 ring-cyan-500' : ''
                }`}
                onClick={() => setActiveFeature(index)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-5`}></div>
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">
                    <SafeText value={feature.title} />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    <SafeText value={feature.description} />
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section (REPLACED - exact as provided) */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading and description */}
          <div className="mb-14 text-left">
            <p className="text-2xl sm:text-3xl font-semibold text-white/90">Comprehensive, Team-Based</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold mt-1">
              <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                Training &amp; Resources
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 mt-6 max-w-3xl">
              Practice-based training modules, step-by-step implementation protocols, and specialized
              documentation forms and resources built for community pharmacy teams, by community pharmacy teams.
            </p>
            <p className="text-sm sm:text-base text-gray-400 mt-4">
              Tested. Refined. Shared. Transform the profession by transforming our practice.
            </p>

            <div className="mt-6">
              <Link to="/programs">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent border-cyan-500 text-cyan-400 hover:bg-white hover:text-gray-900"
                >
                  View All Programs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Program cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {/* Row 1: first three cards */}
            <ProgramCard item={programs[0]} />
            <ProgramCard item={programs[1]} />
            <ProgramCard item={programs[2]} />

            {/* Row 2: pharmacist image at bottom-left */}
            <div className="hidden md:block relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700 shadow-xl">
              <img
                src="https://pub-cdn.sider.ai/u/U03VH4NVNOE/web-coder/687655a5b1dac45b18db4f5c/resource/f91471b8-97b6-486e-b92b-c30c929298d4.png"
                alt="Pharmacist gesturing to programs"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent" />
            </div>

            {/* Row 2: two more cards to the right */}
            <ProgramCard item={programs[3]} />
            <ProgramCard item={programs[4]} />
          </div>
        </div>
      </section>

      {/* ----------------------- PRESERVED EXISTING SECTIONS BELOW ----------------------- */}

      {/* Trust badges / top benefits (existing, preserved) */}
      <section className="mx-auto max-w-[1200px] px-4 py-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-white p-4">
            <div className="text-sm font-semibold">Documentation Standardization</div>
            <div className="text-sm text-slate-600">Legally compliant, professionally designed forms</div>
          </div>
          <div className="rounded-lg border bg-white p-4">
            <div className="text-sm font-semibold">Workflow Optimization</div>
            <div className="text-sm text-slate-600">Step-by-step implementation guides and training</div>
          </div>
          <div className="rounded-lg border bg-white p-4">
            <div className="text-sm font-semibold">Revenue Diversification</div>
            <div className="text-sm text-slate-600">Medical billing capabilities and reimbursable services</div>
          </div>
        </div>
      </section>

      {/* The Three Pillars (existing, preserved) */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-300 text-white border-0 mb-4">
              THE CLINICALRXQ FOUNDATION
            </Badge>
            <h2 className="text-4xl font-bold mb-4">
              The Three{' '}
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-300 bg-clip-text text-transparent">
                Pillars
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three foundational principles that work in concert to overcome the most
              significant barriers to practice transformation
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-500 opacity-5"></div>
              <CardHeader className="relative z-10">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center mb-4">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl mb-2">The Operational Flywheel</CardTitle>
                <p className="text-gray-600 font-medium">A self-reinforcing cycle of care and revenue</p>
              </CardHeader>
              <CardContent className="relative z-10">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">TimeMyMeds creates predictable monthly appointments</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Protected time enables billable clinical services</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Revenue funds program expansion</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">More patients = more clinical opportunities</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-teal-400 opacity-5"></div>
              <CardHeader className="relative z-10">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-400 flex items-center justify-center mb-4">
                  <UsersIcon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl mb-2">Technician as Force Multiplier</CardTitle>
                <p className="text-gray-600 font-medium">Strategic elevation of the pharmacy technician</p>
              </CardHeader>
              <CardContent className="relative z-10">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Technicians manage MTM platforms and scheduling</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Handle all paperwork and documentation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Process billing and claims submission</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Pharmacists focus exclusively on clinical care</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-green-400 opacity-5"></div>
              <CardHeader className="relative z-10">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-teal-400 to-green-400 flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl mb-2">Turnkey Clinical Infrastructure</CardTitle>
                <p className="text-gray-600 font-medium">Complete 'business-in-a-box' solution</p>
              </CardHeader>
              <CardContent className="relative z-10">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Step-by-step Standard Operating Procedures</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">All necessary forms and worksheets</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Specific CPT, HCPCS, and ICD-10 codes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Software platform navigation guides</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What Makes Us Different (existing, preserved) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              The ClinicalRxQ{' '}
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-300 bg-clip-text text-transparent">
                Difference
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We don't just teach clinical knowledge—we provide the complete infrastructure
              for successful implementation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-300 flex items-center justify-center">
                    <Stethoscope className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">Designed by Community Pharmacists</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Every protocol was created and tested in real community pharmacy settings by practicing pharmacists who understand your daily challenges.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-300 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">Implementation, Not Just Education</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We teach the 'how,' not just the 'what.' Complete operational toolkits ensure you can launch services immediately and correctly.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-300 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">Proven Financial Models</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Each service includes detailed billing protocols and proven revenue models. TimeMyMeds alone generates $75,000 per 100 patients enrolled.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-300 flex items-center justify-center">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">Patient-Centered Approach</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Transform from product-centric dispensing to patient-centered care that improves outcomes and builds lasting relationships.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Target Audience (existing, preserved) */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Who We{' '}
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-300 bg-clip-text text-transparent">
                Serve
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <Lightbulb className="h-12 w-12 text-cyan-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Licensed Pharmacists</h3>
                <p className="text-gray-600 text-sm">
                  Community-based practitioners ready to expand their clinical services
                  and practice at the top of their license
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <UsersIcon className="h-12 w-12 text-cyan-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Certified Pharmacy Technicians</h3>
                <p className="text-gray-600 text-sm">
                  Essential team members who multiply pharmacist effectiveness through
                  operational excellence
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Heart className="h-12 w-12 text-cyan-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">All Practice Settings</h3>
                <p className="text-gray-600 text-sm">
                  From independent single-store pharmacies to large multi-site enterprises
                  seeking transformation
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Philosophy (existing, preserved) */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Our{' '}
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-300 bg-clip-text text-transparent">
                Philosophy
              </span>
            </h2>
            <div className="max-w-4xl mx-auto">
              <Card className="bg-white shadow-xl">
                <CardContent className="p-8">
                  <Quote className="h-8 w-8 text-cyan-400 mb-4 mx-auto" />
                  <p className="text-2xl font-bold text-gray-800 mb-6 leading-relaxed">
                    "Retail is a FOUR-LETTER Word. We are COMMUNITY PHARMACISTS."
                  </p>
                  <p className="text-lg text-gray-700 mb-4">
                    Retailers sell product. Community Pharmacists deliver medical treatments.
                    We provide counseling and clinical services to accompany the medical
                    treatments we deliver to our patients.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Our program emphasizes the important role the Community Pharmacist plays
                    on the healthcare team and trains Community Pharmacists on how to utilize
                    their clinical training inside the community pharmacy workflow.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* About - Mission (existing, preserved) */}
      <section className="py-16">
        <div className="mx-auto max-w-[1200px] px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-0 mb-4">
                OUR MISSION
              </Badge>
              <h2 className="text-3xl font-bold mb-6">
                Empowering Community Pharmacists
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                ClinicalRxQ was founded to address the critical need for standardized,
                evidence-based clinical pharmacy services in community settings. We provide
                comprehensive training, protocols, and documentation systems that enable
                pharmacies to deliver enhanced patient care services.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Target className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Evidence-Based Protocols</p>
                    <p className="text-gray-600 text-sm">
                      All resources developed using current clinical guidelines and best practices
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Team-Based Approach</p>
                    <p className="text-gray-600 text-sm">
                      Comprehensive training for both pharmacists and pharmacy technicians
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Heart className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Patient-Centered Care</p>
                    <p className="text-gray-600 text-sm">
                      Focus on improving patient outcomes through enhanced pharmacy services
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://pub-cdn.sider.ai/u/U0X7H845ROR/web-coder/689cc75ea616cfbf06746dc2/resource/b497dbb6-85a1-4546-9fda-3e4492cb21d6.jpg"
                alt="Pharmacy team collaboration"
                className="rounded-2xl shadow-2xl object-cover w-full h-full"
              />
              <div className="absolute -top-4 -right-4 w-full h-full bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-300 rounded-2xl opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* About - Values (existing, preserved) */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-[1200px] px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at ClinicalRxQ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We maintain the highest standards in clinical content, training materials,
                  and customer support.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-cyan-100 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-cyan-600" />
                </div>
                <CardTitle>Collaboration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We believe in the power of teamwork and work closely with pharmacy
                  professionals to develop practical solutions.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-teal-600" />
                </div>
                <CardTitle>Compassion</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We are driven by a genuine desire to improve patient care and support
                  community pharmacists in their vital role.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section (existing, preserved) */}
      <section className="py-20 bg-gradient-to-br from-blue-800 via-cyan-500 to-teal-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Practice?</h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of pharmacy professionals who have revolutionized their practice with ClinicalRxQ
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/join">
              <Button size="lg" className="bg-blue-800 text-white hover:bg-teal-500 shadow-lg">
                {/* Keep original icon to avoid import changes */}
                <Play className="mr-2 h-5 w-5" />
                Start Your Transformation
              </Button>
            </Link>
            <Link to="/programs">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-teal-400 text-teal-100 hover:bg-white hover:text-cyan-600"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Explore Programs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer CTA (existing, preserved) */}
      <footer className="bg-[#1A2332] py-10 text-white">
        <div className="mx-auto max-w-[1200px] px-4">
          <div className="text-center">
            <h2 className="text-2xl font-semibold">Ready to Transform Your Practice?</h2>
            <div className="mx-auto mt-4 flex max-w-md gap-2">
              <input
                className="flex-1 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder-white/60 outline-none"
                placeholder="Enter your email"
              />
              <Button>Get Started</Button>
            </div>
            <div className="mt-3 text-xs text-white/70">
              By subscribing you agree to our Privacy Policy and Terms.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
