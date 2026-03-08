
import React, { useState } from 'react';
import { User, Phone, MapPin, ArrowRight, Loader2, CheckCircle2, Sprout, AlertCircle } from 'lucide-react';
import { CROPS } from '../../lib/mockData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (userData: any) => void;
}

export function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP, 3: Details, 4: Crops
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    phone: '',
    otp: '',
    name: '',
    location: '',
    crops: [] as string[]
  });

  // Detailed Location State
  const [locationDetails, setLocationDetails] = useState({
    state: '',
    district: '',
    pincode: '',
    village: ''
  });

  const INDIAN_STATES = {
    "Andhra Pradesh": ["Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool", "Nellore", "Prakasam", "Srikakulam", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa"],
    "Bihar": ["Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran"],
    "Gujarat": ["Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar", "Botad", "Chhota Udaipur", "Dahod", "Dang", "Devbhoomi Dwarka", "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch", "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad"],
    "Haryana": ["Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurugram", "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Mahendragarh", "Nuh", "Palwal", "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"],
    "Madhya Pradesh": ["Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda", "Hoshangabad", "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa", "Khargone", "Mandla", "Mandsaur", "Morena", "Narsinghpur", "Neemuch", "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha"],
    "Maharashtra": ["Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"],
    "Punjab": ["Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fazilka", "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana", "Mansa", "Moga", "Muktsar", "Nawanshahr", "Pathankot", "Patiala", "Rupnagar", "Sahibzada Ajit Singh Nagar", "Sangrur", "Tarn Taran"],
    "Rajasthan": ["Ajmer", "Alwar", "Banswara", "Baran", "Barmer", "Bharatpur", "Bhilwara", "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Dholpur", "Dungarpur", "Hanumangarh", "Jaipur", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Karauli", "Kota", "Nagaur", "Pali", "Pratapgarh", "Rajsamand", "Sawai Madhopur", "Sikar", "Sirohi", "Sri Ganganagar", "Tonk", "Udaipur"],
    "Uttar Pradesh": ["Agra", "Aligarh", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Ayodhya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kheri", "Kushinagar", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Prayagraj", "Raebareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"]
  };

  if (!isOpen) return null;

  const validateStep = () => {
    setError(null);
    
    // Step 1: Phone Validation
    if (step === 1) {
      const cleanPhone = formData.phone.replace(/\D/g, '');
      if (cleanPhone.length !== 10) {
        setError("Please enter a valid 10-digit phone number.");
        return false;
      }
    }

    // Step 2: OTP Validation
    if (step === 2) {
      if (formData.otp.length !== 4 || !/^\d+$/.test(formData.otp)) {
        setError("Please enter a valid 4-digit OTP.");
        return false;
      }
    }

    // Step 3: Details Validation
    if (step === 3) {
      if (!formData.name.trim()) {
        setError("Please enter your full name.");
        return false;
      }
      if (!locationDetails.state) {
        setError("Please select your state.");
        return false;
      }
      if (!locationDetails.district) {
        setError("Please select your district.");
        return false;
      }
      if (!locationDetails.pincode || locationDetails.pincode.length !== 6) {
        setError("Please enter a valid 6-digit pincode.");
        return false;
      }
      if (!locationDetails.village.trim()) {
        setError("Please enter your village or city.");
        return false;
      }
    }

    return true;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep()) return;

    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      if (step < 4) {
        setStep(step + 1);
        setError(null); // Clear errors on step change
      } else {
        // Construct final location string
        const finalLocation = `${locationDetails.village}, ${locationDetails.district}, ${locationDetails.state} - ${locationDetails.pincode}`;
        onLoginSuccess({ ...formData, location: finalLocation });
        onClose();
      }
    }, 1000);
  };

  const toggleCrop = (cropId: string) => {
    setFormData(prev => ({
      ...prev,
      crops: prev.crops.includes(cropId) 
        ? prev.crops.filter(id => id !== cropId)
        : [...prev.crops, cropId]
    }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and max 10 digits
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData({ ...formData, phone: value });
    if (error) setError(null);
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and max 4 digits
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setFormData({ ...formData, otp: value });
    if (error) setError(null);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        
        {/* Progress Bar */}
        <div className="bg-gray-50 h-2 w-full">
          <div 
            className="h-full bg-green-600 transition-all duration-500 ease-out" 
            style={{ width: `${(step / 4) * 100}%` }} 
          />
        </div>

        <div className="p-8 overflow-y-auto flex-1">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {step === 1 && "Welcome to Sahi Mandi"}
              {step === 2 && "Verify Mobile Number"}
              {step === 3 && "Complete Your Profile"}
              {step === 4 && "What do you farm?"}
            </h2>
            <p className="text-gray-500 text-sm">
              {step === 1 && "Join India's largest trusted network of farmers."}
              {step === 2 && `Enter the OTP sent to +91 ${formData.phone}`}
              {step === 3 && "Tell us a bit about yourself to get started."}
              {step === 4 && "Select the crops you grow for personalized insights."}
            </p>
          </div>

          <form onSubmit={handleNext} className="space-y-6 max-w-md mx-auto">
            
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 animate-in slide-in-from-top-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Step 1: Phone Number */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                    <div className="absolute left-10 top-3.5 text-gray-500 font-medium border-r border-gray-300 pr-2 mr-2 h-5 flex items-center select-none">
                      +91
                    </div>
                    <input 
                      type="tel" 
                      required 
                      autoFocus
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      className="w-full pl-24 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none transition-all text-lg tracking-wide"
                      placeholder="98765 43210"
                      maxLength={10}
                    />
                  </div>
                </div>
                <div className="text-xs text-gray-500 text-center">
                  By continuing, you agree to our Terms & Conditions.
                </div>
              </div>
            )}

            {/* Step 2: OTP */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase ml-1">One Time Password (OTP)</label>
                  <input 
                    type="text" 
                    required 
                    autoFocus
                    value={formData.otp}
                    onChange={handleOtpChange}
                    className="w-full text-center py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none transition-all text-2xl tracking-[0.5em] font-bold"
                    placeholder="1234"
                    maxLength={4}
                  />
                </div>
                <div className="text-center">
                  <button type="button" className="text-sm text-green-600 font-bold hover:underline">
                    Resend OTP
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Profile Details */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                    <input 
                      type="text" 
                      required 
                      autoFocus
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
                      placeholder="e.g. Ramesh Kumar"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase ml-1">State</label>
                    <select 
                      value={locationDetails.state}
                      onChange={e => {
                        setLocationDetails({ ...locationDetails, state: e.target.value, district: '', village: '' });
                      }}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none transition-all appearance-none"
                    >
                      <option value="">Select State</option>
                      {Object.keys(INDIAN_STATES).map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase ml-1">District</label>
                    <select 
                      value={locationDetails.district}
                      onChange={e => setLocationDetails({ ...locationDetails, district: e.target.value, village: '' })}
                      disabled={!locationDetails.state}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none transition-all appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Select District</option>
                      {locationDetails.state && (INDIAN_STATES as any)[locationDetails.state]?.map((dist: string) => (
                        <option key={dist} value={dist}>{dist}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase ml-1">Pincode</label>
                    <input 
                      type="text" 
                      required 
                      value={locationDetails.pincode}
                      onChange={e => setLocationDetails({...locationDetails, pincode: e.target.value.replace(/\D/g, '').slice(0, 6)})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none transition-all disabled:opacity-50"
                      placeholder="e.g. 422001"
                      maxLength={6}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase ml-1">Village / City</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 text-gray-400 w-5 h-5 z-10" />
                    <input 
                      type="text" 
                      required 
                      value={locationDetails.village}
                      onChange={e => setLocationDetails({...locationDetails, village: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none transition-all disabled:opacity-50"
                      placeholder="e.g. Rampur"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Select Crops */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-1">
                  {CROPS.slice(0, 15).map(crop => (
                    <div 
                      key={crop.id}
                      onClick={() => toggleCrop(crop.id)}
                      className={`relative cursor-pointer rounded-xl border p-3 flex flex-col items-center gap-2 transition-all ${
                        formData.crops.includes(crop.id)
                          ? 'bg-green-50 border-green-500 ring-1 ring-green-500'
                          : 'bg-white border-gray-200 hover:border-green-300'
                      }`}
                    >
                      {formData.crops.includes(crop.id) && (
                        <div className="absolute top-2 right-2 text-green-600">
                          <CheckCircle2 className="w-4 h-4 fill-current" />
                        </div>
                      )}
                      <img src={crop.image} alt={crop.name} className="w-12 h-12 rounded-full object-cover" />
                      <span className="text-xs font-medium text-center leading-tight">{crop.name}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 text-center">
                  Selected: {formData.crops.length} crops
                </p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-green-600 text-white py-3.5 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {step === 4 ? 'Complete Registration' : 'Continue'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
            
            {step > 1 && (
              <button 
                type="button"
                onClick={() => {
                  setStep(step - 1);
                  setError(null);
                }}
                className="w-full text-sm text-gray-500 font-medium hover:text-gray-700"
              >
                Back
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
