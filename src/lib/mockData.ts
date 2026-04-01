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
  { id: 'c38', name: 'Bajra (बाजरा)', category: 'Grains', image: 'https://images.unsplash.com/photo-1634547960309-8805f157796d?auto=format&fit=crop&q=80&w=300' },
  { id: 'c39', name: 'Jowar (ज्वार)', category: 'Grains', image: 'https://images.unsplash.com/photo-1599639957043-f3aa5c986398?auto=format&fit=crop&q=80&w=300' },
  { id: 'c40', name: 'Gram (चना)', category: 'Pulses', image: 'https://images.unsplash.com/photo-1587478500-e5f2eb18e76e?auto=format&fit=crop&q=80&w=300' },
];

// COMPREHENSIVE PAN-INDIA MANDI DATABASE
// Covering all major agricultural states with real GPS coordinates

const mandiData = [
  // ==================== PUNJAB (30 Mandis) ====================
  { name: 'Ludhiana Grain Market', location: 'Ludhiana, Punjab', lat: 30.9010, lng: 75.8573, state: 'Punjab' },
  { name: 'Amritsar Krishi Mandi', location: 'Amritsar, Punjab', lat: 31.6340, lng: 74.8723, state: 'Punjab' },
  { name: 'Jalandhar Grain Market', location: 'Jalandhar, Punjab', lat: 31.3260, lng: 75.5762, state: 'Punjab' },
  { name: 'Patiala Krishi Mandi', location: 'Patiala, Punjab', lat: 30.3398, lng: 76.3869, state: 'Punjab' },
  { name: 'Bathinda Grain Market', location: 'Bathinda, Punjab', lat: 30.2110, lng: 74.9455, state: 'Punjab' },
  { name: 'Hoshiarpur APMC', location: 'Hoshiarpur, Punjab', lat: 31.5337, lng: 75.9119, state: 'Punjab' },
  { name: 'Moga Krishi Mandi', location: 'Moga, Punjab', lat: 30.8155, lng: 75.1705, state: 'Punjab' },
  { name: 'Pathankot Grain Market', location: 'Pathankot, Punjab', lat: 32.2746, lng: 75.6521, state: 'Punjab' },
  { name: 'Sangrur Krishi Upaj Mandi', location: 'Sangrur, Punjab', lat: 30.2458, lng: 75.8421, state: 'Punjab' },
  { name: 'Firozpur Mandi', location: 'Firozpur, Punjab', lat: 30.9257, lng: 74.6142, state: 'Punjab' },
  { name: 'Kapurthala Krishi Mandi', location: 'Kapurthala, Punjab', lat: 31.3800, lng: 75.3800, state: 'Punjab' },
  { name: 'Fazilka Grain Market', location: 'Fazilka, Punjab', lat: 30.4028, lng: 74.0281, state: 'Punjab' },
  { name: 'Mansa Krishi Mandi', location: 'Mansa, Punjab', lat: 29.9988, lng: 75.3933, state: 'Punjab' },
  { name: 'Barnala APMC', location: 'Barnala, Punjab', lat: 30.3742, lng: 75.5484, state: 'Punjab' },
  { name: 'Gurdaspur Krishi Mandi', location: 'Gurdaspur, Punjab', lat: 32.0404, lng: 75.4056, state: 'Punjab' },
  { name: 'Faridkot Grain Market', location: 'Faridkot, Punjab', lat: 30.6708, lng: 74.7573, state: 'Punjab' },
  { name: 'Muktsar Krishi Mandi', location: 'Muktsar, Punjab', lat: 30.4758, lng: 74.5163, state: 'Punjab' },
  { name: 'Tarn Taran Mandi', location: 'Tarn Taran, Punjab', lat: 31.4519, lng: 74.9278, state: 'Punjab' },
  { name: 'Rupnagar (Ropar) APMC', location: 'Rupnagar, Punjab', lat: 30.9687, lng: 76.5294, state: 'Punjab' },
  { name: 'Nawanshahr (SBS Nagar) Mandi', location: 'Nawanshahr, Punjab', lat: 31.1246, lng: 76.1163, state: 'Punjab' },
  { name: 'Fatehgarh Sahib Krishi Mandi', location: 'Fatehgarh Sahib, Punjab', lat: 30.6466, lng: 76.3932, state: 'Punjab' },
  { name: 'Mohali (SAS Nagar) Grain Market', location: 'Mohali, Punjab', lat: 30.7046, lng: 76.7179, state: 'Punjab' },
  { name: 'Khanna Krishi Mandi', location: 'Khanna, Punjab', lat: 30.7057, lng: 76.2219, state: 'Punjab' },
  { name: 'Malerkotla Mandi', location: 'Malerkotla, Punjab', lat: 30.5316, lng: 75.8792, state: 'Punjab' },
  { name: 'Abohar Grain Market', location: 'Abohar, Punjab', lat: 30.1446, lng: 74.1957, state: 'Punjab' },
  { name: 'Rajpura Mandi', location: 'Rajpura, Punjab', lat: 30.4778, lng: 76.5943, state: 'Punjab' },
  { name: 'Samana Grain Market', location: 'Samana, Punjab', lat: 30.1469, lng: 76.1933, state: 'Punjab' },
  { name: 'Dhuri Krishi Mandi', location: 'Dhuri, Punjab', lat: 30.3687, lng: 75.8679, state: 'Punjab' },
  { name: 'Sunam APMC', location: 'Sunam, Punjab', lat: 30.1283, lng: 75.7993, state: 'Punjab' },
  { name: 'Nabha Krishi Mandi', location: 'Nabha, Punjab', lat: 30.3752, lng: 76.1531, state: 'Punjab' },

  // ==================== HARYANA (25 Mandis) ====================
  { name: 'Karnal Grain Market', location: 'Karnal, Haryana', lat: 29.6857, lng: 76.9905, state: 'Haryana' },
  { name: 'Hisar Krishi Upaj Mandi', location: 'Hisar, Haryana', lat: 29.1492, lng: 75.7217, state: 'Haryana' },
  { name: 'Ambala Krishi Mandi', location: 'Ambala, Haryana', lat: 30.3782, lng: 76.7767, state: 'Haryana' },
  { name: 'Panipat Grain Market', location: 'Panipat, Haryana', lat: 29.3909, lng: 76.9635, state: 'Haryana' },
  { name: 'Rohtak Krishi Upaj Mandi', location: 'Rohtak, Haryana', lat: 28.8955, lng: 76.6066, state: 'Haryana' },
  { name: 'Sonipat Mandi', location: 'Sonipat, Haryana', lat: 28.9931, lng: 77.0151, state: 'Haryana' },
  { name: 'Yamuna Nagar APMC', location: 'Yamuna Nagar, Haryana', lat: 30.1290, lng: 77.2674, state: 'Haryana' },
  { name: 'Kurukshetra Krishi Mandi', location: 'Kurukshetra, Haryana', lat: 29.9729, lng: 76.8783, state: 'Haryana' },
  { name: 'Faridabad Mandi', location: 'Faridabad, Haryana', lat: 28.4089, lng: 77.3178, state: 'Haryana' },
  { name: 'Gurgaon (Gurugram) Mandi', location: 'Gurugram, Haryana', lat: 28.4595, lng: 77.0266, state: 'Haryana' },
  { name: 'Bhiwani Krishi Upaj Mandi', location: 'Bhiwani, Haryana', lat: 28.7930, lng: 76.1395, state: 'Haryana' },
  { name: 'Sirsa Grain Market', location: 'Sirsa, Haryana', lat: 29.5353, lng: 75.0289, state: 'Haryana' },
  { name: 'Fatehabad Mandi', location: 'Fatehabad, Haryana', lat: 29.5152, lng: 75.4551, state: 'Haryana' },
  { name: 'Jind Krishi Mandi', location: 'Jind, Haryana', lat: 29.3157, lng: 76.3160, state: 'Haryana' },
  { name: 'Kaithal APMC', location: 'Kaithal, Haryana', lat: 29.8014, lng: 76.3997, state: 'Haryana' },
  { name: 'Palwal Krishi Upaj Mandi', location: 'Palwal, Haryana', lat: 28.1442, lng: 77.3266, state: 'Haryana' },
  { name: 'Rewari Mandi', location: 'Rewari, Haryana', lat: 28.1989, lng: 76.6193, state: 'Haryana' },
  { name: 'Mahendragarh Krishi Mandi', location: 'Mahendragarh, Haryana', lat: 28.2832, lng: 76.1499, state: 'Haryana' },
  { name: 'Narnaul APMC', location: 'Narnaul, Haryana', lat: 28.0446, lng: 76.1082, state: 'Haryana' },
  { name: 'Jhajjar Krishi Mandi', location: 'Jhajjar, Haryana', lat: 28.6063, lng: 76.6565, state: 'Haryana' },
  { name: 'Bahadurgarh Grain Market', location: 'Bahadurgarh, Haryana', lat: 28.6933, lng: 76.9365, state: 'Haryana' },
  { name: 'Gohana Mandi', location: 'Gohana, Haryana', lat: 29.1367, lng: 76.7009, state: 'Haryana' },
  { name: 'Charkhi Dadri APMC', location: 'Charkhi Dadri, Haryana', lat: 28.5916, lng: 76.2713, state: 'Haryana' },
  { name: 'Tosham Krishi Mandi', location: 'Tosham, Haryana', lat: 28.8710, lng: 75.9151, state: 'Haryana' },
  { name: 'Narwana Grain Market', location: 'Narwana, Haryana', lat: 29.5995, lng: 76.1192, state: 'Haryana' },

  // ==================== RAJASTHAN (35 Mandis) ====================
  { name: 'Jaipur Krishi Upaj Mandi', location: 'Jaipur, Rajasthan', lat: 26.9124, lng: 75.7873, state: 'Rajasthan' },
  { name: 'Kota Krishi Upaj Mandi', location: 'Kota, Rajasthan', lat: 25.1825, lng: 75.8390, state: 'Rajasthan' },
  { name: 'Jodhpur Mandi', location: 'Jodhpur, Rajasthan', lat: 26.2389, lng: 73.0243, state: 'Rajasthan' },
  { name: 'Ajmer Mandi Samiti', location: 'Ajmer, Rajasthan', lat: 26.4499, lng: 74.6399, state: 'Rajasthan' },
  { name: 'Udaipur Krishi Mandi', location: 'Udaipur, Rajasthan', lat: 24.5854, lng: 73.7125, state: 'Rajasthan' },
  { name: 'Bikaner APMC', location: 'Bikaner, Rajasthan', lat: 28.0229, lng: 73.3119, state: 'Rajasthan' },
  { name: 'Alwar Mandi Samiti', location: 'Alwar, Rajasthan', lat: 27.5530, lng: 76.6346, state: 'Rajasthan' },
  { name: 'Bharatpur Krishi Mandi', location: 'Bharatpur, Rajasthan', lat: 27.2173, lng: 77.4900, state: 'Rajasthan' },
  { name: 'Sikar Mandi', location: 'Sikar, Rajasthan', lat: 27.6119, lng: 75.1399, state: 'Rajasthan' },
  { name: 'Pali APMC Market', location: 'Pali, Rajasthan', lat: 25.7711, lng: 73.3234, state: 'Rajasthan' },
  { name: 'Tonk Krishi Upaj Mandi', location: 'Tonk, Rajasthan', lat: 26.1586, lng: 75.7905, state: 'Rajasthan' },
  { name: 'Bhilwara Mandi Samiti', location: 'Bhilwara, Rajasthan', lat: 25.3407, lng: 74.6408, state: 'Rajasthan' },
  { name: 'Chittorgarh Mandi', location: 'Chittorgarh, Rajasthan', lat: 24.8887, lng: 74.6269, state: 'Rajasthan' },
  { name: 'Ganganagar Sri Mandi', location: 'Sri Ganganagar, Rajasthan', lat: 29.9038, lng: 73.8772, state: 'Rajasthan' },
  { name: 'Hanumangarh Mandi', location: 'Hanumangarh, Rajasthan', lat: 29.5822, lng: 74.3220, state: 'Rajasthan' },
  { name: 'Jhunjhunu Krishi Mandi', location: 'Jhunjhunu, Rajasthan', lat: 28.1308, lng: 75.3980, state: 'Rajasthan' },
  { name: 'Nagaur APMC', location: 'Nagaur, Rajasthan', lat: 27.2023, lng: 73.7340, state: 'Rajasthan' },
  { name: 'Barmer Krishi Upaj Mandi', location: 'Barmer, Rajasthan', lat: 25.7521, lng: 71.3967, state: 'Rajasthan' },
  { name: 'Jalore Mandi Samiti', location: 'Jalore, Rajasthan', lat: 25.3456, lng: 72.6225, state: 'Rajasthan' },
  { name: 'Bundi Krishi Mandi', location: 'Bundi, Rajasthan', lat: 25.4430, lng: 75.6371, state: 'Rajasthan' },
  { name: 'Sawai Madhopur Mandi', location: 'Sawai Madhopur, Rajasthan', lat: 26.0173, lng: 76.3534, state: 'Rajasthan' },
  { name: 'Dausa Krishi Upaj Mandi', location: 'Dausa, Rajasthan', lat: 26.8942, lng: 76.5614, state: 'Rajasthan' },
  { name: 'Jhalawar Mandi', location: 'Jhalawar, Rajasthan', lat: 24.5979, lng: 76.1610, state: 'Rajasthan' },
  { name: 'Dungarpur APMC', location: 'Dungarpur, Rajasthan', lat: 23.8420, lng: 73.7147, state: 'Rajasthan' },
  { name: 'Churu Krishi Mandi', location: 'Churu, Rajasthan', lat: 28.2997, lng: 74.9647, state: 'Rajasthan' },
  { name: 'Banswara Mandi', location: 'Banswara, Rajasthan', lat: 23.5411, lng: 74.4416, state: 'Rajasthan' },
  { name: 'Sirohi Krishi Upaj Mandi', location: 'Sirohi, Rajasthan', lat: 24.8857, lng: 72.8586, state: 'Rajasthan' },
  { name: 'Pratapgarh Mandi', location: 'Pratapgarh, Rajasthan', lat: 24.0311, lng: 74.7789, state: 'Rajasthan' },
  { name: 'Rajsamand APMC', location: 'Rajsamand, Rajasthan', lat: 25.0714, lng: 73.8803, state: 'Rajasthan' },
  { name: 'Karauli Krishi Mandi', location: 'Karauli, Rajasthan', lat: 26.4988, lng: 77.0206, state: 'Rajasthan' },
  { name: 'Dholpur Mandi', location: 'Dholpur, Rajasthan', lat: 26.7048, lng: 77.9009, state: 'Rajasthan' },
  { name: 'Hanumangarh Town Grain Market', location: 'Hanumangarh Town, Rajasthan', lat: 29.6232, lng: 74.2896, state: 'Rajasthan' },
  { name: 'Beawar Krishi Mandi', location: 'Beawar, Rajasthan', lat: 26.1012, lng: 74.3199, state: 'Rajasthan' },
  { name: 'Kishangarh Mandi', location: 'Kishangarh, Rajasthan', lat: 26.5878, lng: 74.8642, state: 'Rajasthan' },
  { name: 'Makrana APMC', location: 'Makrana, Rajasthan', lat: 27.0424, lng: 74.7154, state: 'Rajasthan' },

  // ==================== UTTAR PRADESH (40 Mandis) ====================
  { name: 'Lucknow Dubagga Mandi', location: 'Lucknow, Uttar Pradesh', lat: 26.8467, lng: 80.9462, state: 'Uttar Pradesh' },
  { name: 'Kanpur Krishi Upaj Mandi', location: 'Kanpur, Uttar Pradesh', lat: 26.4499, lng: 80.3319, state: 'Uttar Pradesh' },
  { name: 'Varanasi Paharia Mandi', location: 'Varanasi, Uttar Pradesh', lat: 25.3176, lng: 82.9739, state: 'Uttar Pradesh' },
  { name: 'Agra Mandi Samiti', location: 'Agra, Uttar Pradesh', lat: 27.1767, lng: 78.0081, state: 'Uttar Pradesh' },
  { name: 'Meerut Krishi Mandi', location: 'Meerut, Uttar Pradesh', lat: 28.9845, lng: 77.7064, state: 'Uttar Pradesh' },
  { name: 'Allahabad (Prayagraj) Mandi', location: 'Prayagraj, Uttar Pradesh', lat: 25.4358, lng: 81.8463, state: 'Uttar Pradesh' },
  { name: 'Bareilly Krishi Upaj Mandi', location: 'Bareilly, Uttar Pradesh', lat: 28.3670, lng: 79.4304, state: 'Uttar Pradesh' },
  { name: 'Moradabad APMC', location: 'Moradabad, Uttar Pradesh', lat: 28.8389, lng: 78.7768, state: 'Uttar Pradesh' },
  { name: 'Aligarh Mandi', location: 'Aligarh, Uttar Pradesh', lat: 27.8974, lng: 78.0880, state: 'Uttar Pradesh' },
  { name: 'Gorakhpur Krishi Mandi', location: 'Gorakhpur, Uttar Pradesh', lat: 26.7606, lng: 83.3732, state: 'Uttar Pradesh' },
  { name: 'Saharanpur Krishi Upaj Mandi', location: 'Saharanpur, Uttar Pradesh', lat: 29.9680, lng: 77.5460, state: 'Uttar Pradesh' },
  { name: 'Ghaziabad Mandi', location: 'Ghaziabad, Uttar Pradesh', lat: 28.6692, lng: 77.4538, state: 'Uttar Pradesh' },
  { name: 'Noida Grain Market', location: 'Noida, Uttar Pradesh', lat: 28.5355, lng: 77.3910, state: 'Uttar Pradesh' },
  { name: 'Faizabad (Ayodhya) Mandi', location: 'Ayodhya, Uttar Pradesh', lat: 26.7751, lng: 82.1903, state: 'Uttar Pradesh' },
  { name: 'Jhansi Krishi Mandi', location: 'Jhansi, Uttar Pradesh', lat: 25.4484, lng: 78.5685, state: 'Uttar Pradesh' },
  { name: 'Mathura Krishi Upaj Mandi', location: 'Mathura, Uttar Pradesh', lat: 27.4924, lng: 77.6737, state: 'Uttar Pradesh' },
  { name: 'Muzaffarnagar Mandi', location: 'Muzaffarnagar, Uttar Pradesh', lat: 29.4727, lng: 77.7085, state: 'Uttar Pradesh' },
  { name: 'Firozabad APMC', location: 'Firozabad, Uttar Pradesh', lat: 27.1591, lng: 78.3957, state: 'Uttar Pradesh' },
  { name: 'Budaun Krishi Mandi', location: 'Budaun, Uttar Pradesh', lat: 28.0337, lng: 79.1144, state: 'Uttar Pradesh' },
  { name: 'Rampur Mandi', location: 'Rampur, Uttar Pradesh', lat: 28.8152, lng: 79.0256, state: 'Uttar Pradesh' },
  { name: 'Shahjahanpur Krishi Upaj Mandi', location: 'Shahjahanpur, Uttar Pradesh', lat: 27.8881, lng: 79.9063, state: 'Uttar Pradesh' },
  { name: 'Farrukhabad Mandi', location: 'Farrukhabad, Uttar Pradesh', lat: 27.3882, lng: 79.5801, state: 'Uttar Pradesh' },
  { name: 'Etawah Krishi Mandi', location: 'Etawah, Uttar Pradesh', lat: 26.7855, lng: 79.0215, state: 'Uttar Pradesh' },
  { name: 'Mainpuri APMC', location: 'Mainpuri, Uttar Pradesh', lat: 27.2354, lng: 79.0270, state: 'Uttar Pradesh' },
  { name: 'Unnao Krishi Upaj Mandi', location: 'Unnao, Uttar Pradesh', lat: 26.5464, lng: 80.4877, state: 'Uttar Pradesh' },
  { name: 'Hardoi Mandi', location: 'Hardoi, Uttar Pradesh', lat: 27.3968, lng: 80.1303, state: 'Uttar Pradesh' },
  { name: 'Sitapur Krishi Mandi', location: 'Sitapur, Uttar Pradesh', lat: 27.5672, lng: 80.6833, state: 'Uttar Pradesh' },
  { name: 'Lakhimpur Kheri Mandi', location: 'Lakhimpur, Uttar Pradesh', lat: 27.9478, lng: 80.7791, state: 'Uttar Pradesh' },
  { name: 'Bahraich Krishi Upaj Mandi', location: 'Bahraich, Uttar Pradesh', lat: 27.5742, lng: 81.5947, state: 'Uttar Pradesh' },
  { name: 'Basti Mandi', location: 'Basti, Uttar Pradesh', lat: 26.8127, lng: 82.7380, state: 'Uttar Pradesh' },
  { name: 'Deoria Krishi Mandi', location: 'Deoria, Uttar Pradesh', lat: 26.5024, lng: 83.7791, state: 'Uttar Pradesh' },
  { name: 'Azamgarh APMC', location: 'Azamgarh, Uttar Pradesh', lat: 26.0686, lng: 83.1839, state: 'Uttar Pradesh' },
  { name: 'Ballia Mandi', location: 'Ballia, Uttar Pradesh', lat: 25.7672, lng: 84.1496, state: 'Uttar Pradesh' },
  { name: 'Ghazipur Grain Market', location: 'Ghazipur, Uttar Pradesh', lat: 25.5880, lng: 83.5779, state: 'Uttar Pradesh' },
  { name: 'Mirzapur Krishi Mandi', location: 'Mirzapur, Uttar Pradesh', lat: 25.1460, lng: 82.5690, state: 'Uttar Pradesh' },
  { name: 'Banda Mandi', location: 'Banda, Uttar Pradesh', lat: 25.4772, lng: 80.3357, state: 'Uttar Pradesh' },
  { name: 'Fatehpur APMC', location: 'Fatehpur, Uttar Pradesh', lat: 25.9300, lng: 80.8126, state: 'Uttar Pradesh' },
  { name: 'Rae Bareli Krishi Mandi', location: 'Rae Bareli, Uttar Pradesh', lat: 26.2152, lng: 81.2459, state: 'Uttar Pradesh' },
  { name: 'Sultanpur Mandi', location: 'Sultanpur, Uttar Pradesh', lat: 26.2648, lng: 82.0730, state: 'Uttar Pradesh' },
  { name: 'Pratapgarh Krishi Upaj Mandi', location: 'Pratapgarh, Uttar Pradesh', lat: 25.8968, lng: 81.9378, state: 'Uttar Pradesh' },

  // ==================== MADHYA PRADESH (30 Mandis) ====================
  { name: 'Indore Krishi Upaj Mandi', location: 'Indore, Madhya Pradesh', lat: 22.7196, lng: 75.8577, state: 'Madhya Pradesh' },
  { name: 'Bhopal Krishi Upaj Mandi', location: 'Bhopal, Madhya Pradesh', lat: 23.2599, lng: 77.4126, state: 'Madhya Pradesh' },
  { name: 'Jabalpur APMC Market', location: 'Jabalpur, Madhya Pradesh', lat: 23.1815, lng: 79.9864, state: 'Madhya Pradesh' },
  { name: 'Gwalior Krishi Mandi', location: 'Gwalior, Madhya Pradesh', lat: 26.2183, lng: 78.1828, state: 'Madhya Pradesh' },
  { name: 'Ujjain Krishi Upaj Mandi', location: 'Ujjain, Madhya Pradesh', lat: 23.1765, lng: 75.7885, state: 'Madhya Pradesh' },
  { name: 'Sagar Mandi Samiti', location: 'Sagar, Madhya Pradesh', lat: 23.8388, lng: 78.7378, state: 'Madhya Pradesh' },
  { name: 'Dewas Krishi Mandi', location: 'Dewas, Madhya Pradesh', lat: 22.9676, lng: 76.0534, state: 'Madhya Pradesh' },
  { name: 'Ratlam APMC', location: 'Ratlam, Madhya Pradesh', lat: 23.3315, lng: 75.0367, state: 'Madhya Pradesh' },
  { name: 'Satna Krishi Upaj Mandi', location: 'Satna, Madhya Pradesh', lat: 24.6005, lng: 80.8322, state: 'Madhya Pradesh' },
  { name: 'Rewa Mandi Samiti', location: 'Rewa, Madhya Pradesh', lat: 24.5370, lng: 81.2961, state: 'Madhya Pradesh' },
  { name: 'Murwara (Katni) Mandi', location: 'Katni, Madhya Pradesh', lat: 23.8346, lng: 80.3942, state: 'Madhya Pradesh' },
  { name: 'Singrauli Krishi Mandi', location: 'Singrauli, Madhya Pradesh', lat: 24.1997, lng: 82.6746, state: 'Madhya Pradesh' },
  { name: 'Mandsaur Krishi Upaj Mandi', location: 'Mandsaur, Madhya Pradesh', lat: 24.0734, lng: 75.0694, state: 'Madhya Pradesh' },
  { name: 'Neemuch APMC', location: 'Neemuch, Madhya Pradesh', lat: 24.4709, lng: 74.8709, state: 'Madhya Pradesh' },
  { name: 'Khandwa Krishi Mandi', location: 'Khandwa, Madhya Pradesh', lat: 21.8333, lng: 76.3500, state: 'Madhya Pradesh' },
  { name: 'Burhanpur Mandi', location: 'Burhanpur, Madhya Pradesh', lat: 21.3111, lng: 76.2281, state: 'Madhya Pradesh' },
  { name: 'Khargone Krishi Upaj Mandi', location: 'Khargone, Madhya Pradesh', lat: 21.8234, lng: 75.6147, state: 'Madhya Pradesh' },
  { name: 'Betul Mandi Samiti', location: 'Betul, Madhya Pradesh', lat: 21.9077, lng: 77.9036, state: 'Madhya Pradesh' },
  { name: 'Chhindwara Krishi Mandi', location: 'Chhindwara, Madhya Pradesh', lat: 22.0567, lng: 78.9393, state: 'Madhya Pradesh' },
  { name: 'Seoni APMC', location: 'Seoni, Madhya Pradesh', lat: 22.0869, lng: 79.5508, state: 'Madhya Pradesh' },
  { name: 'Vidisha Krishi Mandi', location: 'Vidisha, Madhya Pradesh', lat: 23.5251, lng: 77.8081, state: 'Madhya Pradesh' },
  { name: 'Raisen Mandi', location: 'Raisen, Madhya Pradesh', lat: 23.3315, lng: 77.7997, state: 'Madhya Pradesh' },
  { name: 'Sehore Krishi Upaj Mandi', location: 'Sehore, Madhya Pradesh', lat: 23.2003, lng: 77.0854, state: 'Madhya Pradesh' },
  { name: 'Shajapur Mandi', location: 'Shajapur, Madhya Pradesh', lat: 23.4273, lng: 76.2728, state: 'Madhya Pradesh' },
  { name: 'Morena Krishi Mandi', location: 'Morena, Madhya Pradesh', lat: 26.4955, lng: 78.0014, state: 'Madhya Pradesh' },
  { name: 'Shivpuri APMC', location: 'Shivpuri, Madhya Pradesh', lat: 25.4236, lng: 77.6605, state: 'Madhya Pradesh' },
  { name: 'Damoh Krishi Mandi', location: 'Damoh, Madhya Pradesh', lat: 23.8319, lng: 79.4420, state: 'Madhya Pradesh' },
  { name: 'Panna Mandi', location: 'Panna, Madhya Pradesh', lat: 24.7187, lng: 80.1946, state: 'Madhya Pradesh' },
  { name: 'Hoshangabad Krishi Upaj Mandi', location: 'Hoshangabad, Madhya Pradesh', lat: 22.7541, lng: 77.7291, state: 'Madhya Pradesh' },
  { name: 'Shahdol APMC', location: 'Shahdol, Madhya Pradesh', lat: 23.2966, lng: 81.3626, state: 'Madhya Pradesh' },

  // ==================== DELHI & NCR (8 Mandis) ====================
  { name: 'Azadpur Mandi (Asia\'s Largest)', location: 'Delhi', lat: 28.7041, lng: 77.1025, state: 'Delhi' },
  { name: 'Ghazipur Mandi', location: 'Delhi', lat: 28.6515, lng: 77.3180, state: 'Delhi' },
  { name: 'Okhla Sabzi Mandi', location: 'Delhi', lat: 28.5494, lng: 77.2710, state: 'Delhi' },
  { name: 'Najafgarh Mandi', location: 'Delhi', lat: 28.6092, lng: 76.9798, state: 'Delhi' },
  { name: 'Keshopur Mandi', location: 'Delhi', lat: 28.6731, lng: 77.1367, state: 'Delhi' },
  { name: 'Narela Mandi', location: 'Delhi', lat: 28.8521, lng: 77.0892, state: 'Delhi' },
  { name: 'Greater Noida APMC', location: 'Greater Noida, Uttar Pradesh', lat: 28.4744, lng: 77.5040, state: 'Uttar Pradesh' },
  { name: 'Chandigarh Grain Market', location: 'Chandigarh', lat: 30.7333, lng: 76.7794, state: 'Chandigarh' },

  // ==================== MAHARASHTRA (15 Mandis) ====================
  { name: 'Vashi APMC (Navi Mumbai)', location: 'Navi Mumbai, Maharashtra', lat: 19.0760, lng: 72.9984, state: 'Maharashtra' },
  { name: 'Pune APMC Market', location: 'Pune, Maharashtra', lat: 18.5204, lng: 73.8567, state: 'Maharashtra' },
  { name: 'Nashik Lasalgaon Mandi', location: 'Nashik, Maharashtra', lat: 20.1467, lng: 74.2331, state: 'Maharashtra' },
  { name: 'Nagpur APMC', location: 'Nagpur, Maharashtra', lat: 21.1458, lng: 79.0882, state: 'Maharashtra' },
  { name: 'Aurangabad Krishi Utpanna Market', location: 'Aurangabad, Maharashtra', lat: 19.8762, lng: 75.3433, state: 'Maharashtra' },
  { name: 'Solapur APMC', location: 'Solapur, Maharashtra', lat: 17.6599, lng: 75.9064, state: 'Maharashtra' },
  { name: 'Kolhapur Krishi Utpanna Bazar', location: 'Kolhapur, Maharashtra', lat: 16.7050, lng: 74.2433, state: 'Maharashtra' },
  { name: 'Ahmednagar Mandi', location: 'Ahmednagar, Maharashtra', lat: 19.0948, lng: 74.7480, state: 'Maharashtra' },
  { name: 'Jalgaon APMC', location: 'Jalgaon, Maharashtra', lat: 21.0077, lng: 75.5626, state: 'Maharashtra' },
  { name: 'Sangli Grape Market', location: 'Sangli, Maharashtra', lat: 16.8524, lng: 74.5815, state: 'Maharashtra' },
  { name: 'Satara Krishi Utpanna Market', location: 'Satara, Maharashtra', lat: 17.6805, lng: 74.0183, state: 'Maharashtra' },
  { name: 'Latur APMC', location: 'Latur, Maharashtra', lat: 18.3983, lng: 76.5604, state: 'Maharashtra' },
  { name: 'Nanded Krishi Bazar', location: 'Nanded, Maharashtra', lat: 19.1383, lng: 77.3210, state: 'Maharashtra' },
  { name: 'Akola Mandi', location: 'Akola, Maharashtra', lat: 20.7002, lng: 77.0082, state: 'Maharashtra' },
  { name: 'Amravati APMC', location: 'Amravati, Maharashtra', lat: 20.9374, lng: 77.7796, state: 'Maharashtra' },

  // ==================== GUJARAT (12 Mandis) ====================
  { name: 'Ahmedabad APMC', location: 'Ahmedabad, Gujarat', lat: 23.0225, lng: 72.5714, state: 'Gujarat' },
  { name: 'Surat APMC', location: 'Surat, Gujarat', lat: 21.1702, lng: 72.8311, state: 'Gujarat' },
  { name: 'Rajkot APMC', location: 'Rajkot, Gujarat', lat: 22.3039, lng: 70.8022, state: 'Gujarat' },
  { name: 'Vadodara Krishi Upaj Mandi', location: 'Vadodara, Gujarat', lat: 22.3072, lng: 73.1812, state: 'Gujarat' },
  { name: 'Bhavnagar APMC', location: 'Bhavnagar, Gujarat', lat: 21.7645, lng: 72.1519, state: 'Gujarat' },
  { name: 'Junagadh Mandi', location: 'Junagadh, Gujarat', lat: 21.5222, lng: 70.4579, state: 'Gujarat' },
  { name: 'Anand APMC (Milk & Veg)', location: 'Anand, Gujarat', lat: 22.5645, lng: 72.9289, state: 'Gujarat' },
  { name: 'Mehsana Grain Market', location: 'Mehsana, Gujarat', lat: 23.5880, lng: 72.3693, state: 'Gujarat' },
  { name: 'Gandhinagar APMC', location: 'Gandhinagar, Gujarat', lat: 23.2156, lng: 72.6369, state: 'Gujarat' },
  { name: 'Bharuch Krishi Mandi', location: 'Bharuch, Gujarat', lat: 21.7051, lng: 72.9959, state: 'Gujarat' },
  { name: 'Navsari APMC', location: 'Navsari, Gujarat', lat: 20.9504, lng: 72.9230, state: 'Gujarat' },
  { name: 'Morbi Cotton Market', location: 'Morbi, Gujarat', lat: 22.8173, lng: 70.8372, state: 'Gujarat' },

  // ==================== KARNATAKA (10 Mandis) ====================
  { name: 'Bangalore Yeshwanthpur APMC', location: 'Bangalore, Karnataka', lat: 13.0229, lng: 77.5464, state: 'Karnataka' },
  { name: 'Mysore APMC', location: 'Mysore, Karnataka', lat: 12.2958, lng: 76.6394, state: 'Karnataka' },
  { name: 'Hubli APMC', location: 'Hubli, Karnataka', lat: 15.3647, lng: 75.1240, state: 'Karnataka' },
  { name: 'Belgaum Krishi Utpanna Mandi', location: 'Belgaum, Karnataka', lat: 15.8497, lng: 74.4977, state: 'Karnataka' },
  { name: 'Davangere APMC', location: 'Davangere, Karnataka', lat: 14.4644, lng: 75.9218, state: 'Karnataka' },
  { name: 'Mandya Sugar Belt Mandi', location: 'Mandya, Karnataka', lat: 12.5244, lng: 76.8951, state: 'Karnataka' },
  { name: 'Shimoga Krishi Mandi', location: 'Shimoga, Karnataka', lat: 13.9299, lng: 75.5681, state: 'Karnataka' },
  { name: 'Bellary APMC', location: 'Bellary, Karnataka', lat: 15.1393, lng: 76.9214, state: 'Karnataka' },
  { name: 'Gulbarga Agricultural Market', location: 'Gulbarga, Karnataka', lat: 17.3297, lng: 76.8343, state: 'Karnataka' },
  { name: 'Tumkur Coconut Mandi', location: 'Tumkur, Karnataka', lat: 13.3379, lng: 77.1001, state: 'Karnataka' },

  // ==================== TELANGANA (8 Mandis) ====================
  { name: 'Hyderabad Bowenpally Market', location: 'Hyderabad, Telangana', lat: 17.4625, lng: 78.5080, state: 'Telangana' },
  { name: 'Warangal Krishi Upaj Mandi', location: 'Warangal, Telangana', lat: 17.9689, lng: 79.5941, state: 'Telangana' },
  { name: 'Nizamabad APMC', location: 'Nizamabad, Telangana', lat: 18.6725, lng: 78.0941, state: 'Telangana' },
  { name: 'Karimnagar Agricultural Market', location: 'Karimnagar, Telangana', lat: 18.4386, lng: 79.1288, state: 'Telangana' },
  { name: 'Khammam Mandi', location: 'Khammam, Telangana', lat: 17.2473, lng: 80.1514, state: 'Telangana' },
  { name: 'Mahbubnagar Krishi Mandi', location: 'Mahbubnagar, Telangana', lat: 16.7488, lng: 77.9836, state: 'Telangana' },
  { name: 'Nalgonda APMC', location: 'Nalgonda, Telangana', lat: 17.0501, lng: 79.2678, state: 'Telangana' },
  { name: 'Adilabad Grain Market', location: 'Adilabad, Telangana', lat: 19.6638, lng: 78.5310, state: 'Telangana' },

  // ==================== ANDHRA PRADESH (8 Mandis) ====================
  { name: 'Vijayawada Rythu Bazar', location: 'Vijayawada, Andhra Pradesh', lat: 16.5062, lng: 80.6480, state: 'Andhra Pradesh' },
  { name: 'Guntur Mirchi Yard (Chilli)', location: 'Guntur, Andhra Pradesh', lat: 16.3067, lng: 80.4365, state: 'Andhra Pradesh' },
  { name: 'Visakhapatnam Agricultural Market', location: 'Visakhapatnam, Andhra Pradesh', lat: 17.6868, lng: 83.2185, state: 'Andhra Pradesh' },
  { name: 'Tirupati Rythu Bazar', location: 'Tirupati, Andhra Pradesh', lat: 13.6288, lng: 79.4192, state: 'Andhra Pradesh' },
  { name: 'Kurnool APMC', location: 'Kurnool, Andhra Pradesh', lat: 15.8281, lng: 78.0373, state: 'Andhra Pradesh' },
  { name: 'Anantapur Groundnut Market', location: 'Anantapur, Andhra Pradesh', lat: 14.6819, lng: 77.6006, state: 'Andhra Pradesh' },
  { name: 'Kadapa Agricultural Mandi', location: 'Kadapa, Andhra Pradesh', lat: 14.4673, lng: 78.8242, state: 'Andhra Pradesh' },
  { name: 'Rajahmundry Krishi Mandi', location: 'Rajahmundry, Andhra Pradesh', lat: 17.0005, lng: 81.8040, state: 'Andhra Pradesh' },

  // ==================== TAMIL NADU (8 Mandis) ====================
  { name: 'Chennai Koyambedu Market', location: 'Chennai, Tamil Nadu', lat: 13.0671, lng: 80.1955, state: 'Tamil Nadu' },
  { name: 'Coimbatore Regulated Market', location: 'Coimbatore, Tamil Nadu', lat: 11.0168, lng: 76.9558, state: 'Tamil Nadu' },
  { name: 'Madurai Mattuthavani Market', location: 'Madurai, Tamil Nadu', lat: 9.9252, lng: 78.1198, state: 'Tamil Nadu' },
  { name: 'Salem Agricultural Market', location: 'Salem, Tamil Nadu', lat: 11.6643, lng: 78.1460, state: 'Tamil Nadu' },
  { name: 'Trichy Uzhavar Santhai', location: 'Trichy, Tamil Nadu', lat: 10.7905, lng: 78.7047, state: 'Tamil Nadu' },
  { name: 'Erode Turmeric Market', location: 'Erode, Tamil Nadu', lat: 11.3410, lng: 77.7172, state: 'Tamil Nadu' },
  { name: 'Tirunelveli Krishi Mandi', location: 'Tirunelveli, Tamil Nadu', lat: 8.7139, lng: 77.7567, state: 'Tamil Nadu' },
  { name: 'Vellore Agricultural Market', location: 'Vellore, Tamil Nadu', lat: 12.9165, lng: 79.1325, state: 'Tamil Nadu' },

  // ==================== WEST BENGAL (6 Mandis) ====================
  { name: 'Kolkata Posta Market', location: 'Kolkata, West Bengal', lat: 22.5726, lng: 88.3639, state: 'West Bengal' },
  { name: 'Siliguri Regulated Market', location: 'Siliguri, West Bengal', lat: 26.7271, lng: 88.3953, state: 'West Bengal' },
  { name: 'Burdwan Krishi Mandi', location: 'Burdwan, West Bengal', lat: 23.2324, lng: 87.8615, state: 'West Bengal' },
  { name: 'Asansol Grain Market', location: 'Asansol, West Bengal', lat: 23.6739, lng: 86.9524, state: 'West Bengal' },
  { name: 'Durgapur Agricultural Mandi', location: 'Durgapur, West Bengal', lat: 23.5204, lng: 87.3119, state: 'West Bengal' },
  { name: 'Malda Mango Market', location: 'Malda, West Bengal', lat: 25.0096, lng: 88.1406, state: 'West Bengal' },

  // ==================== BIHAR (6 Mandis) ====================
  { name: 'Patna Musallahpur Mandi', location: 'Patna, Bihar', lat: 25.5941, lng: 85.1376, state: 'Bihar' },
  { name: 'Muzaffarpur Litchi Market', location: 'Muzaffarpur, Bihar', lat: 26.1197, lng: 85.3910, state: 'Bihar' },
  { name: 'Gaya Krishi Mandi', location: 'Gaya, Bihar', lat: 24.7955, lng: 84.9994, state: 'Bihar' },
  { name: 'Bhagalpur Agricultural Market', location: 'Bhagalpur, Bihar', lat: 25.2425, lng: 86.9719, state: 'Bihar' },
  { name: 'Darbhanga Krishi Upaj Mandi', location: 'Darbhanga, Bihar', lat: 26.1542, lng: 85.8918, state: 'Bihar' },
  { name: 'Purnia Grain Market', location: 'Purnia, Bihar', lat: 25.7771, lng: 87.4753, state: 'Bihar' },

  // ==================== CHHATTISGARH (4 Mandis) ====================
  { name: 'Raipur Krishi Upaj Mandi', location: 'Raipur, Chhattisgarh', lat: 21.2514, lng: 81.6296, state: 'Chhattisgarh' },
  { name: 'Bilaspur APMC', location: 'Bilaspur, Chhattisgarh', lat: 22.0797, lng: 82.1409, state: 'Chhattisgarh' },
  { name: 'Durg Agricultural Market', location: 'Durg, Chhattisgarh', lat: 21.1905, lng: 81.2849, state: 'Chhattisgarh' },
  { name: 'Raigarh Krishi Mandi', location: 'Raigarh, Chhattisgarh', lat: 21.8974, lng: 83.3950, state: 'Chhattisgarh' },

  // ==================== ODISHA (4 Mandis) ====================
  { name: 'Bhubaneswar Unit-1 Market', location: 'Bhubaneswar, Odisha', lat: 20.2961, lng: 85.8245, state: 'Odisha' },
  { name: 'Cuttack Malgodown Mandi', location: 'Cuttack, Odisha', lat: 20.4625, lng: 85.8830, state: 'Odisha' },
  { name: 'Berhampur Agricultural Market', location: 'Berhampur, Odisha', lat: 19.3150, lng: 84.7941, state: 'Odisha' },
  { name: 'Sambalpur Krishi Mandi', location: 'Sambalpur, Odisha', lat: 21.4669, lng: 83.9812, state: 'Odisha' },

  // ==================== JHARKHAND (3 Mandis) ====================
  { name: 'Ranchi Krishi Upaj Mandi', location: 'Ranchi, Jharkhand', lat: 23.3441, lng: 85.3096, state: 'Jharkhand' },
  { name: 'Jamshedpur Agricultural Market', location: 'Jamshedpur, Jharkhand', lat: 22.8046, lng: 86.2029, state: 'Jharkhand' },
  { name: 'Dhanbad Grain Market', location: 'Dhanbad, Jharkhand', lat: 23.7957, lng: 86.4304, state: 'Jharkhand' },

  // ==================== ASSAM (3 Mandis) ====================
  { name: 'Guwahati Pamohi Market', location: 'Guwahati, Assam', lat: 26.1445, lng: 91.7362, state: 'Assam' },
  { name: 'Dibrugarh Tea Market', location: 'Dibrugarh, Assam', lat: 27.4728, lng: 94.9120, state: 'Assam' },
  { name: 'Jorhat Agricultural Mandi', location: 'Jorhat, Assam', lat: 26.7509, lng: 94.2037, state: 'Assam' },

  // ==================== UTTARAKHAND (3 Mandis) ====================
  { name: 'Dehradun Krishi Mandi', location: 'Dehradun, Uttarakhand', lat: 30.3165, lng: 78.0322, state: 'Uttarakhand' },
  { name: 'Haldwani Agricultural Market', location: 'Haldwani, Uttarakhand', lat: 29.2183, lng: 79.5110, state: 'Uttarakhand' },
  { name: 'Haridwar Grain Market', location: 'Haridwar, Uttarakhand', lat: 29.9457, lng: 78.1642, state: 'Uttarakhand' },

  // ==================== HIMACHAL PRADESH (3 Mandis) ====================
  { name: 'Shimla Sabzi Mandi', location: 'Shimla, Himachal Pradesh', lat: 31.1048, lng: 77.1734, state: 'Himachal Pradesh' },
  { name: 'Solan Apple Market', location: 'Solan, Himachal Pradesh', lat: 30.9045, lng: 77.0967, state: 'Himachal Pradesh' },
  { name: 'Mandi Krishi Upaj Bazar', location: 'Mandi, Himachal Pradesh', lat: 31.7077, lng: 76.9318, state: 'Himachal Pradesh' },

  // ==================== JAMMU & KASHMIR (3 Mandis) ====================
  { name: 'Jammu Narwal Mandi', location: 'Jammu, Jammu & Kashmir', lat: 32.7266, lng: 74.8570, state: 'Jammu & Kashmir' },
  { name: 'Srinagar Parimpora Market', location: 'Srinagar, Jammu & Kashmir', lat: 34.0837, lng: 74.7973, state: 'Jammu & Kashmir' },
  { name: 'Anantnag Agricultural Market', location: 'Anantnag, Jammu & Kashmir', lat: 33.7311, lng: 75.1480, state: 'Jammu & Kashmir' },

  // ==================== KERALA (3 Mandis) ====================
  { name: 'Kochi Vegetable Market', location: 'Kochi, Kerala', lat: 9.9312, lng: 76.2673, state: 'Kerala' },
  { name: 'Thiruvananthapuram Krishi Bhavan', location: 'Thiruvananthapuram, Kerala', lat: 8.5241, lng: 76.9366, state: 'Kerala' },
  { name: 'Kozhikode Wholesale Market', location: 'Kozhikode, Kerala', lat: 11.2588, lng: 75.7804, state: 'Kerala' },
];

