import React, { FormEvent, useState, ChangeEvent, MouseEventHandler } from "react";
import { Map, Marker, TileLayer } from 'react-leaflet';
import { LeafletMouseEvent } from "leaflet";
import L from 'leaflet';

import { FiPlus, FiX } from "react-icons/fi";

import mapMarkerImg from '../images/map-marker.svg';

import '../styles/pages/create-orphanage.css';
import Sidebar from "../components/Sidebar";

const happyMapIcon = L.icon({
  iconUrl: mapMarkerImg,

  iconSize: [58, 68],
  iconAnchor: [29, 68],
  popupAnchor: [0, -60]
})

export default function CreateOrphanage() {
  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });
  
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [instructions, setInstructions] = useState('');
  const [opening_hours, setOpeningHours] = useState('');
  const [open_on_weekends, setOpenOnWeekends] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([])
  
  function handleMapClick(event: LeafletMouseEvent){
    const { lat, lng } = event.latlng;
    
    setPosition({
      latitude: lat,
      longitude: lng
    })
  }
  
  function handleSelectedImages(event: ChangeEvent<HTMLInputElement>){
    if(!event.target.files){
      return;
    }

    const seletectImages = Array.from(event.target.files)

    setImages(seletectImages);
    
    const selectedImagesPreview = seletectImages.map(image => {
      return URL.createObjectURL(image);
    })

    setPreviewImages(selectedImagesPreview);
  }

  function handleRemoveImage(img: BlobPart){
    const imgs = images.filter(i => i !== img)
    console.log(imgs)
    setImages(images.filter(i => i !== img));
  }

  function handleSubmit(event: FormEvent){
    event.preventDefault();

    const { latitude, longitude } = position;

    console.log({
      name,
      about,
      instructions,
      opening_hours,
      latitude,
      longitude,
      open_on_weekends
    })
  }

  return (
    <div id="page-create-orphanage">
      
      <Sidebar />

      <main>
        <form onSubmit={handleSubmit} className="create-orphanage-form">
          <fieldset>
            <legend>Dados</legend>

            <Map 
              center={[-25.0966595,-50.1826068]} 
              style={{ width: '100%', height: 280 }}
              zoom={13}
              onclick={handleMapClick}
            >
              <TileLayer 
                url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
              />

              { position.latitude !== 0 && (
                  <Marker 
                    interactive={false} 
                    icon={happyMapIcon} 
                    position={[position.latitude,position.longitude]} 
                  />
                )
              }

            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input 
                id="name" 
                value={name} 
                onChange={e => setName(e.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea 
                id="about" 
                maxLength={300} 
                value={about} 
                onChange={e => setAbout(e.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">

                {
                  previewImages.map(image =>{
                    return (
                      <span key={`span-${image}`} className="remove-image-box">
                        <img key={`icon-${image}`} src={image} alt={name}/>
                        <button type="button" onClick={() => handleRemoveImage(image) } key={image} className="remove-image"><FiX color="#000000"/></button>
                      </span>
                    )
                  })
                }

                <label htmlFor="image[]" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>

              </div>
              <input 
                multiple 
                type="file" 
                id="image[]"
                onChange={handleSelectedImages}
              />

            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea 
                id="instructions" 
                value={instructions} 
                onChange={e => setInstructions(e.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horário de funcionamento</label>
              <input 
                id="opening_hours" 
                value={opening_hours} 
                onChange={e => setOpeningHours(e.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button 
                    type="button" 
                    className={open_on_weekends ? 'active' : ''}
                    onClick={() => setOpenOnWeekends(true)}
                  >
                    Sim
                </button>
                <button 
                  type="button"
                  className={!open_on_weekends ? 'active' : ''}
                  onClick={() => setOpenOnWeekends(false)}
                >
                  Não
                </button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
