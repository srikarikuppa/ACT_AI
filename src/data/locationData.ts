export interface RuralStateData {
  state: string;
  districts: {
    name: string;
    villages: string[];
  }[];
}

export const RURAL_LOCATION_DATA: RuralStateData[] = [
  {
    state: 'Uttar Pradesh',
    districts: [
      { name: 'Varanasi', villages: ['Shivpur Gram Panchayat', 'Pindra Village', 'Rameshwar Panchayat', 'Cholaapur', 'Arajiline'] },
      { name: 'Gorakhpur', villages: ['Bansgaon Panchayat', 'Campierganj Village', 'Sahjanwa Rural', 'Khorabar', 'Pipraich'] },
      { name: 'Prayagraj', villages: ['Koraon Panchayat', 'Meja Village', 'Phulpur Gram', 'Karchhana', 'Soraon'] },
    ],
  },
  {
    state: 'Bihar',
    districts: [
      { name: 'Gaya', villages: ['Bodh Gaya Panchayat', 'Manpur Village', 'Tekari Rural', 'Wazirganj', 'Belaganj'] },
      { name: 'Muzaffarpur', villages: ['Kanti Gram Panchayat', 'Motipur Village', 'Bochahan', 'Sakra', 'Paroo'] },
      { name: 'Patna', villages: ['Bihta Panchayat', 'Danapur Rural', 'Phulwari Sharif', 'Fatuha', 'Paliganj'] },
    ],
  },
  {
    state: 'Telangana',
    districts: [
      { name: 'Medak', villages: ['Sangareddy Gram Panchayat', 'Zaheerabad Rural', 'Narsapur Panchayat', 'Medak Village', 'Ramayampet'] },
      { name: 'Nalgonda', villages: ['Miryalaguda Panchayat', 'Devarakonda Village', 'Nagarjuna Sagar', 'Huzurnagar', 'Suryapet Rural'] },
      { name: 'Mahabubnagar', villages: ['Jadcherla Panchayat', 'Nagarkurnool Village', 'Kalwakurthy', 'Wanaparthy Rural', 'Shadnagar'] },
    ],
  },
  {
    state: 'Andhra Pradesh',
    districts: [
      { name: 'Guntur', villages: ['Tenali Panchayat', 'Narasaraopet Rural', 'Mangalagiri Gram', 'Bapatla Village', 'Sattenapalle'] },
      { name: 'Chittoor', villages: ['Madanapalle Panchayat', 'Punganoor Village', 'Pileru Rural', 'Srikalahasti Panchayat', 'Nagari'] },
    ],
  },
  {
    state: 'Tamil Nadu',
    districts: [
      { name: 'Madurai', villages: ['Vadipatti Panchayat', 'Melur Gram', 'Usilampatti Village', 'Thirumangalam', 'T.Kallupatti'] },
      { name: 'Thanjavur', villages: ['Kumbakonam Rural', 'Papanasam Panchayat', 'Orathanadu Village', 'Pattukkottai', 'Thiruvaiyaru'] },
    ],
  },
  {
    state: 'Maharashtra',
    districts: [
      { name: 'Pune', villages: ['Khed Gram Panchayat', 'Shirur Rural', 'Junar Village', 'Baramati Panchayat', 'Bhor'] },
      { name: 'Nashik', villages: ['Niphad Panchayat', 'Sinnar Rural', 'Dindori Village', 'Yeola Gram', 'Kalwan'] },
    ],
  },
  {
    state: 'West Bengal',
    districts: [
      { name: 'Nadia', villages: ['Ranaghat Panchayat', 'Krishnanagar Rural', 'Chakdaha Gram', 'Santipur Village', 'Kalyani Rural'] },
      { name: 'Bankura', villages: ['Bishnupur Panchayat', 'Khatra Village', 'Taldangra Gram', 'Barjora', 'Sonamukhi'] },
    ],
  },
];

export interface EmergencyHelpline {
  id: string;
  name: string;
  number: string;
  description: string;
  badgeColor: string;
  icon: string;
}

export const EMERGENCY_HELPLINES: EmergencyHelpline[] = [
  {
    id: '112',
    name: 'National Emergency SOS',
    number: '112',
    description: 'Police, Ambulance & Fire Services (Unified Single Toll-Free Emergency Number)',
    badgeColor: 'bg-red-500 text-white',
    icon: 'ShieldAlert',
  },
  {
    id: '100',
    name: 'State Police Direct',
    number: '100',
    description: 'Direct local Police Station control room for violent crime or immediate danger.',
    badgeColor: 'bg-amber-500 text-black',
    icon: 'PhoneCall',
  },
  {
    id: '1091',
    name: 'Women Helpline (Mahila Suraksha)',
    number: '1091',
    description: 'Dedicated 24x7 emergency helpline for female citizens facing harassment or domestic threat.',
    badgeColor: 'bg-emerald-500 text-white',
    icon: 'HeartHandshake',
  },
  {
    id: '181',
    name: 'Women in Distress Helpline',
    number: '181',
    description: 'Support, counseling, and swift legal assistance for women in rural areas.',
    badgeColor: 'bg-purple-500 text-white',
    icon: 'UserCheck',
  },
  {
    id: '1098',
    name: 'Childline (Child Protection)',
    number: '1098',
    description: 'Free emergency protection and rescue service for children in need of care.',
    badgeColor: 'bg-sky-500 text-white',
    icon: 'Baby',
  },
  {
    id: 'panchayat',
    name: 'Gram Panchayat Safety Desk',
    number: '1800-111-222',
    description: 'Local village council and Sarpanch emergency desk for land, crop, and communal disputes.',
    badgeColor: 'bg-green-600 text-white',
    icon: 'Building2',
  },
];