export const MANDIS = mandiData.map((mandi, index) => ({
  id: `m${index + 1}`,
  name: mandi.name,
  location: mandi.location,
  latitude: mandi.lat,
  longitude: mandi.lng,
  distance: getRandomDistance() + ' km',
  trustScore: getRandomTrust(),
  isVerified: Math.random() > 0.25, // 75% verified
  image: `https://images.unsplash.com/photo-${1560806887 + (index * 123)}?auto=format&fit=crop&q=80&w=800`,
  updates: [
    'Heavy arrival of wheat expected tomorrow',
    'New digital payment system active',
    'Quality testing lab now operational',
    'Extended hours during harvest season',
    'Cold storage facilities available',
    'Free soil testing camp this weekend'
  ][index % 6],
  schedule: {
    open: '06:00 AM',
    close: '06:00 PM',
    holidays: ['Sunday']
  }
}));

// Price generation helper - region-specific variations
const generateRegionalPrices = (state: string) => {
  const baseMultiplier = {
    'Punjab': 1.15,
    'Haryana': 1.10,
    'Uttar Pradesh': 1.05,
    'Rajasthan': 1.00,
    'Madhya Pradesh': 0.95,
    'Delhi': 1.12,
    'Chandigarh': 1.13,
    'Maharashtra': 1.08,
    'Gujarat': 1.06,
    'Karnataka': 1.03,
    'Telangana': 1.02,
    'Andhra Pradesh': 1.01,
    'Tamil Nadu': 1.04,
    'West Bengal': 0.98,
    'Bihar': 0.93,
    'Chhattisgarh': 0.94,
    'Odisha': 0.96,
    'Jharkhand': 0.92,
    'Assam': 0.97,
    'Uttarakhand': 1.07,
    'Himachal Pradesh': 1.09,
    'Jammu & Kashmir': 1.11,
    'Kerala': 1.05
  }[state] || 1.0;

  return {
    // Grains
    c1: Math.round(2050 * baseMultiplier), // Wheat
    c2: Math.round(3200 * baseMultiplier), // Rice Basmati
    c8: Math.round(1850 * baseMultiplier), // Maize
    c38: Math.round(1950 * baseMultiplier), // Bajra
    c39: Math.round(2150 * baseMultiplier), // Jowar
    
    // Vegetables
    c3: Math.round(1200 * baseMultiplier), // Tomato
    c4: Math.round(1800 * baseMultiplier), // Onion
    c5: Math.round(1100 * baseMultiplier), // Potato
    c22: Math.round(900 * baseMultiplier), // Cabbage
    c23: Math.round(1400 * baseMultiplier), // Cauliflower
    c24: Math.round(1600 * baseMultiplier), // Brinjal
    c25: Math.round(2200 * baseMultiplier), // Okra
    c26: Math.round(1300 * baseMultiplier), // Spinach
    c27: Math.round(1500 * baseMultiplier), // Carrot
    c28: Math.round(800 * baseMultiplier), // Radish
    c29: Math.round(3500 * baseMultiplier), // Peas
    c30: Math.round(2800 * baseMultiplier), // Green Beans
    
    // Pulses
    c9: Math.round(4200 * baseMultiplier), // Soybean
    c31: Math.round(6500 * baseMultiplier), // Moong Dal
    c32: Math.round(7200 * baseMultiplier), // Urad Dal
    c33: Math.round(6800 * baseMultiplier), // Toor Dal
    c40: Math.round(5500 * baseMultiplier), // Gram
    
    // Oilseeds
    c10: Math.round(5200 * baseMultiplier), // Mustard
    c34: Math.round(5800 * baseMultiplier), // Groundnut
    c35: Math.round(6200 * baseMultiplier), // Sunflower
    c36: Math.round(9500 * baseMultiplier), // Sesame
    
    // Fibre
    c6: Math.round(5600 * baseMultiplier), // Cotton
    c37: Math.round(4100 * baseMultiplier), // Jute
    
    // Commercial
    c7: Math.round(3100 * baseMultiplier), // Sugarcane
    
    // Spices
    c11: Math.round(8500 * baseMultiplier), // Turmeric
    c12: Math.round(9200 * baseMultiplier), // Chilli
    c13: Math.round(12000 * baseMultiplier), // Garlic
    c14: Math.round(11500 * baseMultiplier), // Ginger
    
    // Fruits
    c15: Math.round(4500 * baseMultiplier), // Apple
    c16: Math.round(2200 * baseMultiplier), // Banana
    c17: Math.round(3800 * baseMultiplier), // Mango
    c18: Math.round(3200 * baseMultiplier), // Orange
    c19: Math.round(5500 * baseMultiplier), // Grapes
    c20: Math.round(1900 * baseMultiplier), // Papaya
    c21: Math.round(6800 * baseMultiplier), // Pomegranate
  };
};

