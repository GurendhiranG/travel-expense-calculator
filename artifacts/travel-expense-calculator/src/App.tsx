import { useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Bike,
  Bus,
  CarFront,
  Check,
  ChevronDown,
  CircleHelp,
  Info,
  Landmark,
  MapPin,
  Menu,
  Navigation,
  Plane,
  RotateCcw,
  Route as RouteIcon,
  Search,
  ShieldCheck,
  Sparkles,
  TrainFront,
  TrendingDown,
  X,
} from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

type TripInputs = {
  origin: string;
  destination: string;
  passengers: number;
  fuelPrice: number;
  mileage: number;
  tolls: number;
  parking: number;
  other: number;
  accommodation: number;
  meals: number;
  localTransport: number;
  insurance: number;
  miscellaneous: number;
};

type RouteResult = {
  distance: number;
  duration: string;
  origin: string;
  destination: string;
  originPoint: GeoPoint;
  destinationPoint: GeoPoint;
  geometry: GeoPoint[];
  source: 'built-in' | 'OpenStreetMap' | 'estimate';
};

type Mode = 'car' | 'bus' | 'train' | 'flight' | 'taxi' | 'bike';

type TransportOption = {
  mode: Mode;
  totalCost: number;
  perPersonCost: number;
  duration: string;
  breakdown: string;
  note: string;
};

type ComparisonRecommendation = {
  cheapest: TransportOption;
  fastest: TransportOption;
};

type City = { name: string; lat: number; lon: number };
type GeocodeResult = { lat: string; lon: string; display_name: string };
type GeoPoint = { lat: number; lon: number };

const queryClient = new QueryClient();

const cities: City[] = [
  { name: 'Mumbai', lat: 19.076, lon: 72.8777 },
  { name: 'Pune', lat: 18.5204, lon: 73.8567 },
  { name: 'Delhi', lat: 28.6139, lon: 77.209 },
  { name: 'Jaipur', lat: 26.9124, lon: 75.7873 },
  { name: 'Bengaluru', lat: 12.9716, lon: 77.5946 },
  { name: 'Hyderabad', lat: 17.385, lon: 78.4867 },
  { name: 'Chennai', lat: 13.0827, lon: 80.2707 },
  { name: 'Ahmedabad', lat: 23.0225, lon: 72.5714 },
  { name: 'Kolkata', lat: 22.5726, lon: 88.3639 },
  { name: 'Goa', lat: 15.2993, lon: 74.124 },
];

const initialInputs: TripInputs = {
  origin: 'Mumbai',
  destination: 'Pune',
  passengers: 2,
  fuelPrice: 104,
  mileage: 16,
  tolls: 285,
  parking: 120,
  other: 0,
  accommodation: 0,
  meals: 0,
  localTransport: 0,
  insurance: 0,
  miscellaneous: 0,
};

const modeMeta: Record<Mode, { label: string; icon: typeof CarFront; tint: string; description: string }> = {
  car: { label: 'Car', icon: CarFront, tint: '#ef9f5b', description: 'Your own wheels' },
  bus: { label: 'Bus', icon: Bus, tint: '#5aa995', description: 'Value on the road' },
  train: { label: 'Train', icon: TrainFront, tint: '#547eac', description: 'Comfortable rail' },
  flight: { label: 'Flight', icon: Plane, tint: '#9b7ec1', description: 'Fastest arrival' },
  taxi: { label: 'Taxi', icon: Navigation, tint: '#d47a72', description: 'Door to door' },
  bike: { label: 'Bike', icon: Bike, tint: '#d9a93d', description: 'Light and nimble' },
};

function cityPoint(value: string): City {
  const found = cities.find((city) => city.name.toLowerCase() === value.trim().toLowerCase());
  return found ?? { name: value.trim() || 'Origin', lat: 20.5937, lon: 78.9629 };
}

function formatDuration(totalMinutes: number) {
  const minutes = Math.max(1, Math.round(totalMinutes));
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return `${hours ? `${hours} hr ` : ''}${remaining} min`;
}

function estimateRoute(start: City, end: City, source: RouteResult['source'] = 'built-in'): RouteResult {
  const latDistance = (end.lat - start.lat) * 111;
  const lonDistance = (end.lon - start.lon) * 102 * Math.cos(((start.lat + end.lat) / 2) * Math.PI / 180);
  const distance = Math.max(8, Math.round(Math.sqrt(latDistance ** 2 + lonDistance ** 2) * 1.18));
  return {
    distance,
    duration: formatDuration((distance / 52) * 60),
    origin: start.name,
    destination: end.name,
    originPoint: { lat: start.lat, lon: start.lon },
    destinationPoint: { lat: end.lat, lon: end.lon },
    geometry: [{ lat: start.lat, lon: start.lon }, { lat: end.lat, lon: end.lon }],
    source,
  };
}

async function geocodeLocation(value: string): Promise<City | null> {
  const known = cities.find((city) => city.name.toLowerCase() === value.trim().toLowerCase());
  if (known) return known;

  const params = new URLSearchParams({
    q: `${value.trim()}, India`,
    format: 'jsonv2',
    limit: '1',
    countrycodes: 'in',
  });
  const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) return null;
  const results = (await response.json()) as GeocodeResult[];
  const result = results[0];
  if (!result) return null;

  return {
    name: value.trim(),
    lat: Number(result.lat),
    lon: Number(result.lon),
  };
}

function makeRoute(inputs: TripInputs): RouteResult {
  const start = cityPoint(inputs.origin);
  const end = cityPoint(inputs.destination);
  return estimateRoute(start, end);
}

