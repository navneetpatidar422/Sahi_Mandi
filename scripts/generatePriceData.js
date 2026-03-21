const path = require('path');
const XLSX = require('xlsx');

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

const crops = [
  { id: 'c1', name: 'Wheat (गेहूं)', category: 'Grains', basePrice: 2200 },
  { id: 'c2', name: 'Rice Basmati (बासमती चावल)', category: 'Grains', basePrice: 3400 },
  { id: 'c3', name: 'Tomato (टमाटर)', category: 'Vegetables', basePrice: 1800 },
  { id: 'c4', name: 'Onion (प्याज)', category: 'Vegetables', basePrice: 1900 },
  { id: 'c5', name: 'Potato (आलू)', category: 'Vegetables', basePrice: 1600 },
  { id: 'c6', name: 'Cotton (कपास)', category: 'Fibre', basePrice: 6400 },
  { id: 'c7', name: 'Sugarcane (गन्ना)', category: 'Commercial', basePrice: 3200 },
  { id: 'c8', name: 'Maize (मक्का)', category: 'Grains', basePrice: 2100 },
  { id: 'c9', name: 'Soybean (सोयाबीन)', category: 'Pulses', basePrice: 4200 },
  { id: 'c10', name: 'Mustard (सरसों)', category: 'Oilseeds', basePrice: 5200 },
  { id: 'c11', name: 'Turmeric (हल्दी)', category: 'Spices', basePrice: 7800 },
  { id: 'c12', name: 'Chilli (मिर्च)', category: 'Spices', basePrice: 9100 },
  { id: 'c13', name: 'Garlic (लहसुन)', category: 'Spices', basePrice: 8500 },
  { id: 'c14', name: 'Ginger (अदरक)', category: 'Spices', basePrice: 6200 },
  { id: 'c15', name: 'Apple (सेब)', category: 'Fruits', basePrice: 7200 },
  { id: 'c16', name: 'Banana (केला)', category: 'Fruits', basePrice: 3000 },
  { id: 'c17', name: 'Mango (आम)', category: 'Fruits', basePrice: 5600 },
  { id: 'c18', name: 'Orange (संतरा)', category: 'Fruits', basePrice: 5000 },
  { id: 'c19', name: 'Grapes (अंगूर)', category: 'Fruits', basePrice: 6800 },
  { id: 'c20', name: 'Papaya (पपीता)', category: 'Fruits', basePrice: 3700 }
];

const mandis = mandiNames.map((name, idx) => ({
  id: `m${idx + 1}`,
  name,
  location: locations[idx],
  open: '04:00 AM',
  close: '08:00 PM'
}));

function hashToUnit(input) {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return Math.abs(hash >>> 0) / 4294967295;
}

function dailyPrice(mandiId, crop, dayOffset) {
  const noise = (hashToUnit(`${mandiId}-${crop.id}-${dayOffset}`) - 0.5) * 0.08;
  const drift = (hashToUnit(`${mandiId}-${crop.id}-drift`) - 0.5) * 0.12;
  const trend = (dayOffset - 3) * drift * 0.15;
  return Math.max(300, Math.round(crop.basePrice * (1 + noise + trend)));
}

const days = Array.from({ length: 7 }, (_, i) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - (6 - i));
  return d;
});

const priceHistory = [];
for (const mandi of mandis) {
  for (const crop of crops) {
    for (let i = 0; i < days.length; i += 1) {
      const date = days[i];
      priceHistory.push({
        mandiId: mandi.id,
        mandiName: mandi.name,
        location: mandi.location,
        cropId: crop.id,
        cropName: crop.name,
        category: crop.category,
        date: date.toISOString().slice(0, 10),
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        price: dailyPrice(mandi.id, crop, i)
      });
    }
  }
}

const todaySummary = [];
for (const mandi of mandis) {
  for (const crop of crops) {
    const mandiCropRows = priceHistory.filter(
      (r) => r.mandiId === mandi.id && r.cropId === crop.id
    );
    const weekAgoPrice = mandiCropRows[0].price;
    const todayPrice = mandiCropRows[mandiCropRows.length - 1].price;
    const changePct = ((todayPrice - weekAgoPrice) / weekAgoPrice) * 100;
    todaySummary.push({
      mandiId: mandi.id,
      mandiName: mandi.name,
      cropId: crop.id,
      cropName: crop.name,
      todayPrice,
      weekAgoPrice,
      changePct: Number(changePct.toFixed(2))
    });
  }
}

const mandiDirectory = mandis.map((m) => ({
  mandiId: m.id,
  mandiName: m.name,
  location: m.location,
  openTime: m.open,
  closeTime: m.close
}));

const cropCatalogue = crops.map((c) => ({
  cropId: c.id,
  cropName: c.name,
  category: c.category,
  basePrice: c.basePrice
}));

const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(priceHistory), 'PriceHistory');
XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(todaySummary), 'TodaySummary');
XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(mandiDirectory), 'MandiDirectory');
XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(cropCatalogue), 'CropCatalogue');

const outputPath = path.join(__dirname, '..', 'public', 'mandi_price_history.xlsx');
XLSX.writeFile(workbook, outputPath);

console.log(`Generated ${outputPath}`);
console.log(`PriceHistory rows: ${priceHistory.length}`);