// Generate prices for all mandis
export const CURRENT_PRICES: { [key: string]: any } = {};

mandiData.forEach((mandi, index) => {
  const mandiId = `m${index + 1}`;
  CURRENT_PRICES[mandiId] = generateRegionalPrices(mandi.state);
});

export const REVIEWS = [
  {
    id: 1,
    user: 'Ramesh Kumar',
    rating: 5,
    comment: 'बहुत अच्छी मंडी है। पारदर्शी नीलामी और समय पर भुगतान मिलता है। (Great mandi with transparent auction and timely payments)'
  },
  {
    id: 2,
    user: 'Suresh Patel',
    rating: 4,
    comment: 'सुविधाएं अच्छी हैं लेकिन भीड़ ज्यादा होती है। (Good facilities but gets crowded during peak season)'
  },
  {
    id: 3,
    user: 'Vijay Singh',
    rating: 5,
    comment: 'Digital payment system बहुत सुविधाजनक है। सभी किसानों को recommend करूंगा। (Digital payments are very convenient, highly recommend to all farmers)'
  }
];

// Helper to get prices for a specific crop across all mandis
export const getPricesForCrop = (cropId: string) => {
  return MANDIS.map(mandi => ({
    mandiId: mandi.id,
    mandiName: mandi.name,
    location: mandi.location,
    price: CURRENT_PRICES[mandi.id]?.[cropId] || 0,
    distance: mandi.distance
  })).filter(item => item.price > 0);
};

// Helper to get top mandis for a crop
export const getTopMandisForCrop = (cropId: string, limit: number = 5) => {
  return getPricesForCrop(cropId)
    .sort((a, b) => b.price - a.price)
    .slice(0, limit);
};