async function makeLiveRoute(inputs: TripInputs): Promise<RouteResult> {
  const [start, end] = await Promise.all([
    geocodeLocation(inputs.origin),
    geocodeLocation(inputs.destination),
  ]);
  if (!start || !end) throw new Error('location-not-found');

  try {
    const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${start.lon},${start.lat};${end.lon},${end.lat}?overview=full&geometries=geojson`);
    if (!response.ok) throw new Error('routing-unavailable');
    const data = await response.json() as {
      routes?: Array<{ distance: number; duration: number; geometry?: { coordinates: [number, number][] } }>;
    };
    const roadRoute = data.routes?.[0];
    if (!roadRoute) throw new Error('routing-unavailable');
    return {
      distance: Math.max(1, Math.round(roadRoute.distance / 1000)),
      duration: formatDuration(roadRoute.duration / 60),
      origin: start.name,
      destination: end.name,
      originPoint: { lat: start.lat, lon: start.lon },
      destinationPoint: { lat: end.lat, lon: end.lon },
      geometry: roadRoute.geometry?.coordinates.map(([lon, lat]) => ({ lat, lon })) ?? [
        { lat: start.lat, lon: start.lon },
        { lat: end.lat, lon: end.lon },
      ],
      source: 'OpenStreetMap',
    };
  } catch {
    return estimateRoute(start, end, 'estimate');
  }
}

function makeOptions(inputs: TripInputs, route: RouteResult): TransportOption[] {
  const carFuel = (route.distance / Math.max(inputs.mileage, 1)) * inputs.fuelPrice;
  const sharedExpenses = inputs.tolls + inputs.parking + inputs.other + inputs.accommodation + inputs.meals + inputs.localTransport + inputs.insurance + inputs.miscellaneous;
  const carTotal = Math.round(carFuel + sharedExpenses);
  const busFare = Math.round(180 + route.distance * 0.72);
  const trainFare = Math.round(240 + route.distance * 0.56);
  const flightFare = Math.round(2200 + route.distance * 2.45);
  const taxiBase = Math.round(450 + route.distance * 13.2);
  const bikeTotal = Math.round((route.distance / 38) * inputs.fuelPrice + inputs.tolls * 0.35 + inputs.parking * 0.5 + inputs.other + inputs.accommodation + inputs.meals + inputs.localTransport + inputs.insurance + inputs.miscellaneous);
  const taxiTotal = taxiBase + sharedExpenses;
  const count = Math.max(inputs.passengers, 1);
  return [
    { mode: 'car', totalCost: carTotal, perPersonCost: Math.round(carTotal / count), duration: route.duration, breakdown: `Fuel ₹${Math.round(carFuel)} · trip expenses ${money(sharedExpenses)}`, note: 'Best for flexibility' },
    { mode: 'bus', totalCost: busFare * count + sharedExpenses, perPersonCost: Math.round((busFare * count + sharedExpenses) / count), duration: `${Math.max(1, Math.round(route.distance / 45 + 1))} hr ${route.distance > 150 ? 20 : 10} min`, breakdown: `Fare ${money(busFare)} × ${count} · trip expenses ${money(sharedExpenses)}`, note: 'Lowest shared cost' },
    { mode: 'train', totalCost: trainFare * count + sharedExpenses, perPersonCost: Math.round((trainFare * count + sharedExpenses) / count), duration: `${Math.max(1, Math.round(route.distance / 58 + 0.8))} hr 05 min`, breakdown: `Fare ${money(trainFare)} × ${count} · trip expenses ${money(sharedExpenses)}`, note: 'Easy, steady ride' },
    { mode: 'flight', totalCost: flightFare * count + sharedExpenses, perPersonCost: Math.round((flightFare * count + sharedExpenses) / count), duration: `${Math.max(1, Math.round(route.distance / 650))} hr 15 min`, breakdown: `Fare ${money(flightFare)} × ${count} · trip expenses ${money(sharedExpenses)}`, note: 'Save time, spend more' },
    { mode: 'taxi', totalCost: taxiTotal, perPersonCost: Math.round(taxiTotal / count), duration: `${Math.max(1, Math.round(route.distance / 48))} hr ${route.distance % 60} min`, breakdown: `Ride ${money(taxiBase)} · trip expenses ${money(sharedExpenses)}`, note: 'Door-to-door ease' },
    { mode: 'bike', totalCost: bikeTotal, perPersonCost: Math.round(bikeTotal / count), duration: `${Math.max(1, Math.round(route.distance / 48))} hr ${route.distance % 45} min`, breakdown: `Fuel ₹${Math.round((route.distance / 38) * inputs.fuelPrice)} · trip expenses ${money(inputs.accommodation + inputs.meals + inputs.localTransport + inputs.insurance + inputs.miscellaneous)}`, note: 'For solo explorers' },
  ];
}

function money(value: number) {
  return `₹${value.toLocaleString('en-IN')}`;
}

function durationMinutes(value: string) {
  const match = value.match(/(?:(\d+)\s*hr)?\s*(\d+)\s*min/);
  return match ? Number(match[1] ?? 0) * 60 + Number(match[2]) : 9999;
}

function IconBadge({ mode, size = 20 }: { mode: Mode; size?: number }) {
  const Icon = modeMeta[mode].icon;
  return <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl" style={{ backgroundColor: `${modeMeta[mode].tint}24`, color: modeMeta[mode].tint }}><Icon size={size} strokeWidth={2.2} /></span>;
}

function InputField({
  id,
  label,
  value,
  onChange,
  prefix,
  suffix,
  type = 'number',
}: {
  id: string;
  label: string;
  value: number | string;
  onChange: (value: string) => void;
  prefix?: string;
  suffix?: string;
  type?: string;
}) {
  return (
    <label className="block" htmlFor={id}>
      <span className="mb-2 block text-[11px] font-bold uppercase tracking-[.14em] text-[#80999a]">{label}</span>
      <span className="flex h-12 items-center rounded-xl border border-[#d9e4df] bg-[#fbfcf8] px-3 transition-colors focus-within:border-[#5aa995] focus-within:ring-2 focus-within:ring-[#5aa995]/15">
        {prefix && <span className="mr-1 text-sm text-[#6e8987]">{prefix}</span>}
        <input id={id} data-testid={`input-${id}`} type={type} min={type === 'number' ? 0 : undefined} value={value} onChange={(event) => onChange(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#17383d] outline-none" />
        {suffix && <span className="ml-1 text-xs font-medium text-[#80999a]">{suffix}</span>}
      </span>
    </label>
  );
}

function TripForm({ inputs, setInputs, onCalculate, onReset, isCalculating }: { inputs: TripInputs; setInputs: (value: TripInputs) => void; onCalculate: (nextInputs?: TripInputs) => void | Promise<void>; onReset: () => void; isCalculating: boolean }) {
  const [error, setError] = useState('');
  const update = (key: keyof TripInputs, value: string) => setInputs({ ...inputs, [key]: key === 'origin' || key === 'destination' ? value : Math.max(0, Number(value) || 0) });
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!inputs.origin.trim() || !inputs.destination.trim()) {
      setError('Add both an origin and a destination to map your trip.');
      return;
    }
    if (inputs.origin.trim().toLowerCase() === inputs.destination.trim().toLowerCase()) {
      setError('Choose two different places for your trip.');
      return;
    }
    if (inputs.passengers < 1 || inputs.mileage < 1) {
      setError('Passengers and mileage need to be at least 1.');
      return;
    }
    setError('');
    onCalculate();
  };
  return (
    <form onSubmit={submit} className="space-y-7" noValidate>
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#ef9f5b]">01 / Your route</p>
            <p className="mt-1 text-sm text-[#9ab1ae]">Where are you headed?</p>
          </div>
          <button type="button" data-testid="button-sample-route" onClick={() => { setInputs({ ...initialInputs }); setError(''); onCalculate(initialInputs); }} className="flex items-center gap-1.5 text-xs font-bold text-[#f5b878] transition-colors hover:text-[#ffcf9c]"><Sparkles size={13} /> Use sample</button>
        </div>
        <div className="relative space-y-3">
          <div className="pointer-events-none absolute left-[17px] top-12 h-8 border-l border-dashed border-[#64817f]" />
          <label className="relative flex items-center gap-3 rounded-xl border border-[#436665] bg-[#1d4549] px-3 py-1.5 focus-within:border-[#5aa995]" htmlFor="origin">
            <MapPin className="text-[#ef9f5b]" size={17} />
            <span className="flex-1"><span className="block text-[10px] font-bold uppercase tracking-[.14em] text-[#85a6a1]">From</span><input id="origin" data-testid="input-origin" value={inputs.origin} onChange={(e) => update('origin', e.target.value)} list="city-list" className="w-full bg-transparent text-sm font-semibold text-[#f7f4ec] outline-none placeholder:text-[#75908d]" placeholder="e.g. Mumbai" /></span>
          </label>
          <label className="relative flex items-center gap-3 rounded-xl border border-[#436665] bg-[#1d4549] px-3 py-1.5 focus-within:border-[#5aa995]" htmlFor="destination">
            <MapPin className="text-[#5aa995]" size={17} />
            <span className="flex-1"><span className="block text-[10px] font-bold uppercase tracking-[.14em] text-[#85a6a1]">To</span><input id="destination" data-testid="input-destination" value={inputs.destination} onChange={(e) => update('destination', e.target.value)} list="city-list" className="w-full bg-transparent text-sm font-semibold text-[#f7f4ec] outline-none placeholder:text-[#75908d]" placeholder="e.g. Pune" /></span>
          </label>
          <datalist id="city-list">{cities.map((city) => <option value={city.name} key={city.name} />)}</datalist>
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center gap-2"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#ef9f5b]">02 / Trip details</p><span className="h-px flex-1 bg-[#385e60]" /></div>
        <InputField id="passengers" label="Travellers" value={inputs.passengers} onChange={(value) => update('passengers', value)} suffix={inputs.passengers === 1 ? 'person' : 'people'} />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#ef9f5b]">03 / Car costs</p><Info size={14} className="text-[#75908d]" /></div>
        <div className="grid grid-cols-2 gap-3">
          <InputField id="fuel-price" label="Fuel price" value={inputs.fuelPrice} onChange={(value) => update('fuelPrice', value)} prefix="₹" suffix="/ litre" />
          <InputField id="mileage" label="Mileage" value={inputs.mileage} onChange={(value) => update('mileage', value)} suffix="km/l" />
          <InputField id="tolls" label="Tolls" value={inputs.tolls} onChange={(value) => update('tolls', value)} prefix="₹" />
          <InputField id="parking" label="Parking" value={inputs.parking} onChange={(value) => update('parking', value)} prefix="₹" />
        </div>
        <div className="mt-3"><InputField id="other" label="Other costs" value={inputs.other} onChange={(value) => update('other', value)} prefix="₹" suffix="optional" /></div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#ef9f5b]">04 / Travel expenses</p><p className="mt-1 text-xs text-[#9ab1ae]">Add total amounts for the whole trip</p></div><Info size={14} className="text-[#75908d]" /></div>
        <div className="grid grid-cols-2 gap-3">
          <InputField id="accommodation" label="Accommodation" value={inputs.accommodation} onChange={(value) => update('accommodation', value)} prefix="₹" />
          <InputField id="meals" label="Meals" value={inputs.meals} onChange={(value) => update('meals', value)} prefix="₹" />
          <InputField id="local-transport" label="Local transport" value={inputs.localTransport} onChange={(value) => update('localTransport', value)} prefix="₹" />
          <InputField id="insurance" label="Travel insurance" value={inputs.insurance} onChange={(value) => update('insurance', value)} prefix="₹" />
        </div>
        <div className="mt-3"><InputField id="miscellaneous" label="Miscellaneous" value={inputs.miscellaneous} onChange={(value) => update('miscellaneous', value)} prefix="₹" suffix="optional" /></div>
      </div>

      {error && <p data-testid="status-validation" className="flex items-start gap-2 rounded-xl border border-[#e08b7d]/40 bg-[#e08b7d]/10 px-3 py-2.5 text-xs font-semibold leading-relaxed text-[#ffc0b5]"><CircleHelp size={15} className="mt-0.5 shrink-0" />{error}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={isCalculating} data-testid="button-calculate" className="group flex h-13 flex-1 items-center justify-center gap-2 rounded-xl bg-[#ef9f5b] px-5 text-sm font-extrabold text-[#17383d] shadow-[0_8px_20px_rgba(239,159,91,.16)] transition-all hover:-translate-y-0.5 hover:bg-[#f5b878] active:translate-y-0 disabled:cursor-wait disabled:opacity-70">{isCalculating ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#17383d]/30 border-t-[#17383d]" /> : <Search size={17} />} {isCalculating ? 'Finding your route' : 'Calculate my trip'} {!isCalculating && <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />}</button>
        <button type="button" data-testid="button-reset" onClick={() => { onReset(); setError(''); }} title="Reset route" className="grid h-13 w-13 shrink-0 place-items-center rounded-xl border border-[#436665] text-[#b7cdca] transition-colors hover:border-[#87b8aa] hover:bg-[#1d4549]"><RotateCcw size={17} /></button>
      </div>
    </form>
  );
}

function routeMapBounds(route: RouteResult) {
  const points = route.geometry.length ? route.geometry : [route.originPoint, route.destinationPoint];
  const lats = points.map((point) => point.lat);
  const lons = points.map((point) => point.lon);
  const latPadding = Math.max((Math.max(...lats) - Math.min(...lats)) * 0.22, 0.45);
  const lonPadding = Math.max((Math.max(...lons) - Math.min(...lons)) * 0.22, 0.45);
  const minLat = Math.min(...lats) - latPadding;
  const maxLat = Math.max(...lats) + latPadding;
  const minLon = Math.min(...lons) - lonPadding;
  const maxLon = Math.max(...lons) + lonPadding;
  return { minLat, maxLat, minLon, maxLon, bbox: `${minLon},${minLat},${maxLon},${maxLat}` };
}

function mapPoint(point: GeoPoint, bounds: ReturnType<typeof routeMapBounds>) {
  return {
    x: ((point.lon - bounds.minLon) / (bounds.maxLon - bounds.minLon)) * 100,
    y: (1 - (point.lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * 100,
  };
}

function tileProjection(point: GeoPoint, zoom: number) {
  const scale = 256 * 2 ** zoom;
  const sin = Math.sin((point.lat * Math.PI) / 180);
  return {
    x: ((point.lon + 180) / 360) * scale,
    y: (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * scale,
  };
}

function RouteMap({ route }: { route: RouteResult }) {
  const bounds = routeMapBounds(route);
  const routePoints = route.geometry.map((point) => {
    const mapped = mapPoint(point, bounds);
    return `${mapped.x},${mapped.y}`;
  }).join(' ');
  const origin = mapPoint(route.originPoint, bounds);
  const destination = mapPoint(route.destinationPoint, bounds);
  const center = {
    lat: (bounds.minLat + bounds.maxLat) / 2,
    lon: (bounds.minLon + bounds.maxLon) / 2,
  };
  const targetWidth = 720;
  const targetHeight = 260;
  let zoom = 3;
  for (let nextZoom = 3; nextZoom <= 11; nextZoom += 1) {
    const low = tileProjection({ lat: bounds.minLat, lon: bounds.minLon }, nextZoom);
    const high = tileProjection({ lat: bounds.maxLat, lon: bounds.maxLon }, nextZoom);
    if (Math.abs(high.x - low.x) * 1.35 <= targetWidth && Math.abs(high.y - low.y) * 1.35 <= targetHeight) {
      zoom = nextZoom;
    } else {
      break;
    }
  }
  const centerPixel = tileProjection(center, zoom);
  const tileX = Math.floor(centerPixel.x / 256);
  const tileY = Math.floor(centerPixel.y / 256);
  const tileCount = 5;
  const tileStartX = tileX - Math.floor(tileCount / 2);
  const tileStartY = tileY - Math.floor(tileCount / 2);
  const tiles = Array.from({ length: tileCount * tileCount }, (_, index) => {
    const column = index % tileCount;
    const row = Math.floor(index / tileCount);
    const x = tileStartX + column;
    const y = tileStartY + row;
    const wrappedX = ((x % 2 ** zoom) + 2 ** zoom) % 2 ** zoom;
    return {
      key: `${zoom}-${x}-${y}`,
      src: `https://tile.openstreetmap.org/${zoom}/${wrappedX}/${Math.max(0, Math.min(2 ** zoom - 1, y))}.png`,
      left: column * 256,
      top: row * 256,
    };
  });
  return (
    <div data-testid="panel-route-map" className="relative min-h-[248px] overflow-hidden rounded-2xl border border-[#bfded5] bg-[#dbece6]">
      <div className="absolute inset-0 overflow-hidden bg-[#dbece6]">
        <div className="absolute left-1/2 top-1/2" style={{ width: tileCount * 256, height: tileCount * 256, transform: `translate(-${centerPixel.x - tileStartX * 256}px, -${centerPixel.y - tileStartY * 256}px)` }}>
          {tiles.map((tile) => <img key={tile.key} src={tile.src} alt="" aria-hidden="true" className="absolute max-w-none" style={{ left: tile.left, top: tile.top, width: 256, height: 256 }} />)}
        </div>
        <div className="absolute inset-0 bg-[#dcefe9]/25" />
      </div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full">
        <polyline points={routePoints} fill="none" stroke="#f7f4ec" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" opacity=".9" />
        <polyline points={routePoints} fill="none" stroke="#ef9f5b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="pointer-events-none absolute" style={{ left: `${origin.x}%`, top: `${origin.y}%`, transform: 'translate(-50%, -50%)' }}>
        <span className="grid h-9 w-9 place-items-center rounded-full border-4 border-[#f7f4ec] bg-[#17383d] text-[#f5b878] shadow-lg"><MapPin size={16} fill="currentColor" /></span>
        <span className="absolute left-1/2 top-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#f7f4ec]/95 px-2 py-1 text-[10px] font-extrabold text-[#17383d] shadow-sm">{route.origin}</span>
      </div>
      <div className="pointer-events-none absolute" style={{ left: `${destination.x}%`, top: `${destination.y}%`, transform: 'translate(-50%, -50%)' }}>
        <span className="grid h-9 w-9 place-items-center rounded-full border-4 border-[#f7f4ec] bg-[#ef9f5b] text-[#17383d] shadow-lg"><MapPin size={16} fill="currentColor" /></span>
        <span className="absolute left-1/2 top-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#f7f4ec]/95 px-2 py-1 text-[10px] font-extrabold text-[#17383d] shadow-sm">{route.destination}</span>
      </div>
      <div className="absolute left-4 top-4 flex items-center gap-2 rounded-lg bg-[#f7f4ec]/80 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#406c69] backdrop-blur-sm"><RouteIcon size={12} /> Estimated route</div>
      <div className="absolute bottom-4 left-4 rounded-lg bg-[#17383d] px-3 py-2 text-[#f7f4ec] shadow-lg"><p className="font-mono text-lg font-medium">{route.distance} <span className="text-xs text-[#9ab1ae]">km</span></p><p className="text-[10px] font-semibold text-[#9ab1ae]">road distance</p></div>
      <div className="absolute bottom-4 right-4 rounded-lg bg-[#f7f4ec]/90 px-3 py-2 text-right shadow-lg"><p className="font-mono text-sm font-medium text-[#17383d]">{route.duration}</p><p className="text-[10px] font-semibold text-[#66817f]">by road</p></div>
      <a href={`https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${route.originPoint.lat}%2C${route.originPoint.lon}%3B${route.destinationPoint.lat}%2C${route.destinationPoint.lon}`} target="_blank" rel="noreferrer" className="absolute right-4 top-4 rounded-lg bg-[#f7f4ec]/90 px-2.5 py-1.5 text-[10px] font-bold text-[#406c69] shadow-sm transition-colors hover:bg-[#f7f4ec]">Open full map</a>
      <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-semibold text-[#406c69]/75">© OpenStreetMap contributors</a>
    </div>
  );
}

