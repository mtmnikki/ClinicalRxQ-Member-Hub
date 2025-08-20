/**
 * Enrollment and payment page
 */
import { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Check, CreditCard, Lock } from 'lucide-react';
import SafeText from '../components/common/SafeText';

export default function Enroll() {
  const [selectedProgram, setSelectedProgram] = useState('clinical-fundamentals');
  const [billingInfo, setBillingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    billingAddress: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const programs = [
    {
      id: 'clinical-fundamentals',
      title: 'Clinical Pharmacy Fundamentals',
      price: 299,
      duration: '8 weeks',
      features: [
        'Interactive online modules',
        'Live Q&A sessions',
        'Certification upon completion',
        '24/7 support access',
        'Downloadable resources'
      ]
    },
    {
      id: 'advanced-therapy',
      title: 'Advanced Drug Therapy Management',
      price: 449,
      duration: '12 weeks',
      features: [
        'Advanced case studies',
        'Expert mentorship',
        'Research database access',
        'Peer networking opportunities',
        'Continuing education credits'
      ]
    },
    {
      id: 'pharmaceutical-care',
      title: 'Pharmaceutical Care Excellence',
      price: 349,
      duration: '10 weeks',
      features: [
        'Patient care scenarios',
        'Communication skills training',
        'Quality metrics training',
        'Practice tools & templates',
        'Implementation guides'
      ]
    }
  ];

  const selectedProgramData = programs.find(p => p.id === selectedProgram);

  /**
   * Handle billing input change
   */
  const handleInputChange = (field: string, value: string) => {
    setBillingInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Handle enrollment submit
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle enrollment submission
    // eslint-disable-next-line no-console
    console.log('Enrollment submitted', { selectedProgram, billingInfo });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Enroll in a Program</h1>
            <p className="text-lg text-gray-600">Choose your program and complete your enrollment</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Program Selection */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Select Your Program</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {programs.map((program) => (
                      <div
                        key={program.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedProgram === program.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedProgram(program.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">
                            <SafeText value={program.title} />
                          </h3>
                          <Badge variant="secondary">
                            <SafeText value={program.duration} />
                          </Badge>
                        </div>
                        <p className="text-2xl font-bold text-blue-600 mb-3">
                          ${program.price}
                        </p>
                        <ul className="space-y-1">
                          {program.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <Check className="h-3 w-3 text-green-500" />
                              <SafeText value={feature} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Billing Information */}
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Billing Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form id="enrollment-form" onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">First Name</label>
                        <Input
                          value={billingInfo.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Last Name</label>
                        <Input
                          value={billingInfo.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <Input
                        type="email"
                        value={billingInfo.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone</label>
                      <Input
                        type="tel"
                        value={billingInfo.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        required
                      />
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Card Number</label>
                      <Input
                        placeholder="1234 5678 9012 3456"
                        value={billingInfo.cardNumber}
                        onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Expiry Date</label>
                        <Input
                          placeholder="MM/YY"
                          value={billingInfo.expiryDate}
                          onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">CVV</label>
                        <Input
                          placeholder="123"
                          value={billingInfo.cvv}
                          onChange={(e) => handleInputChange('cvv', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Billing Address</label>
                      <Input
                        value={billingInfo.billingAddress}
                        onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">City</label>
                        <Input
                          value={billingInfo.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">State</label>
                        <Input
                          value={billingInfo.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">ZIP Code</label>
                        <Input
                          value={billingInfo.zipCode}
                          onChange={(e) => handleInputChange('zipCode', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            {/* Order Summary */}
            <div>
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedProgramData && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold">
                          <SafeText value={selectedProgramData.title} />
                        </h3>
                        <p className="text-sm text-gray-600">
                          <SafeText value={selectedProgramData.duration} />
                        </p>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between">
                        <span>Program Fee:</span>
                        <span>${selectedProgramData.price}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Processing Fee:</span>
                        <span>$9.99</span>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total:</span>
                        <span>${selectedProgramData.price + 9.99}</span>
                      </div>
                      
                      <Button className="w-full" size="lg" form="enrollment-form">
                        <Lock className="h-4 w-4 mr-2" />
                        Complete Enrollment
                      </Button>
                      
                      <div className="text-xs text-gray-500 text-center">
                        <p>🔒 Secure payment processing</p>
                        <p>30-day money-back guarantee</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
