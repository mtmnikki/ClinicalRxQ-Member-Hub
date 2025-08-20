/**
 * Contact page with ClinicalRxQ support information
 * Updated to remove fake statistics and focus on genuine support offerings
 */
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Mail, 
  Phone, 
  MessageCircle,
  Users,
  BookOpen,
  Video,
  Award,
  Headphones,
  CheckCircle,
  ArrowRight,
  FileText,
  Lightbulb,
  Clock
} from 'lucide-react';
import { Link } from 'react-router';
import SafeText from '../components/common/SafeText';

export default function Contact() {
  const supportTypes = [
    {
      icon: Users,
      title: "Implementation Support",
      description: "Expert guidance for launching your clinical programs",
      features: [
        "Setup assistance for all protocols",
        "Workflow integration strategies", 
        "Team training coordination"
      ]
    },
    {
      icon: BookOpen,
      title: "Educational Resources",
      description: "Comprehensive training materials and documentation",
      features: [
        "Video training modules",
        "Step-by-step protocol manuals",
        "Downloadable forms and worksheets"
      ]
    },
    {
      icon: Award,
      title: "Billing & Coding Support",
      description: "Navigate medical billing with confidence",
      features: [
        "CPT and ICD-10 coding guidance",
        "Claim submission protocols",
        "Reimbursement optimization"
      ]
    },
    {
      icon: Video,
      title: "Ongoing Training",
      description: "Continuous education and updates",
      features: [
        "Regular webinars and updates",
        "Best practice sharing",
        "Clinical case discussions"
      ]
    }
  ];

  const programHighlights = [
    {
      icon: FileText,
      title: "Complete Protocol Manuals",
      description: "Detailed SOPs for pharmacists and technicians ready for immediate implementation"
    },
    {
      icon: Lightbulb,
      title: "Proven Methodologies", 
      description: "Field-tested by community pharmacists in real practice settings"
    },
    {
      icon: Clock,
      title: "Time-Efficient Training",
      description: "Structured modules designed to fit into your busy schedule"
    }
  ];

  /**
   * Handle contact form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted');
  };

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
              Your Success is Our Mission
            </Badge>
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold mb-6">
            Contact ClinicalRxQ
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Ready to transform your pharmacy practice? Our team is here to guide you through 
            implementing clinical services that improve patient outcomes and practice profitability.
          </p>
        </div>
      </section>

      {/* Contact Form & Support Info */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="h-5 w-5 text-cyan-500" />
                  <CardTitle>Get Started Today</CardTitle>
                </div>
                <p className="text-gray-600">
                  Tell us about your pharmacy and goals for clinical service expansion
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">First Name *</label>
                      <Input placeholder="John" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Last Name *</label>
                      <Input placeholder="Doe" required />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <Input type="email" placeholder="john@pharmacy.com" required />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <Input type="tel" placeholder="(555) 123-4567" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Pharmacy Name</label>
                    <Input placeholder="Community Care Pharmacy" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Practice Setting</label>
                    <select className="w-full p-3 border border-gray-300 rounded-lg">
                      <option>Independent Community Pharmacy</option>
                      <option>Chain Community Pharmacy</option>
                      <option>Health System Outpatient Pharmacy</option>
                      <option>Specialty Pharmacy</option>
                      <option>Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Programs of Interest</label>
                    <select className="w-full p-3 border border-gray-300 rounded-lg">
                      <option>All Programs - Complete Ecosystem</option>
                      <option>MTM The Future Today</option>
                      <option>TimeMyMeds Synchronization</option>
                      <option>Test & Treat Services</option>
                      <option>HbA1c Testing</option>
                      <option>Pharmacist-Initiated Contraceptives</option>
                      <option>Medical Billing & Coding Training</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <Textarea 
                      placeholder="Tell us about your current practice challenges and goals for implementing clinical services..." 
                      rows={5}
                      required 
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-300 hover:from-blue-700 hover:via-cyan-600 hover:to-teal-400"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Submit Inquiry
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Support Information */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="h-5 w-5 text-cyan-500" />
                    <CardTitle>Direct Contact</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="font-semibold mb-1">Email</p>
                      <p className="text-gray-600">info@clinicalrxq.com</p>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Phone</p>
                      <p className="text-gray-600">Contact us via email for phone consultation</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Headphones className="h-5 w-5 text-cyan-500" />
                    <CardTitle>What to Expect</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Personalized Consultation</p>
                        <p className="text-sm text-gray-600">
                          Discuss your specific practice needs and goals
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Program Recommendations</p>
                        <p className="text-sm text-gray-600">
                          Customized implementation roadmap for your pharmacy
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Financial Analysis</p>
                        <p className="text-sm text-gray-600">
                          Revenue projections based on proven models
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Implementation Timeline</p>
                        <p className="text-sm text-gray-600">
                          Step-by-step plan for service launch
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Support Types */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Comprehensive{' '}
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-300 bg-clip-text text-transparent">
                Support System
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From initial implementation to ongoing optimization, we provide the resources 
              and guidance you need for success
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {supportTypes.map((support, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-300 rounded-lg mb-4">
                    <support.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">
                    <SafeText value={support.title} />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    <SafeText value={support.description} />
                  </p>
                  <ul className="space-y-2">
                    {support.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                        <span>
                          <SafeText value={feature} />
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Program Highlights */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Why Choose{' '}
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-300 bg-clip-text text-transparent">
                ClinicalRxQ
              </span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {programHighlights.map((highlight, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-300 rounded-xl mx-auto mb-4">
                    <highlight.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    <SafeText value={highlight.title} />
                  </h3>
                  <p className="text-gray-600">
                    <SafeText value={highlight.description} />
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Transform Your Practice Today
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Don't let another day pass with missed clinical opportunities. 
            Start building the patient-centered practice you've always envisioned.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button 
                size="lg" 
                className="bg-white text-cyan-600 hover:bg-gray-100 shadow-lg"
              >
                Explore Our Programs
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/about">
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-transparent border-white text-white hover:bg-white hover:text-cyan-600"
              >
                Learn Our Philosophy
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}