function ModeCard({ option, selected, onSelect }: { option: TransportOption; selected: boolean; onSelect: () => void }) {
  const meta = modeMeta[option.mode];
  return (
    <button type="button" data-testid={`card-mode-${option.mode}`} onClick={onSelect} className={`relative flex min-w-[150px] flex-1 flex-col rounded-2xl border p-4 text-left transition-all duration-200 ${selected ? 'border-[#17383d] bg-[#17383d] text-[#f7f4ec] shadow-[0_12px_22px_rgba(23,56,61,.15)] md:-translate-y-1' : 'border-[#d9e4df] bg-[#fbfcf8] text-[#17383d] hover:-translate-y-0.5 hover:border-[#9fcabd]'}`}>
      {selected && <span className="absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full bg-[#ef9f5b] text-[#17383d]"><Check size={12} strokeWidth={3} /></span>}
      <IconBadge mode={option.mode} size={19} />
      <span className="mt-3 text-sm font-extrabold">{meta.label}</span>
      <span className={`mt-0.5 text-[11px] ${selected ? 'text-[#9ab1ae]' : 'text-[#7b9693]'}`}>{meta.description}</span>
      <span className={`mt-4 font-mono text-lg font-medium ${selected ? 'text-[#f5b878]' : 'text-[#17383d]'}`}>{money(option.perPersonCost)}<small className={`font-sans text-[10px] ${selected ? 'text-[#9ab1ae]' : 'text-[#7b9693]'}`}> / person</small></span>
    </button>
  );
}

