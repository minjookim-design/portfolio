export const ASSETS = {
  photo: '/hovr-admin/driver-photo.png',
  logoH: '/hovr-admin/logo-g120.svg',
  logoO: '/hovr-admin/logo-g116.svg',
  logoVMark: '/hovr-admin/logo-g112.svg',
  logoV: '/hovr-admin/logo-g108.svg',
  logoR: '/hovr-admin/logo-g104.svg',
  logout: '/hovr-admin/logout.svg',
  clock: '/hovr-admin/clock.svg',
  clockBadge: '/hovr-admin/camera.svg',
  check: '/hovr-admin/check.svg',
  warning: '/hovr-admin/warning.svg',
  error: '/hovr-admin/error-x.svg',
  license: '/hovr-admin/license.png',
  teslaFront: '/hovr-admin/tesla-front.png',
  teslaRear: '/hovr-admin/tesla-rear.png',
  ontarioPlate: '/hovr-admin/ontario-plate.png',
  vehiclePermit: '/hovr-admin/vehicle-permit.png',
  insurance: '/hovr-admin/insurance.png',
  inspection: '/hovr-admin/inspection.png',
  background: '/hovr-admin/background.png',
  certificate: '/hovr-admin/certificate.png',
  rideshare: '/hovr-admin/rideshare.png',
} as const

export type DocStatus = 'pending' | 'approved' | 'rejected'
export type MatchStatus = 'match' | 'mismatch' | 'none'
export type FieldTone = 'default' | 'warning' | 'error'

export type ComparisonRow = { label: string; value: string }

export type DetailField = {
  id: string
  label: string
  value: string
  tone?: FieldTone
}

export type PreviewImage = {
  label: string
  src?: string
  /** Cap the longer visual edge for portraits / screenshots. */
  maxWidthPx?: number
}

export type DocumentCard = {
  id: string
  title: string
  previewTitle?: string
  match: MatchStatus
  comparisons: ComparisonRow[]
  detailFields: DetailField[]
  images: PreviewImage[]
  /** Header meta keys cleared when this document is approved. */
  clearsHeaderKeys?: string[]
}

export const CITIES = ['Toronto', 'Vancouver', 'Montreal', 'Calgary'] as const

export const REJECTION_REASONS = [
  'Blurred/Illegible Document',
  'Incomplete Document (Not Fully Visible)',
  'Wrong Document Uploaded',
  'Document Expired',
  'Credentials Conflict with Personal Details or Other Documents',
  'Back of Document Missing',
  'Duplicate Account Detected',
  'Other (Please specify)',
] as const

export const HEADER_FIELDS: { key: string; label: string; value: string; pending: boolean }[] = [
  { key: 'driverName', label: 'Driver Name', value: 'John Doe', pending: true },
  { key: 'dob', label: 'Date of Birth', value: 'DD/MM/YY', pending: true },
  { key: 'phone', label: 'Phone', value: '+11231231234', pending: false },
  { key: 'vehicleType', label: 'Vehicle Type', value: 'HOVR', pending: true },
  { key: 'licensePlate', label: 'License Plate', value: 'AAAA111', pending: true },
  { key: 'appVersion', label: 'App Version', value: '390', pending: false },
  { key: 'vehicleModel', label: 'Vehicle Model', value: 'Tesla Model X', pending: true },
  { key: 'vehicleColor', label: 'Vehicle Color', value: 'Red', pending: true },
  { key: 'vehicleYear', label: 'Vehicle Year', value: '2020', pending: true },
]

