/**
 * About page showcasing ClinicalRxQ's mission, philosophy, and methodology
 * Updated with accurate information from program briefs
 */
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { 
  Target, 
  Users, 
  Shield, 
  Heart, 
  Lightbulb,
  CheckCircle,
  Quote,
  ArrowRight,
  BookOpen,
  Stethoscope,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router';
import SafeText from '../components/common/SafeText';

export default function About() {
  const pillars = [
    {
      icon: Target,
      title: "The Operational Flywheel",
      description: "A self-reinforcing cycle of care and revenue",
      details: [
        "TimeMyMeds creates predictable monthly appointments",
        "Protected time enables billable clinical services",
        "Revenue funds program expansion",
        "More patients = more clinical opportunities"
      ],
      color: "from-blue-600 to-cyan-500"
    },
    {
      icon: Users,
      title: "Technician as Force Multiplier",
      description: "Strategic elevation of the pharmacy technician",
      details: [
        "Technicians manage MTM platforms and scheduling",
        "Handle all paperwork and documentation",
        "Process billing and claims submission",
        "Pharmacists focus exclusively on clinical care"
      ],
      color: "from-cyan-500 to-teal-400"
    },
    {
      icon: Shield,
      title: "Turnkey Clinical Infrastructure",
      description: "Complete 'business-in-a-box' solution",
      details: [
        "Step-by-step Standard Operating Procedures",
        "All necessary forms and worksheets",
        "Specific CPT, HCPCS, and ICD-10 codes",
        "Software platform navigation guides"
      ],
      color: "from-teal-400 to-green-400"
    }
  ];

  const differentiators = [
    {
      icon: Stethoscope,
      title: "Designed by Community Pharmacists",
      description: "Every protocol was created and tested in real community pharmacy settings by practicing pharmacists who understand your daily challenges."
    },
    {
      icon: BookOpen,
      title: "Implementation, Not Just Education",
      description: "We teach the 'how,' not just the 'what.' Complete operational toolkits ensure you can launch services immediately and correctly."
    },
    {
      icon: TrendingUp,
      title: "Proven Financial Models",
      description: "Each service includes detailed billing protocols and proven revenue models. TimeMyMeds alone generates $75,000 per 100 patients enrolled."
    },
    {
      icon: Heart,
      title: "Patient-Centered Approach",
      description: "Transform from product-centric dispensing to patient-centered care that improves outcomes and builds lasting relationships."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-300"></div>
        <div className="absolute inset-0 bg-[url('https://pub-cdn.sider.ai/u/U03VH4NVNOE/web-coder/687655a5b1dac45b18db4f5c/resource/cd53336d-d6e2-4c6b-bf62-bba9d1f359ba.png')] bg-center bg-cover opacity-20"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="mb-6">
            <Badge className="bg-white/20 text-white border-white/30">
              Where Dispensing Meets Direct Patient Care
            </Badge>
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold mb-6">
            About ClinicalRxQ
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            We're transforming community pharmacy from product-centric dispensaries into 
            patient-centered, decentralized healthcare hubs through comprehensive training 
            and turnkey clinical infrastructure.
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
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

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-0 mb-4">
                OUR MISSION
              </Badge>
              <h2 className="text-3xl font-bold mb-6">
                Tangibly Impact{' '}
                <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-300 bg-clip-text text-transparent">
                  Pharmacy Practice
                </span>
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Our mission is to deliver patient-centered, team-based training and protocols 
                for the provision of enhanced clinical services. We design educational activities 
                to increase the efficiency and efficacy of these services, with a specific focus 
                on integrating pharmacy technicians into the clinical workflow.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Standardize Clinical Services</p>
                    <p className="text-gray-600 text-sm">
                      Consistent preventive and chronic disease management across all settings
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Elevate the Pharmacist Role</p>
                    <p className="text-gray-600 text-sm">
                      Position pharmacists as indispensable healthcare providers
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Maximize Financial Viability</p>
                    <p className="text-gray-600 text-sm">
                      Align services with payer expectations for sustainable revenue
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://pub-cdn.sider.ai/u/U03VH4NVNOE/web-coder/687655a5b1dac45b18db4f5c/resource/7dbdc3ac-3984-4d36-b13b-f3874cbf15fc.jpg" 
                alt="Pharmacy team collaboration"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -top-4 -right-4 w-full h-full bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-300 rounded-2xl opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* The Three Pillars - Detailed */}
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
          
          {pillars.map((pillar, index) => (
            <div key={index} className={`mb-12 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''} flex flex-col lg:flex-row gap-8 items-center`}>
              <div className="flex-1">
                <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className={`absolute inset-0 bg-gradient-to-br ${pillar.color} opacity-5`}></div>
                  <CardHeader className="relative z-10">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${pillar.color} flex items-center justify-center mb-4`}>
                      <pillar.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl mb-2">
                      <SafeText value={pillar.title} />
                    </CardTitle>
                    <p className="text-gray-600 font-medium">
                      <SafeText value={pillar.description} />
                    </p>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <ul className="space-y-3">
                      {pillar.details.map((detail, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">
                            <SafeText value={detail} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What Makes Us Different */}
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
            {differentiators.map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-300 flex items-center justify-center">
                      <item.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">
                      <SafeText value={item.title} />
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    <SafeText value={item.description} />
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience */}
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
                <Users className="h-12 w-12 text-cyan-500 mx-auto mb-4" />
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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Practice?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join the community pharmacy revolution. Move beyond dispensing to direct patient care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button 
                size="lg" 
                className="bg-white text-cyan-600 hover:bg-gray-100 shadow-lg"
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/">
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-transparent border-white text-white hover:bg-white hover:text-cyan-600"
              >
                Explore Our Programs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}