function Breakdown({ inputs, route, selectedOption }: { inputs: TripInputs; route: RouteResult; selectedOption: TransportOption }) {
  const fuel = Math.round((route.distance / Math.max(inputs.mileage, 1)) * inputs.fuelPrice);
  const travelExpenses = [
    ['Accommodation', inputs.accommodation, 'Stay costs'],
    ['Meals', inputs.meals, 'Food and refreshments'],
    ['Local transport', inputs.localTransport, 'Transfers and getting around'],
    ['Travel insurance', inputs.insurance, 'Trip protection'],
    ['Miscellaneous', inputs.miscellaneous, 'Other planned expenses'],
  ] as const;
  const professionalExpenses = inputs.accommodation + inputs.meals + inputs.localTransport + inputs.insurance + inputs.miscellaneous;
  const rows = selectedOption.mode === 'car'
    ? [['Fuel', money(fuel), `${(route.distance / Math.max(inputs.mileage, 1)).toFixed(1)} litres × ${money(inputs.fuelPrice)}`], ['Tolls', money(inputs.tolls), 'Highway charges'], ['Parking', money(inputs.parking), 'At destination'], ['Other', money(inputs.other), 'Added costs'], ...travelExpenses.map(([label, value, detail]) => [label, money(value), detail])]
    : [['Transport & road costs', money(selectedOption.totalCost - professionalExpenses), selectedOption.breakdown], ...travelExpenses.map(([label, value, detail]) => [label, money(value), detail]), ['Passengers', `${inputs.passengers}`, inputs.passengers === 1 ? 'traveller' : 'travellers'], ['Estimated duration', selectedOption.duration, 'door-to-door may vary']];
  return (
    <div data-testid="panel-expense-breakdown" className="rounded-2xl border border-[#d9e4df] bg-[#fbfcf8] p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#5aa995]">Expense breakdown</p><h3 className="mt-1 text-lg font-extrabold text-[#17383d]">{modeMeta[selectedOption.mode].label} trip</h3></div><span className="rounded-full bg-[#e5f2ed] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#3e8273]">Estimate</span></div>
      <div className="my-5 divide-y divide-[#e7eee9]">{rows.map(([label, value, detail]) => <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0" key={label}><div><p className="text-sm font-bold text-[#284f51]">{label}</p><p className="mt-0.5 text-[11px] text-[#7b9693]">{detail}</p></div><p className="font-mono text-sm font-medium text-[#17383d]">{value}</p></div>)}</div>
       <div className="flex items-end justify-between border-t border-[#cdded8] pt-4"><div><p className="text-xs font-bold uppercase tracking-wider text-[#66817f]">Total trip cost</p><p data-testid="text-total-cost" className="mt-1 font-mono text-3xl font-medium tracking-tight text-[#17383d]">{money(selectedOption.totalCost)}</p></div><div className="text-right"><p className="text-xs font-bold uppercase tracking-wider text-[#66817f]">Per person</p><p data-testid="text-per-person-cost" className="mt-1 font-mono text-xl font-medium text-[#5aa995]">{money(selectedOption.perPersonCost)}</p></div></div>
    </div>
  );
}

function ComparisonTable({ options, selectedMode, onSelect }: { options: TransportOption[]; selectedMode: Mode; onSelect: (mode: Mode) => void }) {
  return (
    <div id="comparison" className="overflow-hidden rounded-2xl border border-[#d9e4df] bg-[#fbfcf8]">
      <div className="flex items-center justify-between border-b border-[#d9e4df] px-5 py-4 sm:px-6"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#5aa995]">Compare your options</p><h3 className="mt-1 text-lg font-extrabold text-[#17383d]">One trip. Six ways to get there.</h3></div><TrendingDown className="text-[#5aa995]" size={21} /></div>
      <div className="divide-y divide-[#e7eee9] md:hidden">{options.map((option) => <button key={option.mode} type="button" data-testid={`row-mobile-${option.mode}`} onClick={() => onSelect(option.mode)} className={`flex w-full items-center gap-3 p-4 text-left ${selectedMode === option.mode ? 'bg-[#e9f3ee]' : ''}`}><IconBadge mode={option.mode} size={17} /><span className="min-w-0 flex-1"><span className="block text-sm font-extrabold text-[#17383d]">{modeMeta[option.mode].label}</span><span className="block truncate text-[11px] text-[#7b9693]">{option.duration} · {option.note}</span></span><span className="text-right"><span className="block font-mono text-sm text-[#17383d]">{money(option.perPersonCost)}</span><span className="text-[10px] font-bold text-[#7b9693]">/ person</span></span><ChevronDown size={15} className="-rotate-90 text-[#91aaa6]" /></button>)}</div>
      <div className="hidden overflow-x-auto md:block"><table className="w-full text-left"><thead className="bg-[#f1f6f1] text-[10px] font-extrabold uppercase tracking-wider text-[#78928f]"><tr><th className="px-6 py-3">Mode</th><th className="px-4 py-3">Total</th><th className="px-4 py-3">Per person</th><th className="px-4 py-3">Duration</th><th className="px-6 py-3">Good to know</th></tr></thead><tbody className="divide-y divide-[#e7eee9]">{options.map((option) => <tr key={option.mode} data-testid={`row-comparison-${option.mode}`} onClick={() => onSelect(option.mode)} className={`cursor-pointer transition-colors hover:bg-[#f1f6f1] ${selectedMode === option.mode ? 'bg-[#e9f3ee]' : ''}`}><td className="px-6 py-3.5"><span className="flex items-center gap-3"><IconBadge mode={option.mode} size={16} /><span className="text-sm font-extrabold text-[#17383d]">{modeMeta[option.mode].label}</span>{selectedMode === option.mode && <span className="rounded-full bg-[#17383d] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#f5b878]">Selected</span>}</span></td><td className="px-4 py-3.5 font-mono text-sm text-[#284f51]">{money(option.totalCost)}</td><td className="px-4 py-3.5 font-mono text-sm font-medium text-[#17383d]">{money(option.perPersonCost)}</td><td className="px-4 py-3.5 text-sm text-[#527371]">{option.duration}</td><td className="px-6 py-3.5 text-xs text-[#78928f]">{option.note}</td></tr>)}</tbody></table></div>
      <p className="border-t border-[#e7eee9] px-5 py-3 text-[11px] text-[#7b9693] sm:px-6"><Info size={12} className="mr-1 inline-block -translate-y-px" /> Estimates use typical Indian fares and your route inputs. Actual prices can vary.</p>
    </div>
  );
}

function HowItWorks() {
  return <section id="how-it-works" className="scroll-mt-20 border-t border-[#d9e4df] bg-[#edf4ed] px-5 py-20 sm:px-8 lg:px-12"><div className="mx-auto max-w-6xl"><div className="max-w-xl"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#5aa995]">How it works</p><h2 className="mt-3 font-[var(--app-font-serif)] text-4xl font-bold tracking-tight text-[#17383d] sm:text-5xl">A clearer call, in three small steps.</h2></div><div className="mt-12 grid gap-5 md:grid-cols-3">{[['01', 'Set the route', 'Tell us where you are and where you want to go. We use a lightweight city map, so there is no account or API key to slow you down.'], ['02', 'Tune the trip', 'Add your people, fuel price and the little costs that tend to get forgotten. The estimate changes as your plans do.'], ['03', 'Make the call', 'Compare the total and per-person cost across six modes, then pick the balance of time and money that feels right.']].map(([number, title, body]) => <motion.div whileHover={{ y: -4 }} transition={{ duration: .2 }} key={number} className="rounded-2xl border border-[#d9e4df] bg-[#fbfcf8] p-6"><span className="font-mono text-sm text-[#ef9f5b]">{number}</span><h3 className="mt-9 text-lg font-extrabold text-[#17383d]">{title}</h3><p className="mt-3 text-sm leading-6 text-[#66817f]">{body}</p></motion.div>)}</div></div></section>;
}

function Tips() {
  return <section id="tips" className="scroll-mt-20 bg-[#17383d] px-5 py-20 text-[#f7f4ec] sm:px-8 lg:px-12"><div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-center"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#ef9f5b]">Good to know</p><h2 className="mt-3 font-[var(--app-font-serif)] text-4xl font-bold tracking-tight sm:text-5xl">The small costs add up.</h2><p className="mt-5 max-w-md text-sm leading-7 text-[#b0c6c2]">A calm plan beats a perfect prediction. Use your estimate to compare the shape of a trip, not to promise an exact fare.</p></div><div className="grid gap-3 sm:grid-cols-2">{[['Fuel is not the whole bill', 'Tolls, parking and convenience often shift the answer more than a few rupees at the pump.'], ['Share the right number', 'Planning with family? Per-person cost makes a shared taxi or car much easier to weigh.'], ['Time has a price too', 'A faster option can buy back a full afternoon. Compare duration alongside the fare.'], ['Keep a little margin', 'Prices, traffic and platform fees move. Leave room for the real world.']].map(([title, body], index) => <div key={title} className="rounded-2xl border border-[#355c5d] bg-[#1d4549] p-5"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#2b5859] font-mono text-xs text-[#f5b878]">0{index + 1}</span><h3 className="mt-5 text-sm font-extrabold">{title}</h3><p className="mt-2 text-xs leading-5 text-[#9ab1ae]">{body}</p></div>)}</div></div></section>;
}

function Home() {
  const [inputs, setInputs] = useState<TripInputs>(initialInputs);
  const [route, setRoute] = useState<RouteResult>(() => makeRoute(initialInputs));
  const [selectedMode, setSelectedMode] = useState<Mode>('car');
  const [mobileNav, setMobileNav] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [routeNotice, setRouteNotice] = useState('');
  const options = useMemo(() => makeOptions(inputs, route), [inputs, route]);
  const selectedOption = options.find((option) => option.mode === selectedMode) ?? options[0];
  const recommendation: ComparisonRecommendation = useMemo(() => ({
    cheapest: [...options].sort((a, b) => a.totalCost - b.totalCost)[0],
    fastest: [...options].sort((a, b) => durationMinutes(a.duration) - durationMinutes(b.duration))[0],
  }), [options]);
  const { cheapest, fastest } = recommendation;
  const calculate = async (nextInputs = inputs) => {
    setIsCalculating(true);
    setRouteNotice('');
    try {
      setRoute(await makeLiveRoute(nextInputs));
    } catch {
      setRouteNotice('We could not map one of those places. Try a more specific Indian city or landmark.');
    } finally {
      setIsCalculating(false);
    }
  };
  const reset = () => { setInputs(initialInputs); setRoute(makeRoute(initialInputs)); setSelectedMode('car'); setRouteNotice(''); };
  return (
    <div className="grain min-h-[100dvh] bg-[#f7f4ec] text-[#17383d]">
      <header className="sticky top-0 z-40 border-b border-[#d9e4df]/80 bg-[#f7f4ec]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <a href="/" data-testid="link-home" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#17383d] text-[#f5b878]"><RouteIcon size={20} strokeWidth={2.5} /></span>
            <span><span className="block text-[13px] font-extrabold tracking-tight">wayfare</span><span className="block text-[10px] font-semibold uppercase tracking-[.16em] text-[#77918e]">trip calculator</span></span>
          </a>
          <nav className="hidden items-center gap-8 text-xs font-bold text-[#5c7a77] md:flex"><a href="#how-it-works" data-testid="link-how-it-works" className="transition-colors hover:text-[#17383d]">How it works</a><a href="#tips" data-testid="link-tips" className="transition-colors hover:text-[#17383d]">Travel tips</a><a href="#comparison" data-testid="link-compare" className="flex items-center gap-1.5 transition-colors hover:text-[#17383d]">Compare modes <ArrowRight size={13} /></a></nav>
          <button type="button" data-testid="button-mobile-nav" onClick={() => setMobileNav(!mobileNav)} className="grid h-10 w-10 place-items-center rounded-lg border border-[#d9e4df] md:hidden">{mobileNav ? <X size={18} /> : <Menu size={18} />}</button>
        </div>
        {mobileNav && <div className="border-t border-[#d9e4df] bg-[#f7f4ec] px-5 py-4 md:hidden"><div className="flex flex-col gap-4 text-sm font-bold text-[#5c7a77]"><a href="#how-it-works" onClick={() => setMobileNav(false)}>How it works</a><a href="#tips" onClick={() => setMobileNav(false)}>Travel tips</a><a href="#comparison" onClick={() => setMobileNav(false)}>Compare modes</a></div></div>}
      </header>

      <main>
        <section className="mx-auto max-w-[1440px] px-5 pb-10 pt-10 sm:px-8 sm:pt-14 lg:px-12 lg:pt-20">
          <div className="grid gap-9 lg:grid-cols-[minmax(300px,390px)_1fr] lg:gap-12 xl:grid-cols-[390px_1fr]">
            <motion.aside initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .5 }} className="rounded-[24px] bg-[#17383d] p-5 text-[#f7f4ec] shadow-[0_18px_40px_rgba(23,56,61,.12)] sm:p-7 lg:p-8">
              <div className="mb-8 flex items-start justify-between"><div><p className="text-[11px] font-bold uppercase tracking-[.2em] text-[#ef9f5b]">Plan with confidence</p><h1 className="mt-3 max-w-[280px] font-[var(--app-font-serif)] text-3xl font-bold leading-[1.05] tracking-tight sm:text-[34px]">What’s the smartest way there?</h1></div><ShieldCheck className="mt-1 text-[#5aa995]" size={23} /></div>
              <TripForm inputs={inputs} setInputs={setInputs} onCalculate={calculate} onReset={reset} isCalculating={isCalculating} />
              <div className="mt-7 flex items-center gap-2 border-t border-[#355c5d] pt-5 text-[11px] text-[#8daaa6]"><ShieldCheck size={14} className="text-[#5aa995]" /> No sign-up. No tracking. Just a useful estimate.</div>
            </motion.aside>

            <div className="min-w-0">
              <div className="enter mb-8 max-w-3xl"><div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-[#5aa995]"><span className="h-2 w-2 rounded-full bg-[#ef9f5b]" /> Your trip, at a glance</div><h2 className="font-[var(--app-font-serif)] text-[clamp(2.75rem,5vw,5.25rem)] font-bold leading-[.94] tracking-[-.055em] text-[#17383d]">Go farther.<br /><span className="text-[#5aa995]">Spend wiser.</span></h2><p className="mt-5 max-w-lg text-sm leading-6 text-[#66817f] sm:text-base">A simple Indian travel calculator for comparing the real cost of getting from here to there.</p></div>
              <div className="enter enter-delay-1 grid gap-4 sm:grid-cols-[1.3fr_.7fr]">
                <div className="rounded-2xl border border-[#d9e4df] bg-[#fbfcf8] p-5 sm:p-6"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#5aa995]">Route snapshot</p><p data-testid="text-route-endpoints" className="mt-2 flex items-center gap-2 text-lg font-extrabold text-[#17383d]">{route.origin} <ArrowRight size={17} className="text-[#ef9f5b]" /> {route.destination}</p></div><span className="hidden rounded-xl bg-[#e9f3ee] p-3 text-[#5aa995] sm:block"><Navigation size={20} /></span></div><div className="mt-5 grid grid-cols-2 gap-3 border-t border-[#e7eee9] pt-4"><div><p className="text-[10px] font-bold uppercase tracking-wider text-[#88a19e]">Distance</p><p data-testid="text-distance" className="mt-1 font-mono text-xl text-[#17383d]">{route.distance}<small className="ml-1 font-sans text-xs text-[#78928f]">km</small></p></div><div><p className="text-[10px] font-bold uppercase tracking-wider text-[#88a19e]">Estimated drive</p><p data-testid="text-duration" className="mt-1 font-mono text-xl text-[#17383d]">{route.duration}</p></div></div>{routeNotice && <p data-testid="status-route" className="mt-4 rounded-lg bg-[#fff1e6] px-3 py-2 text-xs font-semibold text-[#a45e3d]">{routeNotice}</p>}<p className="mt-3 text-[11px] text-[#7b9693]"><Navigation size={12} className="mr-1 inline-block" /> {route.source === 'OpenStreetMap' ? 'Live route from OpenStreetMap and OSRM.' : route.source === 'estimate' ? 'Routing service is unavailable; showing a direct estimate.' : 'Built-in sample route. Calculate to fetch a live route.'}</p></div>
                <div className="rounded-2xl bg-[#ef9f5b] p-5 text-[#17383d] sm:p-6"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#815b39]">Our quick pick</p><div className="mt-5 flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#f7c38e]"><TrendingDown size={21} /></span><div><p className="text-sm font-extrabold">{modeMeta[cheapest.mode].label} is cheapest</p><p data-testid="text-cheapest" className="mt-0.5 font-mono text-xl">{money(cheapest.perPersonCost)}<small className="font-sans text-[11px]"> / person</small></p></div></div><div className="mt-5 border-t border-[#d88d4e] pt-3 text-[11px] font-semibold text-[#815b39]">Fastest: {modeMeta[fastest.mode].label} · {fastest.duration}</div></div>
              </div>
              <div className="enter enter-delay-2 mt-7"><RouteMap route={route} /></div>
              <div className="enter enter-delay-3 mt-7"><div className="mb-3 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#5aa995]">Choose your ride</p><h3 className="mt-1 text-xl font-extrabold text-[#17383d]">How would you like to go?</h3></div><p className="hidden text-xs text-[#7b9693] sm:block">Tap any option to see its breakdown</p></div><div className="flex gap-3 overflow-x-auto pb-3 md:grid md:grid-cols-3 xl:grid-cols-6">{options.map((option) => <ModeCard option={option} selected={selectedMode === option.mode} onSelect={() => setSelectedMode(option.mode)} key={option.mode} />)}</div></div>
              <div className="mt-5"><Breakdown inputs={inputs} route={route} selectedOption={selectedOption} /></div>
              <div className="mt-5"><ComparisonTable options={options} selectedMode={selectedMode} onSelect={setSelectedMode} /></div>
            </div>
          </div>
        </section>
        <HowItWorks />
        <Tips />
      </main>
      <footer className="bg-[#17383d] px-5 pb-8 sm:px-8 lg:px-12"><div className="mx-auto flex max-w-6xl flex-col gap-4 border-t border-[#355c5d] pt-7 text-xs text-[#8daaa6] sm:flex-row sm:items-center sm:justify-between"><p><span className="font-extrabold text-[#f7f4ec]">wayfare</span> · estimates for everyday journeys</p><p className="flex items-center gap-1.5"><Landmark size={13} /> Made for the road ahead</p></div></footer>
    </div>
  );
}

function Router() {
  return <Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><RoutedErrorBoundary><Router /></RoutedErrorBoundary></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;