export const DOCUMENTS: DocumentCard[] = [
  {
    id: 'profile-photo',
    title: 'Profile Photo',
    previewTitle: 'Profile photo',
    match: 'none',
    comparisons: [],
    detailFields: [],
    images: [{ label: 'Profile photo', src: ASSETS.photo, maxWidthPx: 348 }],
  },
  {
    id: 'license',
    title: 'Driver’s License',
    match: 'mismatch',
    comparisons: [
      { label: 'Extracted Driver’s license number', value: 'D6101-40706-60905' },
      { label: 'Typed Driver’s license number', value: 'A6101-40706-60905' },
    ],
    detailFields: [
      { id: 'firstName', label: 'First Name', value: 'John' },
      { id: 'lastName', label: 'Last Name', value: 'Doe' },
      {
        id: 'address',
        label: 'Address',
        value: '123 Any Street, Toronto, ON, M0M 0M0',
        tone: 'warning',
      },
      { id: 'dob', label: 'Date of birth', value: 'DD/MM/YYYY' },
      { id: 'licenseNumber', label: 'License Number', value: 'D6101-40706-60905', tone: 'error' },
      { id: 'licenseClass', label: 'License class', value: 'G2' },
      { id: 'expiration', label: 'Expiration date', value: 'DD/MM/YYYY' },
    ],
    images: [{ label: 'Driver’s License', src: ASSETS.license }],
    clearsHeaderKeys: ['driverName', 'dob'],
  },
  {
    id: 'vehicle-photos',
    title: 'Vehicle photos and details',
    match: 'match',
    comparisons: [],
    detailFields: [
      { id: 'make', label: 'Make', value: 'Tesla' },
      { id: 'model', label: 'Model', value: 'Model X' },
      { id: 'year', label: 'Year', value: '2020' },
      { id: 'plate', label: 'License Plate', value: 'AAAA111' },
    ],
    images: [
      { label: 'Front', src: ASSETS.teslaFront },
      { label: 'Back', src: ASSETS.teslaRear },
      { label: 'License plate', src: ASSETS.ontarioPlate },
      { label: 'Vehicle permit', src: ASSETS.vehiclePermit },
    ],
    clearsHeaderKeys: ['vehicleType', 'licensePlate', 'vehicleModel', 'vehicleColor', 'vehicleYear'],
  },
  {
    id: 'insurance',
    title: 'Vehicle insurance',
    match: 'match',
    comparisons: [],
    detailFields: [
      { id: 'provider', label: 'Insurance provider', value: 'Stat Farm' },
      { id: 'policy', label: 'Policy number', value: '1234-5678-9101' },
      { id: 'effective', label: 'Effective date', value: 'DD/MM/YYYY' },
      { id: 'expiration', label: 'Expiration date', value: 'DD/MM/YYYY' },
    ],
    images: [{ label: 'Insurance information', src: ASSETS.insurance }],
  },
  {
    id: 'inspection',
    title: 'Vehicle inspection',
    match: 'mismatch',
    comparisons: [
      { label: 'Extracted Insurance provider', value: 'State Farm' },
      { label: 'Typed Insurance provider', value: 'UIMS' },
      { label: 'Extracted Policy provider', value: '1234-5678-9101' },
      { label: 'Typed Policy provider', value: '1111-5678-9101' },
    ],
    detailFields: [
      { id: 'provider', label: 'Insurance provider', value: 'Stat Farm*', tone: 'error' },
      { id: 'policy', label: 'Policy number', value: '1234-5678-9101*', tone: 'error' },
      { id: 'effective', label: 'Effective date', value: 'DD/MM/YYYY' },
      { id: 'expiration', label: 'Expiration date', value: 'DD/MM/YYYY' },
    ],
    images: [{ label: 'Vehicle inspection', src: ASSETS.inspection }],
  },
  {
    id: 'background',
    title: 'Criminal Background Check',
    match: 'none',
    comparisons: [],
    detailFields: [],
    images: [{ label: 'Criminal Background Check', src: ASSETS.background }],
  },
  {
    id: 'certificate',
    title: 'Vehicle-for-Hire Certificate',
    match: 'mismatch',
    comparisons: [
      { label: 'Extracted Training provider', value: 'Parachute' },
      { label: 'Typed Training provider', value: 'Samaa' },
    ],
    detailFields: [
      { id: 'provider', label: 'Training provider', value: 'Stat Farm*', tone: 'error' },
      { id: 'awarded', label: 'Awarded', value: 'DD/MM/YYYY' },
    ],
    images: [{ label: 'Vehicle-for-Hire Certificate', src: ASSETS.certificate }],
  },
  {
    id: 'rideshare',
    title: 'Previous rideshare experience',
    match: 'mismatch',
    comparisons: [
      { label: 'Extracted total rides number', value: '22,000' },
      { label: 'Typed total rides number', value: '12,000' },
    ],
    detailFields: [
      { id: 'drivingFor', label: 'Driving for', value: '2 years*', tone: 'error' },
      { id: 'rides', label: 'Total rides', value: '6,200' },
      { id: 'rating', label: 'Rating', value: '4.88' },
    ],
    images: [{ label: 'Previous rideshare screenshot', src: ASSETS.rideshare, maxWidthPx: 280 }],
  },
  {
    id: 'ptc',
    title: 'Private Transportation Company (PTC) number',
    match: 'none',
    comparisons: [],
    detailFields: [{ id: 'ptc', label: 'PTC number', value: 'D29-1234567' }],
    images: [],
  },
  {
    id: 'membership',
    title: 'HOVR Membership Purchase Receipt',
    match: 'none',
    comparisons: [],
    detailFields: [
      { id: 'receipt', label: 'Receipt number', value: '1234456' },
      { id: 'invoice', label: 'Invoice number', value: '1223345' },
    ],
    images: [],
  },
]
