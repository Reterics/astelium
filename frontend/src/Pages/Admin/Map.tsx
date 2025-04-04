import {useEffect, useRef, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import L from 'leaflet';
import {getFetchOptions} from '../../utils/utils.ts';
import {FiArrowRight, FiCheck, FiTrash} from 'react-icons/fi';

interface MarkerData {
  id: number;
  name: string;
  icon_type?: string;
  description?: string;
  image?: string;
  gps: {lat: number; lng: number};
  tags?: string[];
  isNew?: boolean;
}

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const ClickHandler = ({
  onClick,
}: {
  onClick: (latlng: {lat: number; lng: number}) => void;
}) => {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
};

const Map = () => {
  const [searchParams] = useSearchParams();
  const mapId = searchParams.get('id');
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const popupRef = useRef<L.Popup>(null);

  useEffect(() => {
    const fetchMarkers = async () => {
      if (!mapId) return;
      const response = await fetch(`/api/maps/${mapId}/markers`, {
        ...getFetchOptions(),
      });
      if (response.ok) {
        const data = await response.json();
        setMarkers(data);
      }
    };

    fetchMarkers();
  }, [mapId]);

  const handleMapClick = (latlng: {lat: number; lng: number}) => {
    const newMarker: MarkerData = {
      id: Date.now(),
      name: '',
      description: '',
      gps: latlng,
      isNew: true,
    };
    setMarkers((prev) => [...prev, newMarker]);
  };

  const handleSave = async (marker: MarkerData) => {
    if (!mapId) return;
    const response = await fetch(`/api/maps/${mapId}/markers`, {
      ...getFetchOptions(),
      method: 'POST',
      body: JSON.stringify({
        name: marker.name,
        description: marker.description,
        gps: marker.gps,
      }),
    });
    if (response.ok) {
      const saved = await response.json();
      setMarkers((prev) => prev.map((m) => (m.id === marker.id ? saved : m)));
    }
  };

  const handleDelete = async (id: number) => {
    const response = await fetch(`/api/markers/${id}`, {
      ...getFetchOptions(),
      method: 'DELETE',
    });
    if (response.ok) {
      setMarkers((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const defaultPosition = markers[0]?.gps || {lat: 47.4979, lng: 19.0402};

  return (
    <div className='w-full h-screen'>
      <MapContainer
        center={defaultPosition}
        zoom={13}
        className='w-full h-full'
      >
        <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
        <ClickHandler onClick={handleMapClick} />

        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.gps.lat, marker.gps.lng]}
            icon={defaultIcon}
          >
            <Popup ref={popupRef} className='border-none rounded-md min-w-56'>
              <div className='relative bg-zinc-50 border border-zinc-400 text-zinc-700 p-3 rounded-md shadow-lg w-auto max-w-[98vw] max-h-[98vh] overflow-y-auto'>
                <div className='space-y-3'>
                  <div className='grid grid-cols-1 gap-3'>
                    <div key='name' className='flex flex-col'>
                      <label className='text-sm font-medium text-zinc-700 mb-1'>
                        Name
                      </label>
                      <input
                        type='text'
                        value={marker.name}
                        onChange={(e) =>
                          setMarkers((prev) =>
                            prev.map((m) =>
                              m.id === marker.id
                                ? {...m, name: e.target.value}
                                : m
                            )
                          )
                        }
                        className='p-1 bg-white border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500'
                      />
                    </div>

                    <div key='text' className='flex flex-col'>
                      <label className='text-sm font-medium text-zinc-700 mb-1'>
                        Description
                      </label>
                      <textarea
                        value={marker.description}
                        onChange={(e) =>
                          setMarkers((prev) =>
                            prev.map((m) =>
                              m.id === marker.id
                                ? {...m, description: e.target.value}
                                : m
                            )
                          )
                        }
                        className='p-1 bg-white border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500'
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className='flex min-w-56 justify-between pt-2'>
                  <div>
                    {marker.isNew ? (
                      <button
                        className='flex items-center bg-zinc-800 text-white border border-zinc-400 px-2 py-1 rounded-xs hover:bg-zinc-700'
                        onClick={() => handleSave(marker)}
                      >
                        <FiCheck /> <div className='ms-1'>Save</div>
                      </button>
                    ) : (
                      <button
                        className={
                          'flex items-center text-zinc-800 bg-white border border-zinc-400 px-2 py-1 rounded-xs hover:bg-zinc-200'
                        }
                        onClick={() => handleDelete(marker.id)}
                      >
                        <FiTrash /> <div className='ms-1'>Delete</div>
                      </button>
                    )}
                  </div>
                  <div>
                    <button
                      className={
                        'flex items-center text-zinc-800 bg-white border border-zinc-400 px-2 py-1 rounded-xs hover:bg-zinc-200'
                      }
                      onClick={() => popupRef.current?.remove()}
                    >
                      <FiArrowRight /> <div className='ms-1'>Close</div>
                    </button>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
