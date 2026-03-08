
// Helper to generate random prices
const getRandomPrice = (base: number) => Math.floor(base + Math.random() * (base * 0.2) - (base * 0.1));
const getRandomTrust = () => (3.5 + Math.random() * 1.5).toFixed(1);
const getRandomDistance = () => (Math.random() * 50 + 1).toFixed(1);

export const NEWS_ITEMS = [
  "सरकार ने जैविक उर्वरकों के लिए नई सब्सिडी की घोषणा की। (Govt announces new subsidy for organic fertilizers)",
  "अगले हफ्ते गेहूं की कीमतों में 5% की बढ़ोतरी की उम्मीद है। (Wheat prices expected to rise by 5%)",
  "उत्तर भारत में भारी बारिश का अनुमान। (Heavy rains expected in North India)",
  "किसानों के लिए नया डिजिटल साक्षरता कार्यक्रम जल्द शुरू होगा। (New digital literacy program launching soon)",
  "एमएसपी दरों में संशोधन पर विचार कर रही है सरकार। (Govt considering revision of MSP rates)"
];

export const CROPS = [
  { id: 'c1', name: 'Wheat (गेहूं)', category: 'Grains', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=300' },
  { id: 'c2', name: 'Rice Basmati (बासमती चावल)', category: 'Grains', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=300' },
  { id: 'c3', name: 'Tomato (टमाटर)', category: 'Vegetables', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=300' },
  { id: 'c4', name: 'Onion (प्याज)', category: 'Vegetables', image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&q=80&w=300' },
  { id: 'c5', name: 'Potato (आलू)', category: 'Vegetables', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=300' },
  { id: 'c6', name: 'Cotton (कपास)', category: 'Fibre', image: 'https://images.unsplash.com/photo-1594303264789-e137637e1a3d?auto=format&fit=crop&q=80&w=300' },
  { id: 'c7', name: 'Sugarcane (गन्ना)', category: 'Commercial', image: 'https://images.unsplash.com/photo-1601633596856-749c95190989?auto=format&fit=crop&q=80&w=300' },
  { id: 'c8', name: 'Maize (मक्का)', category: 'Grains', image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=300' },
  { id: 'c9', name: 'Soybean (सोयाबीन)', category: 'Pulses', image: 'https://images.unsplash.com/photo-1580983196942-887e35b0b6c2?auto=format&fit=crop&q=80&w=300' },
  { id: 'c10', name: 'Mustard (सरसों)', category: 'Oilseeds', image: 'https://images.unsplash.com/photo-1498579809087-ef1e558fd1da?auto=format&fit=crop&q=80&w=300' },
  { id: 'c11', name: 'Turmeric (हल्दी)', category: 'Spices', image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=300' },
  { id: 'c12', name: 'Chilli (मिर्च)', category: 'Spices', image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&q=80&w=300' },
  { id: 'c13', name: 'Garlic (लहसुन)', category: 'Spices', image: 'https://images.unsplash.com/photo-1604169992383-e024b0b14732?auto=format&fit=crop&q=80&w=300' },
  { id: 'c14', name: 'Ginger (अदरक)', category: 'Spices', image: 'https://images.unsplash.com/photo-1615485925763-997e2ebc3821?auto=format&fit=crop&q=80&w=300' },
  { id: 'c15', name: 'Apple (सेब)', category: 'Fruits', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=300' },
  { id: 'c16', name: 'Banana (केला)', category: 'Fruits', image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&q=80&w=300' },
  { id: 'c17', name: 'Mango (आम)', category: 'Fruits', image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=300' },
  { id: 'c18', name: 'Orange (संतरा)', category: 'Fruits', image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5a?auto=format&fit=crop&q=80&w=300' },
  { id: 'c19', name: 'Grapes (अंगूर)', category: 'Fruits', image: 'https://images.unsplash.com/photo-1537640538965-1756eb17960c?auto=format&fit=crop&q=80&w=300' },
  { id: 'c20', name: 'Papaya (पपीता)', category: 'Fruits', image: 'https://images.unsplash.com/photo-1617117833203-c91b06022709?auto=format&fit=crop&q=80&w=300' },
  { id: 'c21', name: 'Pomegranate (अनार)', category: 'Fruits', image: 'https://images.unsplash.com/photo-1615485499978-2086e7a2559b?auto=format&fit=crop&q=80&w=300' },
  { id: 'c22', name: 'Cabbage (पत्ता गोभी)', category: 'Vegetables', image: 'https://images.unsplash.com/photo-1550175898-d7b1a64f5802?auto=format&fit=crop&q=80&w=300' },
  { id: 'c23', name: 'Cauliflower (फूलगोभी)', category: 'Vegetables', image: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&q=80&w=300' },
  { id: 'c24', name: 'Brinjal (बैंगन)', category: 'Vegetables', image: 'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?auto=format&fit=crop&q=80&w=300' },
  { id: 'c25', name: 'Okra (भिंडी)', category: 'Vegetables', image: 'https://images.unsplash.com/photo-1425543103986-226d3d8db13d?auto=format&fit=crop&q=80&w=300' },
  { id: 'c26', name: 'Spinach (पालक)', category: 'Vegetables', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=300' },
  { id: 'c27', name: 'Carrot (गाजर)', category: 'Vegetables', image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=300' },
  { id: 'c28', name: 'Radish (मूली)', category: 'Vegetables', image: 'https://images.unsplash.com/photo-1594247558661-8250005d5396?auto=format&fit=crop&q=80&w=300' },
  { id: 'c29', name: 'Peas (मटर)', category: 'Vegetables', image: 'https://images.unsplash.com/photo-1587391740940-59a852445c75?auto=format&fit=crop&q=80&w=300' },
  { id: 'c30', name: 'Green Beans (बीन्स)', category: 'Vegetables', image: 'https://images.unsplash.com/photo-1559868846-5b43292497f5?auto=format&fit=crop&q=80&w=300' },
  { id: 'c31', name: 'Moong Dal (मूंग दाल)', category: 'Pulses', image: 'https://images.unsplash.com/photo-1515543904379-3d757afe72e3?auto=format&fit=crop&q=80&w=300' },
  { id: 'c32', name: 'Urad Dal (उड़द दाल)', category: 'Pulses', image: 'https://images.unsplash.com/photo-1585996614457-37d995cb6491?auto=format&fit=crop&q=80&w=300' },
  { id: 'c33', name: 'Toor Dal (तूर दाल)', category: 'Pulses', image: 'https://images.unsplash.com/photo-1563205764-6e0186177b94?auto=format&fit=crop&q=80&w=300' },
  { id: 'c34', name: 'Groundnut (मूंगफली)', category: 'Oilseeds', image: 'https://images.unsplash.com/photo-1564850720499-53e5e6e73772?auto=format&fit=crop&q=80&w=300' },
  { id: 'c35', name: 'Sunflower (सूरजमुखी)', category: 'Oilseeds', image: 'https://images.unsplash.com/photo-1471193945509-9adadd0974ce?auto=format&fit=crop&q=80&w=300' },
  { id: 'c36', name: 'Sesame (तिल)', category: 'Oilseeds', image: 'https://images.unsplash.com/photo-1516641328084-2826a5786835?auto=format&fit=crop&q=80&w=300' },
  { id: 'c37', name: 'Jute (जूट)', category: 'Fibre', image: 'https://images.unsplash.com/photo-1605307374087-2195f002220d?auto=format&fit=crop&q=80&w=300' },
  { id: 'c38', name: 'Tea (चाय)', category: 'Commercial', image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=300' },
  { id: 'c39', name: 'Coffee (कॉफी)', category: 'Commercial', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=300' },
  { id: 'c40', name: 'Coconut (नारियल)', category: 'Fruits', image: 'https://images.unsplash.com/photo-1560717845-968823efbee1?auto=format&fit=crop&q=80&w=300' },
  { id: 'c41', name: 'Arecanut (सुपारी)', category: 'Commercial', image: 'https://images.unsplash.com/photo-1600188636730-80a221f57425?auto=format&fit=crop&q=80&w=300' },
  { id: 'c42', name: 'Rubber (रबर)', category: 'Commercial', image: 'https://images.unsplash.com/photo-1609146522537-885750849615?auto=format&fit=crop&q=80&w=300' },
  { id: 'c43', name: 'Cashew (काजू)', category: 'Dry Fruits', image: 'https://images.unsplash.com/photo-1536591375315-196000ea3678?auto=format&fit=crop&q=80&w=300' },
  { id: 'c44', name: 'Black Pepper (काली मिर्च)', category: 'Spices', image: 'https://images.unsplash.com/photo-1564119335198-d4520b296b42?auto=format&fit=crop&q=80&w=300' },
  { id: 'c45', name: 'Cardamom (इलायची)', category: 'Spices', image: 'https://images.unsplash.com/photo-1557997424-44b41984606d?auto=format&fit=crop&q=80&w=300' },
  { id: 'c46', name: 'Cumin (जीरा)', category: 'Spices', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=300' },
  { id: 'c47', name: 'Coriander (धनिया)', category: 'Spices', image: 'https://images.unsplash.com/photo-1589134764834-032906b25110?auto=format&fit=crop&q=80&w=300' },
  { id: 'c48', name: 'Fennel (सौंफ)', category: 'Spices', image: 'https://images.unsplash.com/photo-1531326233480-45604b321c2c?auto=format&fit=crop&q=80&w=300' },
  { id: 'c49', name: 'Fenugreek (मेथी)', category: 'Spices', image: 'https://images.unsplash.com/photo-1600865809706-05634017684d?auto=format&fit=crop&q=80&w=300' },
  { id: 'c50', name: 'Millet (बाजरा)', category: 'Grains', image: 'https://images.unsplash.com/photo-1634547960309-8805f157796d?auto=format&fit=crop&q=80&w=300' },
];

const mandiNames = [
  'Azadpur Mandi', 'Ghazipur Mandi', 'Okhla Mandi', 'Vashi APMC', 'Pune APMC', 'Nashik Mandi', 'Nagpur APMC', 'Indore Mandi', 'Bhopal Mandi', 'Jaipur Mandi',
  'Kota Mandi', 'Jodhpur Mandi', 'Ahmedabad APMC', 'Surat APMC', 'Rajkot APMC', 'Bangalore APMC', 'Mysore APMC', 'Hubli APMC', 'Chennai Koyambedu', 'Coimbatore Mandi',
  'Madurai Mandi', 'Hyderabad Bowenpally', 'Warangal Mandi', 'Nizamabad Mandi', 'Kolkata Posta', 'Siliguri Regulated Market', 'Burdwan Mandi', 'Patna Musallahpur', 'Muzaffarpur Mandi', 'Gaya Mandi',
  'Lucknow Dubagga', 'Kanpur Mandi', 'Varanasi Paharia', 'Agra Mandi', 'Meerut Mandi', 'Ludhiana Mandi', 'Jalandhar Mandi', 'Amritsar Mandi', 'Chandigarh Mandi', 'Shimla Mandi',
  'Jammu Narwal', 'Srinagar Parimpora', 'Dehradun Mandi', 'Haldwani Mandi', 'Raipur Mandi', 'Bilaspur Mandi', 'Bhubaneswar Unit-1', 'Cuttack Malgodown', 'Guwahati Pamohi', 'Shillong Bara Bazar'
];

const locations = [
  'Delhi', 'Delhi', 'Delhi', 'Mumbai', 'Pune', 'Nashik', 'Nagpur', 'Indore', 'Bhopal', 'Jaipur',
  'Kota', 'Jodhpur', 'Ahmedabad', 'Surat', 'Rajkot', 'Bangalore', 'Mysore', 'Hubli', 'Chennai', 'Coimbatore',
  'Madurai', 'Hyderabad', 'Warangal', 'Nizamabad', 'Kolkata', 'Siliguri', 'Burdwan', 'Patna', 'Muzaffarpur', 'Gaya',
  'Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Meerut', 'Ludhiana', 'Jalandhar', 'Amritsar', 'Chandigarh', 'Shimla',
  'Jammu', 'Srinagar', 'Dehradun', 'Haldwani', 'Raipur', 'Bilaspur', 'Bhubaneswar', 'Cuttack', 'Guwahati', 'Shillong'
];

export const MANDIS = mandiNames.map((name, index) => ({
  id: `m${index + 1}`,
  name,
  location: locations[index],
  distance: `${getRandomDistance()} km`,
  trustScore: getRandomTrust(),
  isVerified: true,
  image: `https://images.unsplash.com/photo-${[
    '1637426992376-b8af65fb90d7', '1631021967261-c57ee4dfa9bb', '1655903724829-37b3cd3d4ab9', '1488459716781-31db52582fe9',
    '1542838132-92c53300491e', '1591035897819-f4bdf739f446', '1604351868943-4396c06a6b8c'
  ][index % 7]}?auto=format&fit=crop&q=80&w=400`,
  schedule: { open: '04:00 AM', close: '08:00 PM', holidays: ['Sunday'] },
  updates: "Prices are volatile today due to rain."
}));

// Generate Current Prices for all mandis and crops
export const CURRENT_PRICES: Record<string, Record<string, number>> = {};
MANDIS.forEach(mandi => {
  CURRENT_PRICES[mandi.id] = {};
  CROPS.forEach(crop => {
    CURRENT_PRICES[mandi.id][crop.id] = getRandomPrice(
      crop.category === 'Grains' ? 2200 : 
      crop.category === 'Vegetables' ? 1500 : 
      crop.category === 'Fruits' ? 5000 : 3000
    );
  });
});

export const PRICE_HISTORY = [
  { day: 'Mon', 'Azadpur Mandi': 2200, 'Ghazipur Mandi': 2150, 'Okhla Mandi': 2180, 'Vashi APMC': 2300, 'Pune APMC': 2250 },
  { day: 'Tue', 'Azadpur Mandi': 2250, 'Ghazipur Mandi': 2100, 'Okhla Mandi': 2200, 'Vashi APMC': 2320, 'Pune APMC': 2280 },
  { day: 'Wed', 'Azadpur Mandi': 2300, 'Ghazipur Mandi': 2200, 'Okhla Mandi': 2250, 'Vashi APMC': 2350, 'Pune APMC': 2310 },
  { day: 'Thu', 'Azadpur Mandi': 2280, 'Ghazipur Mandi': 2180, 'Okhla Mandi': 2220, 'Vashi APMC': 2340, 'Pune APMC': 2300 },
  { day: 'Fri', 'Azadpur Mandi': 2350, 'Ghazipur Mandi': 2250, 'Okhla Mandi': 2300, 'Vashi APMC': 2380, 'Pune APMC': 2350 },
  { day: 'Sat', 'Azadpur Mandi': 2400, 'Ghazipur Mandi': 2300, 'Okhla Mandi': 2350, 'Vashi APMC': 2420, 'Pune APMC': 2400 },
  { day: 'Sun', 'Azadpur Mandi': 2400, 'Ghazipur Mandi': 2300, 'Okhla Mandi': 2380, 'Vashi APMC': 2450, 'Pune APMC': 2420 },
];

export const REVIEWS = [
  { id: 1, user: "Ramesh Kumar", rating: 5, comment: "Best rates for wheat today. Payment was quick." },
  { id: 2, user: "Suresh Singh", rating: 4, comment: "Good facilities but parking is crowded." },
  { id: 3, user: "Anil Yadav", rating: 3, comment: "Rates were lower than expected for tomatoes." },
  { id: 4, user: "Vikram Chaudhry", rating: 5, comment: "Very transparent auction process." },
  { id: 5, user: "Rajesh Patel", rating: 2, comment: "Not enough cold storage available." }
];
