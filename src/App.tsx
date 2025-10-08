import React, { useState, useEffect } from 'react';
import { Check, Calculator, FileText, Award, Users, Mail, ChevronDown } from 'lucide-react';

interface Certification {
  id: string;
  name: string;
  description: string;
  pricePerLicense: number;
  minLicenses: number;
  maxLicenses: number;
  enabled: boolean;
  licenses: number;
  image: string;
  subOptions?: {
    id: string;
    name: string;
    pricePerLicense: number;
    licenses?: number;
  }[];
  selectedSubOptions?: string[];
}

function App() {
  const [certifications, setCertifications] = useState<Certification[]>([
    {
      id: 'cert1',
      name: 'GitHub Enterprise',
      description: 'Certificación avanzada en desarrollo y programación',
      pricePerLicense: 21,
      minLicenses: 50,
      maxLicenses: 130,
      enabled: false,
      licenses: 50,
      image: '/certification.png'
    },
    {
      id: 'cert2',
      name: 'GitHub Copilot',
      description: 'Certificación básica en competencias digitales',
      pricePerLicense: 45,
      minLicenses: 20,
      maxLicenses: 130,
      enabled: false,
      licenses: 20,
      image: '/certification.png',
      subOptions: [
        {
          id: 'copilot-enterprise',
          name: 'GitHub Copilot Enterprise',
          pricePerLicense: 39,
          licenses: 20
        },
        {
          id: 'copilot-business',
          name: 'GitHub Copilot Business',
          pricePerLicense: 19,
          licenses: 20
        }
      ],
      selectedSubOptions: ['copilot-enterprise']
    },
    {
      id: 'cert3',
      name: 'GitHub Advance Security',
      description: 'Certificación profesional en metodologías ágiles',
      pricePerLicense: 30,
      minLicenses: 30,
      maxLicenses: 130,
      enabled: false,
      licenses: 30,
      image: '/certification.png',
      subOptions: [
        {
          id: 'code-security',
          name: 'Code Security',
          pricePerLicense: 30,
          licenses: 30
        },
        {
          id: 'secret-security',
          name: 'Secret Security',
          pricePerLicense: 19,
          licenses: 50
        }
      ],
      selectedSubOptions: ['code-security']
    }
  ]);

  const [totals, setTotals] = useState({
    subtotal: 0,
    tax: 0,
    total: 0,
    totalLicenses: 0
  });

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [showQuotationSummary, setShowQuotationSummary] = useState(false);

  const TAX_RATE = 0.19; // 19% IVA

  const faqs = [
    {
      question: '¿Qué incluyen las licencias de GitHub Enterprise?',
      answer: 'Las licencias de GitHub Enterprise incluyen acceso completo a la plataforma de desarrollo colaborativo de GitHub, con funciones avanzadas de seguridad, administración centralizada, soporte prioritario 24/7, y herramientas para equipos empresariales.'
    },
    {
      question: '¿Cómo funciona el precio combinado de GitHub Advance Security?',
      answer: 'Al seleccionar tanto Code Security como Secret Security, obtienes un precio especial combinado de $49 por licencia, lo que representa un ahorro significativo comparado con adquirirlos por separado. Este paquete te brinda protección completa para tu código y secretos.'
    },
    {
      question: '¿Cuál es el número mínimo de licencias que puedo adquirir?',
      answer: 'El número mínimo de licencias varía según el producto: GitHub Enterprise requiere mínimo 50 licencias, GitHub Copilot 20 licencias, y GitHub Advance Security 30 licencias para Code Security y 50 para Secret Security.'
    },
    {
      question: '¿El IVA está incluido en el precio mostrado?',
      answer: 'No, el IVA (19%) se calcula y muestra por separado en el resumen de tu cotización. El precio por licencia que ves es antes de impuestos.'
    },
    {
      question: '¿Qué tipo de soporte recibo después de la compra?',
      answer: 'Todas nuestras licencias incluyen capacitación del servicio y soporte posterior a la compra. Nuestro equipo te ayudará con la configuración inicial, onboarding de usuarios, y resolución de dudas técnicas.'
    },
    {
      question: '¿Puedo cambiar la cantidad de licencias después de la compra?',
      answer: 'Sí, puedes ajustar la cantidad de licencias según las necesidades de tu equipo. Contáctanos para escalar o reducir tu plan según tus requerimientos.'
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  useEffect(() => {
    const enabledCerts = certifications.filter(cert => cert.enabled);
    const subtotal = enabledCerts.reduce((sum, cert) => {
      if (cert.subOptions && cert.selectedSubOptions && cert.selectedSubOptions.length > 0) {
        // Special case for combined security options
        if (cert.id === 'cert3' && 
            cert.selectedSubOptions.includes('code-security') && 
            cert.selectedSubOptions.includes('secret-security')) {
          const maxLicenses = Math.max(
            cert.subOptions.find(opt => opt.id === 'code-security')?.licenses || 30,
            cert.subOptions.find(opt => opt.id === 'secret-security')?.licenses || 50
          );
          return sum + (maxLicenses * 49);
        }
        // Calculate total for all selected sub-options
        const subOptionsTotal = cert.selectedSubOptions.reduce((subSum, optionId) => {
          const selectedOption = cert.subOptions!.find(option => option.id === optionId);
          return subSum + (selectedOption ? selectedOption.pricePerLicense * (selectedOption.licenses || 20) : 0);
        }, 0);
        return sum + subOptionsTotal;
      } else {
        return sum + (cert.licenses * cert.pricePerLicense);
      }
    }, 0);
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;
    const totalLicenses = enabledCerts.reduce((sum, cert) => {
      if (cert.subOptions && cert.selectedSubOptions && cert.selectedSubOptions.length > 0) {
        // Special case for combined security options
        if (cert.id === 'cert3' && 
            cert.selectedSubOptions.includes('code-security') && 
            cert.selectedSubOptions.includes('secret-security')) {
          return sum + Math.max(
            cert.subOptions.find(opt => opt.id === 'code-security')?.licenses || 30,
            cert.subOptions.find(opt => opt.id === 'secret-security')?.licenses || 50
          );
        }
        return sum + cert.selectedSubOptions.reduce((subSum, optionId) => {
          const selectedOption = cert.subOptions!.find(option => option.id === optionId);
          return subSum + (selectedOption?.licenses || 20);
        }, 0);
      } else {
        return sum + cert.licenses;
      }
    }, 0);

    setTotals({ subtotal, tax, total, totalLicenses });
  }, [certifications]);

  const updateCertification = (id: string, updates: Partial<Certification>) => {
    setCertifications(prev => 
      prev.map(cert => 
        cert.id === id ? { ...cert, ...updates } : cert
      )
    );
  };

  const updateSubOptionLicenses = (certId: string, subOptionId: string, licenses: number) => {
    setCertifications(prev => 
      prev.map(cert => {
        if (cert.id === certId && cert.subOptions) {
          const updatedSubOptions = cert.subOptions.map(option =>
            option.id === subOptionId ? { ...option, licenses } : option
          );
          return { ...cert, subOptions: updatedSubOptions };
        }
        return cert;
      })
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getCurrentPrice = (cert: Certification) => {
    if (cert.subOptions && cert.selectedSubOptions && cert.selectedSubOptions.length > 0) {
      // Special case for combined security options
      if (cert.id === 'cert3' && 
          cert.selectedSubOptions.includes('code-security') && 
          cert.selectedSubOptions.includes('secret-security')) {
        return 49; // Combined price
      }
      // Return total price for all selected sub-options
      return cert.selectedSubOptions.reduce((total, optionId) => {
        const selectedOption = cert.subOptions!.find(option => option.id === optionId);
        return total + (selectedOption ? selectedOption.pricePerLicense : 0);
      }, 0);
    }
    return cert.pricePerLicense;
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    
    if (value === '') {
      setEmailError('');
    } else if (!validateEmail(value)) {
      setEmailError('Por favor ingresa un correo electrónico válido');
    } else {
      setEmailError('');
    }
  };

  const enabledCertifications = certifications.filter(cert => cert.enabled);

  const handleQuotation = () => {
    if (email && !emailError && enabledCertifications.length > 0) {
      setShowQuotationSummary(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackToQuotation = () => {
    setShowQuotationSummary(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmQuotation = () => {
    alert('Cotización enviada con éxito. Nos pondremos en contacto contigo pronto.');
    setShowQuotationSummary(false);
  };

  if (showQuotationSummary) {
    return (
      <div className="min-h-screen bg-[#EEE8F8]">
        {/* Navbar */}
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex-shrink-0">
                <img src="/cleverit.png" alt="CleverIT" className="h-8" />
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <a href="#servicios" className="text-gray-700 hover:text-[#4C26C7] transition-colors font-medium">
                  Servicios
                </a>
                <a href="#soluciones" className="text-gray-700 hover:text-[#4C26C7] transition-colors font-medium">
                  Soluciones
                </a>
                <a href="#recursos" className="text-gray-700 hover:text-[#4C26C7] transition-colors font-medium">
                  Recursos
                </a>
              </div>
              <div>
                <button className="bg-[#4C26C7] hover:bg-[#4C26C7]/90 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                  Contacto
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Summary Page Content */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          <button
            onClick={handleBackToQuotation}
            className="text-[#4C26C7] hover:text-[#4C26C7]/80 mb-6 flex items-center gap-2 font-medium"
          >
            ← Volver al cotizador
          </button>

          <div className="bg-white rounded-3xl shadow-lg p-8 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Resumen de tu Cotización</h1>
            <p className="text-gray-600 mb-8">Revisa los detalles de tu selección antes de confirmar</p>

            {/* Contact Info */}
            <div className="mb-8 p-4 bg-gray-50 rounded-xl">
              <h2 className="text-sm font-semibold text-gray-600 mb-2">Información de Contacto</h2>
              <p className="text-lg font-medium text-gray-900">{email}</p>
            </div>

            {/* Selected Licenses */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Licencias Seleccionadas</h2>
              <div className="space-y-6">
                {enabledCertifications.map((cert) => (
                  <div key={cert.id} className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <img src={cert.image} alt={cert.name} className="w-16 h-16 object-cover rounded-lg" />
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{cert.name}</h3>
                        <p className="text-sm text-gray-600">{cert.description}</p>
                      </div>
                    </div>

                    {cert.subOptions && cert.selectedSubOptions && cert.selectedSubOptions.length > 0 ? (
                      <div className="space-y-3 pl-20">
                        {cert.selectedSubOptions.includes('copilot-enterprise') &&
                         cert.selectedSubOptions.includes('copilot-business') ? (
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="font-semibold text-gray-900 mb-2">Combo: Enterprise + Business</p>
                            <p className="text-sm text-gray-600">
                              {cert.subOptions?.find(opt => opt.id === 'copilot-enterprise')?.licenses || 20} licencias Enterprise × $39 +{' '}
                              {cert.subOptions?.find(opt => opt.id === 'copilot-business')?.licenses || 20} licencias Business × $19
                            </p>
                            <p className="text-lg font-bold text-[#4C26C7] mt-2">
                              {formatPrice(
                                (cert.subOptions?.find(opt => opt.id === 'copilot-enterprise')?.licenses || 20) * 39 +
                                (cert.subOptions?.find(opt => opt.id === 'copilot-business')?.licenses || 20) * 19
                              )}
                            </p>
                          </div>
                        ) : cert.selectedSubOptions.includes('code-security') &&
                               cert.selectedSubOptions.includes('secret-security') ? (
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="font-semibold text-gray-900 mb-2">Combo: Code + Secret Security</p>
                            <p className="text-sm text-gray-600">
                              Máximo entre {cert.subOptions?.find(opt => opt.id === 'code-security')?.licenses || 30} y{' '}
                              {cert.subOptions?.find(opt => opt.id === 'secret-security')?.licenses || 50} licencias × $49
                            </p>
                            <p className="text-lg font-bold text-[#4C26C7] mt-2">
                              {formatPrice(
                                Math.max(
                                  cert.subOptions?.find(opt => opt.id === 'code-security')?.licenses || 30,
                                  cert.subOptions?.find(opt => opt.id === 'secret-security')?.licenses || 50
                                ) * 49
                              )}
                            </p>
                          </div>
                        ) : (
                          cert.selectedSubOptions.map((optionId) => {
                            const option = cert.subOptions!.find(opt => opt.id === optionId);
                            if (!option) return null;
                            return (
                              <div key={optionId} className="bg-gray-50 rounded-lg p-4">
                                <p className="font-semibold text-gray-900 mb-1">{option.name}</p>
                                <p className="text-sm text-gray-600">
                                  {option.licenses || 20} licencias × {formatPrice(option.pricePerLicense)}
                                </p>
                                <p className="text-lg font-bold text-[#4C26C7] mt-2">
                                  {formatPrice((option.licenses || 20) * option.pricePerLicense)}
                                </p>
                              </div>
                            );
                          })
                        )}
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-4 ml-20">
                        <p className="text-sm text-gray-600 mb-1">
                          {cert.licenses} licencias × {formatPrice(cert.pricePerLicense)}
                        </p>
                        <p className="text-lg font-bold text-[#4C26C7]">
                          {formatPrice(cert.licenses * cert.pricePerLicense)}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Price Summary */}
            <div className="border-t border-gray-200 pt-6">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-base">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">{formatPrice(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-gray-600">IVA (19%)</span>
                  <span className="font-semibold text-gray-900">{formatPrice(totals.tax)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t pt-3">
                  <span className="text-gray-900">Total</span>
                  <span className="text-[#4C26C7]">{formatPrice(totals.total)}</span>
                </div>
                <div className="text-sm text-gray-500 text-right">
                  Total de licencias: {totals.totalLicenses}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleConfirmQuotation}
                  className="w-full bg-[#4C26C7] hover:bg-[#4C26C7]/90 text-white font-semibold py-4 px-6 rounded-2xl transition-colors"
                >
                  Confirmar y Enviar Cotización
                </button>
                <button
                  onClick={handleBackToQuotation}
                  className="w-full border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-4 px-6 rounded-2xl transition-colors"
                >
                  Modificar Selección
                </button>
              </div>

              {/* Additional Info */}
              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Incluye:</strong>
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Capacitación del servicio</li>
                  <li>• Soporte posterior a la compra</li>
                  <li>• Asesoría personalizada</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-[#4C26C7] rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">LL</span>
                  </div>
                  <div>
                    <span className="text-xl font-bold">Cotizador</span>
                    <span className="text-gray-400 text-sm ml-2">by CleverIT</span>
                  </div>
                </div>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Transformamos negocios con soluciones de IA personalizadas que impulsan la innovación y el crecimiento.
                </p>
                <a
                  href="mailto:info@llmaps.com"
                  className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  cotizador@cleveritgroup.com
                </a>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  Site Maps
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a href="#style-guide" className="text-gray-300 hover:text-white transition-colors">
                      Style Guide
                    </a>
                  </li>
                  <li>
                    <a href="#instrucciones" className="text-gray-300 hover:text-white transition-colors">
                      Instrucciones
                    </a>
                  </li>
                  <li>
                    <a href="#licencias" className="text-gray-300 hover:text-white transition-colors">
                      Licencias
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  SOCIAL
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a href="#facebook" className="text-gray-300 hover:text-white transition-colors">
                      Facebook
                    </a>
                  </li>
                  <li>
                    <a href="#twitter" className="text-gray-300 hover:text-white transition-colors">
                      Twitter
                    </a>
                  </li>
                  <li>
                    <a href="#youtube" className="text-gray-300 hover:text-white transition-colors">
                      YouTube
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-gray-400 text-sm text-center sm:text-left">
                Creado por <span className="font-semibold text-white">CleverIT</span>, 2025 LLMApps. Todos los derechos reservados.
              </div>
              <div className="flex gap-6 text-sm">
                <a href="#terminos" className="text-gray-400 hover:text-white transition-colors">
                  Términos de Servicio
                </a>
                <a href="#privacidad" className="text-gray-400 hover:text-white transition-colors">
                  Política de Privacidad
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EEE8F8]">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <img src="/cleverit.png" alt="CleverIT" className="h-8" />
            </div>

            {/* Center Navigation Items */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#servicios" className="text-gray-700 hover:text-[#4C26C7] transition-colors font-medium">
                Servicios
              </a>
              <a href="#soluciones" className="text-gray-700 hover:text-[#4C26C7] transition-colors font-medium">
                Soluciones
              </a>
              <a href="#recursos" className="text-gray-700 hover:text-[#4C26C7] transition-colors font-medium">
                Recursos
              </a>
            </div>

            {/* Contact Button */}
            <div>
              <button className="bg-[#4C26C7] hover:bg-[#4C26C7]/90 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                Contacto
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div
        className="bg-gradient-to-br from-[#4C26C7] to-[#6B46E5] text-white py-20 px-4 relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://ghlicensedeskdevqa.blob.core.windows.net/github-cotizador/Banner.svg)',
          backgroundBlendMode: 'overlay'
        }}
      >
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Calculator className="w-4 h-4" />
            Cotizador de licencias
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Calcula tu mejor opción y <br />cotiza tus licencias
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Selecciona las licencias que necesitas y obtén un cálculo detallado con el mejor precio del mercado
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-12">

        <div className="grid lg:grid-cols-3 gap-4 lg:gap-6 bg-[#FFFFFF] p-4 sm:p-6 lg:p-10 rounded-2xl lg:rounded-3xl border border-2 border-gray-200 relative -top-24">
          {/* License Selection */}
          <div className="lg:col-span-2 space-y-4 lg:space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              {/* <Award className="w-6 h-6 text-[#4C26C7]" />*/}
              Selecciona tus licencias
            </h2>

            {certifications.map((cert) => (
              <div key={cert.id} className={`border rounded-xl p-4 transition-all duration-300 ${
                cert.enabled 
                  ? 'border-[#4C26C7]/20 bg-[#F8F4FF] shadow-lg' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              onClick={() => updateCertification(cert.id, { enabled: !cert.enabled })}
              style={{ cursor: 'pointer' }}>
                {/* License Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-shrink-0 mt-0 mr-2">
                    <div
                      className={`w-5 h-5 rounded border-2 cursor-pointer transition-colors ${
                        cert.enabled
                          ? 'bg-[#4C26C7] border-[#4C26C7]'
                          : 'border-gray-300 hover:border-[#4C26C7]'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        updateCertification(cert.id, { enabled: !cert.enabled });
                      }}
                    >
                      {cert.enabled && <Check className="w-3 h-3 text-white m-0.5" />}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 sm:mb-0">
                      <img 
                        src={cert.image} 
                        alt="Certification icon" 
                        className="w-8 h-8 object-contain"
                      />
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                        {cert.name}
                      </h3>
                    </div>
                     {/*
                    <p className="text-gray-600 text-sm">
                      {cert.description}
                    </p>
                     */}
                  </div>
                  
                  <div className="flex-shrink-0 w-full sm:w-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
                      <span className="bg-green-100 text-green-800 px-3 py-2 rounded font-medium text-center sm:text-left whitespace-nowrap">
                        {formatPrice(getCurrentPrice(cert))} / licencia
                      </span>
                       {/*
                      <span className="text-gray-500">
                        Mín: {cert.minLicenses} - Máx: {cert.maxLicenses}
                      </span>
                      */}
                    </div>
                  </div>
                </div>

                {/* License Selector */}
                {cert.enabled && (
                  <div className="mt-6 pt-4 border-t border-[#4C26C7]/10" onClick={(e) => e.stopPropagation()}>
                    {/* Sub-options for GitHub Copilot */}
                    {cert.subOptions && (
                      <div className="mb-0">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Selecciona el tipo:</h4>
                        {/* Check if both security options are selected for GitHub Advance Security */}
                        {cert.id === 'cert3' && 
                         cert.selectedSubOptions?.includes('code-security') && 
                         cert.selectedSubOptions?.includes('secret-security') ? (
                          // Combined Security Card
                          <div className="col-span-2 border border-[#4C26C7] bg-[#4C26C7]/5 shadow-md rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4 cursor-pointer" 
                                 onClick={() => {
                                   // Deselect one option to return to individual cards
                                   const newSelected = cert.selectedSubOptions?.filter(id => id !== 'secret-security') || [];
                                   updateCertification(cert.id, { selectedSubOptions: newSelected });
                                 }}>
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-900 text-sm mb-1 flex items-center gap-2">
                                  <span className="flex items-center gap-1">
                                    <span 
                                      className="cursor-pointer"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // Deselect Code Security, keep Secret Security
                                        updateCertification(cert.id, { selectedSubOptions: ['secret-security'] });
                                      }}
                                    >
                                      Code Security
                                    </span>
                                    <div className="w-4 h-4 rounded border-2 border-[#4C26C7] bg-[#4C26C7] flex items-center justify-center cursor-pointer"
                                         onClick={(e) => {
                                           e.stopPropagation();
                                           // Deselect Code Security, keep Secret Security
                                           updateCertification(cert.id, { selectedSubOptions: ['secret-security'] });
                                         }}>
                                      <Check className="w-2.5 h-2.5 text-white" />
                                    </div>
                                  </span>
                                  <span className="text-gray-400">+</span>
                                  <span className="flex items-center gap-1">
                                    <span 
                                      className="cursor-pointer"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // Deselect Secret Security, keep Code Security
                                        updateCertification(cert.id, { selectedSubOptions: ['code-security'] });
                                      }}
                                    >
                                      Secret Security
                                    </span>
                                    <div className="w-4 h-4 rounded border-2 border-[#4C26C7] bg-[#4C26C7] flex items-center justify-center cursor-pointer"
                                         onClick={(e) => {
                                           e.stopPropagation();
                                           // Deselect Secret Security, keep Code Security
                                           updateCertification(cert.id, { selectedSubOptions: ['code-security'] });
                                         }}>
                                      <Check className="w-2.5 h-2.5 text-white" />
                                    </div>
                                  </span>
                                </h5>
                                <p className="text-xs text-gray-600">
                                  $49 / licencia (Precio combinado)
                                </p>
                              </div>
                              <div className="bg-[#4C26C7] text-white px-3 py-1 rounded-full text-xs font-medium">
                                Mejor precio
                              </div>
                            </div>
                            
                            {/* Combined License Controls */}
                            <div className="space-y-3 pt-3 border-t border-gray-200" onClick={(e) => e.stopPropagation()}>
                              {/* License Counter Header */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Users className="w-4 h-4 text-[#4C26C7]" />
                                  <span className="font-medium text-gray-900 text-xs">Cantidad de licencias</span>
                                </div>
                                <div className="bg-[#4C26C7]/10 px-2 py-1 rounded-full">
                                  <span className="font-bold text-[#4C26C7] text-xs">
                                    {Math.max(
                                      cert.subOptions?.find(opt => opt.id === 'code-security')?.licenses || 30,
                                      cert.subOptions?.find(opt => opt.id === 'secret-security')?.licenses || 50
                                    )}
                                  </span>
                                </div>
                              </div>
                              
                              {/* Slider */}
                              <div className="space-y-1">
                                <input
                                  type="range"
                                  min={20}
                                  max={130}
                                  value={Math.max(
                                    cert.subOptions?.find(opt => opt.id === 'code-security')?.licenses || 30,
                                    cert.subOptions?.find(opt => opt.id === 'secret-security')?.licenses || 50
                                  )}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    const newValue = parseInt(e.target.value);
                                    updateSubOptionLicenses(cert.id, 'code-security', newValue);
                                    updateSubOptionLicenses(cert.id, 'secret-security', newValue);
                                  }}
                                  className="w-full h-1.5 bg-[#4C26C7]/20 rounded-lg appearance-none cursor-pointer slider"
                                />
                                <div className="flex justify-between text-xs text-gray-500">
                                  <span>20</span>
                                  <span>130</span>
                                </div>
                              </div>

                              {/* Input and Total Row */}
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Cantidad
                                  </label>
                                  <input
                                    type="number"
                                    min={20}
                                    max={130}
                                    value={Math.max(
                                      cert.subOptions?.find(opt => opt.id === 'code-security')?.licenses || 30,
                                      cert.subOptions?.find(opt => opt.id === 'secret-security')?.licenses || 50
                                    )}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      const value = Math.max(20, Math.min(130, parseInt(e.target.value) || 20));
                                      updateSubOptionLicenses(cert.id, 'code-security', value);
                                      updateSubOptionLicenses(cert.id, 'secret-security', value);
                                    }}
                                    className="w-full px-2 py-1.5 border border-[#4C26C7]/20 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4C26C7] text-center font-medium text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Total
                                  </label>
                                  <div className="bg-[#4C26C7] text-white px-2 py-1.5 rounded-lg font-bold text-center text-xs">
                                    {formatPrice(Math.max(
                                      cert.subOptions?.find(opt => opt.id === 'code-security')?.licenses || 30,
                                      cert.subOptions?.find(opt => opt.id === 'secret-security')?.licenses || 50
                                    ) * 49)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          // Regular Sub-options Grid
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {cert.subOptions.map((option) => (
                            <div
                              key={option.id}
                              className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                                cert.selectedSubOptions?.includes(option.id)
                                  ? 'border-[#4C26C7] bg-[#4C26C7]/5 shadow-md'
                                  : 'border-gray-200 hover:border-[#4C26C7]/50 hover:bg-gray-50'
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                const currentSelected = cert.selectedSubOptions || [];
                                const isSelected = currentSelected.includes(option.id);
                                const newSelected = isSelected
                                  ? currentSelected.filter(id => id !== option.id)
                                  : [...currentSelected, option.id];
                                updateCertification(cert.id, { selectedSubOptions: newSelected });
                              }}
                            >
                              <div className="flex items-center justify-between mb-0">
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-900 text-sm mb-1">
                                    {option.name}
                                  </h5>
                                  <p className="text-xs text-gray-600">
                                    {formatPrice(option.pricePerLicense)} / licencia
                                  </p>
                                </div>
                                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                  cert.selectedSubOptions?.includes(option.id)
                                    ? 'border-[#4C26C7] bg-[#4C26C7]'
                                    : 'border-gray-300'
                                }`}>
                                  {cert.selectedSubOptions?.includes(option.id) && (
                                    <Check className="w-2.5 h-2.5 text-white" />
                                  )}
                                </div>
                              </div>
                              
                              {/* License Information for this sub-option */}
                              {cert.selectedSubOptions?.includes(option.id) && (
                                <div className="space-y-3 pt-3 border-t border-gray-200" onClick={(e) => e.stopPropagation()}>
                                  {/* License Counter Header */}
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Users className="w-4 h-4 text-[#4C26C7]" />
                                      <span className="font-medium text-gray-900 text-xs">Cantidad de licencias</span>
                                    </div>
                                    <div className="bg-[#4C26C7]/10 px-2 py-1 rounded-full">
                                      <span className="font-bold text-[#4C26C7] text-xs">{option.licenses || 20}</span>
                                    </div>
                                  </div>
                                  
                                  {/* Slider */}
                                  <div className="space-y-1">
                                    <input
                                      type="range"
                                      min={option.id === 'copilot-enterprise' ? 20 : option.id === 'copilot-business' ? 20 : option.id === 'code-security' ? 30 : option.id === 'secret-security' ? 50 : 20}
                                      max={130}
                                      value={option.licenses || 20}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        updateSubOptionLicenses(cert.id, option.id, parseInt(e.target.value));
                                      }}
                                      className="w-full h-1.5 bg-[#4C26C7]/20 rounded-lg appearance-none cursor-pointer slider"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500">
                                      <span>{option.id === 'copilot-enterprise' ? 20 : option.id === 'copilot-business' ? 20 : option.id === 'code-security' ? 30 : option.id === 'secret-security' ? 50 : 20}</span>
                                      <span>130</span>
                                    </div>
                                  </div>

                                  {/* Input and Total Row */}
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Cantidad
                                      </label>
                                      <input
                                        type="number"
                                        min={option.id === 'copilot-enterprise' ? 20 : option.id === 'copilot-business' ? 20 : option.id === 'code-security' ? 30 : option.id === 'secret-security' ? 50 : 20}
                                        max={130}
                                        value={option.licenses || 20}
                                        onChange={(e) => {
                                          e.stopPropagation();
                                          const minValue = option.id === 'copilot-enterprise' ? 20 : option.id === 'copilot-business' ? 20 : option.id === 'code-security' ? 30 : option.id === 'secret-security' ? 50 : 20;
                                          const value = Math.max(minValue, Math.min(130, parseInt(e.target.value) || minValue));
                                          updateSubOptionLicenses(cert.id, option.id, value);
                                        }}
                                        className="w-full px-2 py-1.5 border border-[#4C26C7]/20 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4C26C7] text-center font-medium text-xs"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Total
                                      </label>
                                      <div className="bg-[#4C26C7] text-white px-2 py-1.5 rounded-lg font-bold text-center text-xs">
                                        {formatPrice((option.licenses || 20) * option.pricePerLicense)}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        )}
                      </div>
                    )}

                    {/* License Information Card for certifications without sub-options */}
                    {!cert.subOptions && (
                      <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6">
                        <div className="lg:col-span-2">
                          <div className="space-y-4">
                            {/* License Counter Header */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-[#4C26C7]" />
                                <span className="font-semibold text-gray-900 text-sm sm:text-base">Cantidad de licencias</span>
                              </div>
                              <div className="bg-[#4C26C7]/10 px-3 py-1 rounded-full">
                                <span className="font-bold text-[#4C26C7] text-sm sm:text-base">{cert.licenses}</span>
                              </div>
                            </div>
                            
                            {/* Slider */}
                            <div className="space-y-2">
                              <input
                                type="range"
                                min={cert.minLicenses}
                                max={cert.maxLicenses}
                                value={cert.licenses}
                                onChange={(e) => updateCertification(cert.id, { licenses: parseInt(e.target.value) })}
                                className="w-full h-2 bg-[#4C26C7]/20 rounded-lg appearance-none cursor-pointer slider"
                              />
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>{cert.minLicenses}</span>
                                <span>{cert.maxLicenses}</span>
                              </div>
                            </div>

                            {/* Input and Total Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Cantidad exacta
                                </label>
                                <input
                                  type="number"
                                  min={cert.minLicenses}
                                  max={cert.maxLicenses}
                                  value={cert.licenses}
                                  onChange={(e) => {
                                    const value = Math.max(cert.minLicenses, Math.min(cert.maxLicenses, parseInt(e.target.value) || cert.minLicenses));
                                    updateCertification(cert.id, { licenses: value });
                                  }}
                                  className="w-full px-3 py-2 border border-[#4C26C7]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4C26C7] text-center font-medium"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Total para esta certificación
                                </label>
                                <div className="bg-[#4C26C7] text-white px-3 py-2 rounded-lg font-bold text-center text-sm sm:text-base">
                                  {formatPrice(cert.licenses * getCurrentPrice(cert))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quote Summary */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-8">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-6">
                  <FileText className="w-5 h-5 text-gray-700" />
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">Resumen</h3>
                </div>

                {enabledCertifications.length === 0 ? (
                  <div className="text-center py-6 sm:py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calculator className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-sm sm:text-base text-gray-500 px-2">
                      Selecciona al menos una licencia para ver el resumen
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Selected Items */}
                    <div className="space-y-3 mb-6">
                      {enabledCertifications.map((cert) => (
                        <div key={cert.id}>
                          {cert.subOptions && cert.selectedSubOptions && cert.selectedSubOptions.length > 0 ? (
                            // Special case for combined security options
                            cert.id === 'cert3' && 
                            cert.selectedSubOptions.includes('code-security') && 
                            cert.selectedSubOptions.includes('secret-security') ? (
                              <div className="flex justify-between items-start text-xs sm:text-sm gap-2">
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900 leading-tight text-xs sm:text-sm">
                                    Code Security + Secret Security (Combo)
                                  </p>
                                  <p className="text-gray-500 text-xs">
                                    {Math.max(
                                      cert.subOptions?.find(opt => opt.id === 'code-security')?.licenses || 30,
                                      cert.subOptions?.find(opt => opt.id === 'secret-security')?.licenses || 50
                                    )} licencias × {formatPrice(49)}
                                  </p>
                                </div>
                                <p className="font-semibold text-gray-900 ml-2 text-xs sm:text-sm whitespace-nowrap">
                                  {formatPrice(Math.max(
                                    cert.subOptions?.find(opt => opt.id === 'code-security')?.licenses || 30,
                                    cert.subOptions?.find(opt => opt.id === 'secret-security')?.licenses || 50
                                  ) * 49)}
                                </p>
                              </div>
                            ) : (
                            // Show each selected sub-option separately
                            cert.selectedSubOptions.map((optionId) => {
                              const option = cert.subOptions!.find(opt => opt.id === optionId);
                              if (!option) return null;
                              return (
                                <div key={`${cert.id}-${optionId}`} className="flex justify-between items-start text-xs sm:text-sm gap-2">
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-900 leading-tight text-xs sm:text-sm">
                                      {option.name}
                                    </p>
                                    <p className="text-gray-500 text-xs">
                                      {option.licenses || 20} licencias × {formatPrice(option.pricePerLicense)}
                                    </p>
                                  </div>
                                  <p className="font-semibold text-gray-900 ml-2 text-xs sm:text-sm whitespace-nowrap">
                                    {formatPrice((option.licenses || 20) * option.pricePerLicense)}
                                  </p>
                                </div>
                              );
                            })
                            )
                          ) : (
                            // Show regular License
                            <div className="flex justify-between items-start text-xs sm:text-sm gap-2">
                              <div className="flex-1">
                                <p className="font-medium text-gray-900 leading-tight text-xs sm:text-sm">
                                  {cert.name}
                                </p>
                                <p className="text-gray-500 text-xs">
                                  {cert.licenses} licencias × {formatPrice(cert.pricePerLicense)}
                                </p>
                              </div>
                              <p className="font-semibold text-gray-900 ml-2 text-xs sm:text-sm whitespace-nowrap">
                                {formatPrice(cert.licenses * cert.pricePerLicense)}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Totals */}
                    <div className="border-t border-gray-200 pt-4 space-y-2">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">Total licencias:</span>
                        <span className="font-medium">{totals.totalLicenses}</span>
                      </div>
                      
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">{formatPrice(totals.subtotal)}</span>
                      </div>
                      
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">IVA (19%):</span>
                        <span className="font-medium">{formatPrice(totals.tax)}</span>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-2">
                        <div className="flex justify-between">
                          <span className="text-base sm:text-lg font-bold text-gray-900">Total:</span>
                          <span className="text-lg sm:text-2xl font-bold text-[#4C26C7]">
                            {formatPrice(totals.total)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Email Input */}
                    <div className="pt-4 space-y-3">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Ingresa tu correo para cotizar
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="ejemplo@correo.com"
                            className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors text-sm ${
                              emailError 
                                ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                : email && !emailError
                                ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                                : 'border-gray-300 focus:ring-[#4C26C7] focus:border-[#4C26C7]'
                            }`}
                          />
                          {email && !emailError && (
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                              <Check className="h-4 w-4 text-green-500" />
                            </div>
                          )}
                        </div>
                        {emailError && (
                          <p className="text-red-500 text-xs mt-1">{emailError}</p>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 space-y-3">
                      <button
                        onClick={handleQuotation}
                        disabled={!email || !!emailError || enabledCertifications.length === 0}
                        className={`w-full font-semibold py-3 px-4 rounded-2xl sm:rounded-3xl transition-colors text-sm sm:text-base ${
                          email && !emailError && enabledCertifications.length > 0
                            ? 'bg-[#4C26C7] hover:bg-[#4C26C7]/90 text-white cursor-pointer'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        Cotizar
                      </button>

                      <button
                        disabled={!email || !!emailError}
                        className={`w-full font-semibold py-3 px-4 rounded-2xl sm:rounded-3xl transition-colors text-sm sm:text-base ${
                          email && !emailError
                            ? 'border border-gray-300 hover:border-gray-400 text-gray-700 cursor-pointer'
                            : 'border border-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Enviarme información
                      </button>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-500">
                      <p className="mb-2">• Capacitación servicio</p>
                      <p className="mb-2">• Soporte posterior a compra</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mt-16 mb-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Preguntas Frecuentes
            </h2>
            <p className="text-lg text-gray-600">
              Resuelve tus dudas sobre nuestras licencias
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#4C26C7] flex-shrink-0 transition-transform duration-300 ${
                      openFaqIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaqIndex === index ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#4C26C7] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">LL</span>
                </div>
                <div>
                  <span className="text-xl font-bold">Licencias</span>
                  <span className="text-gray-400 text-sm ml-2">by CleverIT</span>
                </div>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Transformamos negocios con soluciones de IA personalizadas que impulsan la innovación y el crecimiento.
              </p>
              <a
                href="mailto:licencias@cleveritgroup.com"
                className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Mail className="w-4 h-4" />
                info@llmaps.com
              </a>
            </div>

            {/* Links Section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                LINK
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="#style-guide" className="text-gray-300 hover:text-white transition-colors">
                    Style Guide
                  </a>
                </li>
                <li>
                  <a href="#instrucciones" className="text-gray-300 hover:text-white transition-colors">
                    Instrucciones
                  </a>
                </li>
                <li>
                  <a href="#licencias" className="text-gray-300 hover:text-white transition-colors">
                    Licencias
                  </a>
                </li>
              </ul>
            </div>

            {/* Social Section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                SOCIAL
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="#facebook" className="text-gray-300 hover:text-white transition-colors">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="#twitter" className="text-gray-300 hover:text-white transition-colors">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#youtube" className="text-gray-300 hover:text-white transition-colors">
                    YouTube
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm text-center sm:text-left">
              Creado por <span className="font-semibold text-white">CleverIT</span>, 2025 LLMApps. Todos los derechos reservados.
            </div>
            <div className="flex gap-6 text-sm">
              <a href="#terminos" className="text-gray-400 hover:text-white transition-colors">
                Términos de Servicio
              </a>
              <a href="#privacidad" className="text-gray-400 hover:text-white transition-colors">
                Política de Privacidad
              </a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}

export default App;