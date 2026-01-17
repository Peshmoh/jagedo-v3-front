//@ts-nocheck
import { Camera } from 'lucide-react';
import PropTypes from 'prop-types';

const ImageUploader = ({ images, setImages }) => {

  // Handle image selection and add the new files to state
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 3) {
      alert("You can upload a maximum of 3 images.");
      return;
    }

    // Create a promise for each file to be read
    const fileReadPromises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          // Resolve with the structure the component needs for rendering
          resolve({
            file: file, // The actual File object for later upload
            dataUrl: reader.result, // The base64 URL for immediate preview
          });
        };
        reader.readAsDataURL(file);
      });
    });
  
    // When all files are read, update the parent state
    Promise.all(fileReadPromises).then((newImages) => {
      setImages((prevImages) => [...prevImages, ...newImages]);
    });
  };

  // Handle deletion safely by filtering the array by index
  const handleDelete = (indexToDelete) => {
    setImages(prevImages => prevImages.filter((_, index) => index !== indexToDelete));
  };

  return (
    <div className='flex w-full flex-wrap gap-6'>
      {/* Map through the images and render them */}
      {images.map((img, index) => {
        // **THE KEY FIX**: Determine the image source. 
        // If 'img' is a string, it's a server URL. 
        // If it's an object, use its 'dataUrl' for the preview.
        const imageUrl = typeof img === 'string' ? img : img.dataUrl;

        return (
          <div key={index} className="flex w-40 h-40 flex-col items-center relative">
            {index === 0 && <span className="mb-1 text-sm font-medium">Front Elevation</span>}
            {index === 1 && <span className="mb-1 text-sm font-medium">Back Elevation</span>}
            {index === 2 && <span className="mb-1 text-sm font-medium">Side Elevation</span>}  
           
            <div className="relative w-40 h-32">
              <img
                src={imageUrl}
                alt={`Uploaded ${index + 1}`}
                className="object-cover rounded w-full h-full"
              />
              <button
                type='button'
                className="absolute top-1 left-1 text-red-500 bg-white p-1 hover:cursor-pointer rounded-full hover:text-red-700"
                onClick={() => handleDelete(index)}
                title="Delete"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
              </button>
            </div>
          </div>
        );
      })}
        
      {/* Uploader button, only shows when there's space */}
      {images.length < 3 && (
        <label className="w-40 h-40 flex flex-col gap-2 items-center justify-center border-2 border-gray-400 border-dashed rounded cursor-pointer aspect-square hover:border-teal-500">
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageUpload}
          />
          <Camera color="grey" size={24} />
          <span className="text-sm text-gray-500">Add Image</span>
        </label>
      )}
    </div>
  );
};

// Update PropTypes to allow strings as well as objects
ImageUploader.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        file: PropTypes.object.isRequired,
        dataUrl: PropTypes.string.isRequired,
      })
    ])
  ).isRequired,
  setImages: PropTypes.func.isRequired,
};

export default ImageUploader;