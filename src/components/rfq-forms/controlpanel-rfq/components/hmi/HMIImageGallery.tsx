import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import IndustrialDashboard from './image1';
import MachineStatusDisplay from './image2';
import OperatorSelectionInterface from './image3';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface HMIImageGalleryProps {
  selectedImages: string[];
  onSelectImages: (imagePaths: string[]) => void;
}

const HMIImageGallery: React.FC<HMIImageGalleryProps> = ({ selectedImages, onSelectImages }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  // Sample HMI screen images - replace with your actual image paths
  const hmiScreens = [
    { id: 'screen1', path: 'component_dashboard', name: 'Industrial Dashboard' },
        { id: 'screen2', path: 'component_machine_status', name: 'Machine Status' },
    { id: 'screen3', path: 'component_operator_selection', name: 'Operator Selection' },
    { id: 'screen4', path: '/images/hmi/screen4.png', name: 'Screen 4' },
    { id: 'screen5', path: '/images/hmi/screen5.png', name: 'Screen 5' },
    { id: 'screen6', path: '/images/hmi/screen6.png', name: 'Screen 6' },
    { id: 'screen7', path: '/images/hmi/screen7.png', name: 'Screen 7' },
  ];

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === hmiScreens.length - 1 ? 0 : prevIndex + 1
    );
  }, [hmiScreens.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? hmiScreens.length - 1 : prevIndex - 1
    );
  }, [hmiScreens.length]);

  // Auto-advance to next image every 5 seconds
  useEffect(() => {
    const timer = setInterval(goToNext, 5000);
    return () => clearInterval(timer);
  }, [goToNext]);

  const toggleCurrentImageSelection = () => {
    const currentImagePath = hmiScreens[currentIndex].path;
    const isSelected = selectedImages.includes(currentImagePath);
    let newSelectedImages: string[];
    
    if (isSelected) {
      newSelectedImages = selectedImages.filter(path => path !== currentImagePath);
    } else {
      newSelectedImages = [...selectedImages, currentImagePath];
    }
    
    onSelectImages(newSelectedImages);
  };

  const currentScreen = hmiScreens[currentIndex];
  const isCurrentSelected = selectedImages.includes(currentScreen.path);

  // Get the selected screen objects
  const selectedScreens = hmiScreens.filter(screen => 
    selectedImages.includes(screen.path)
  );

  // Function to remove a selected screen
  const removeSelectedScreen = (screenId: string, e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    const screen = hmiScreens.find(s => s.id === screenId);
    if (screen) {
      onSelectImages(selectedImages.filter(path => path !== screen.path));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-4">Select HMI Screen Layouts</h3>
        
        <div className="relative w-full max-w-4xl mx-auto">
          {/* Navigation Arrows */}
          <button
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-lg hover:scale-110 transition-all duration-200"
            aria-label="Previous image"
          >
            <ChevronLeftIcon className="h-8 w-8" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-lg hover:scale-110 transition-all duration-200"
            aria-label="Next image"
          >
            <ChevronRightIcon className="h-8 w-8" />
          </button>

          {/* Main Image Display */}
          <div className="relative w-full aspect-video bg-gray-50 rounded-xl overflow-hidden shadow-lg">
            {currentScreen.path === 'component_dashboard' ? (
              <div className="w-full h-full overflow-hidden transform scale-90">
                <IndustrialDashboard />
              </div>

            ) : currentScreen.path === 'component_machine_status' ? (
              <div className="w-full h-full overflow-hidden transform scale-90">
                <MachineStatusDisplay />
              </div>
            ) : currentScreen.path === 'component_operator_selection' ? (
              <div className="w-full h-full overflow-hidden transform scale-90">
                <OperatorSelectionInterface />
              </div>
            ) : (
              <Image
                src={currentScreen.path!}
                alt={currentScreen.name}
                layout="fill"
                objectFit="contain"
                className="transition-opacity duration-500 p-4"
                key={currentScreen.id}
              />
            )}
            {/* Image Info and Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <div className="flex items-center justify-between">
                <div className="text-white">
                  <h4 className="font-medium text-lg">{currentScreen.name}</h4>
                  <p className="text-sm text-white/80">
                    {currentIndex + 1} of {hmiScreens.length}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={toggleCurrentImageSelection}
                  className={`px-6 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                    isCurrentSelected
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-white/90 hover:bg-white text-gray-800'
                  }`}
                >
                  {isCurrentSelected ? 'Selected' : 'Select Layout'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail Navigation */}
        <div className="flex justify-center gap-2 mt-4">
          {hmiScreens.map((screen, index) => (
            <button
              key={screen.id}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex ? 'bg-blue-600 scale-125' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to ${screen.name}`}
            />
          ))}
        </div>
      </div>

      {/* Selected Layouts */}
      {selectedScreens.length > 0 && (
        <div className="mt-6">
          <div className="text-sm font-medium text-gray-700 mb-2">
            Selected Layouts: {selectedScreens.length}
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedScreens.map((screen) => (
              <div 
                key={screen.id}
                className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium 
                           hover:bg-blue-200 transition-colors cursor-pointer group"
                onClick={() => {
                  const index = hmiScreens.findIndex(s => s.id === screen.id);
                  if (index >= 0) setCurrentIndex(index);
                }}
              >
                <div className="w-5 h-5 mr-2 rounded-sm overflow-hidden flex-shrink-0 bg-gray-200">
                  {screen.path === 'component_dashboard' ? (
                    <div className="w-full h-full bg-blue-400" title="Industrial Dashboard Component" />

                  ) : screen.path === 'component_machine_status' ? (
                    <div className="w-full h-full bg-gray-600" title="Machine Status Component" />
                  ) : screen.path === 'component_operator_selection' ? (
                    <div className="w-full h-full bg-black" title="Operator Selection Component" />
                  ) : (
                    <Image
                      src={screen.path!}
                      alt=""
                      width={20}
                      height={20}
                      objectFit="cover"
                    />
                  )}
                </div>
                <span>{screen.name}</span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSelectedScreen(screen.id, e);
                  }}
                  className="ml-1 text-blue-500 hover:text-blue-700"
                  aria-label={`Remove ${screen.name}`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.stopPropagation();
                      removeSelectedScreen(screen.id, e);
                    }
                  }}
                >
                  ×
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HMIImageGallery;
