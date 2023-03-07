import { useState, useEffect } from 'react';
import Searchbar from './Searchbar';
import ImageGallery from './ImageGallery';
import fetchImages from 'api/fetch';
import Button from './Button';
import Loader from './Loader';
import Modal from './Modal';
import { Toaster, toast } from 'react-hot-toast'
import css from './App.module.css';


export function App() {
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [images, setImages] = useState(null);
  const [totalHits, setTotalHits] = useState(0);
  const [imagesOnPage, setImagesOnPage] = useState(0);
  const [currentLargeImageUrl, setCurrentLargeImageUrl] = useState('');
  const [currentImageTags, setCurrentImageTags] = useState('');

   useEffect(() => {
    if (searchInput !== '') {
      setIsLoading(true);

      fetchImages(searchInput, page)
        .then(({ hits, totalHits }) => {
          if (hits.length === 0) {
            setImages(null);
            setTotalHits(0);
            return toast.error(`There is no image with name ${searchInput}`);
          }

          const arrayOfImages = createArrayOfImages(hits);

          setTotalHits(totalHits);
          setImagesOnPage(hits.length);

          return arrayOfImages;
        })
        .then(arrayOfImages => {
          if (page === 1) {
            setImages(arrayOfImages);
            window.scrollTo({
              top: 0,
            });
            return;
          }
          setImages(prevImages => [...prevImages, ...arrayOfImages]);
        })

        .catch(error => {
          toast.error('Sorry, something went wrong. Please try again later.')
        })

        .finally(() => turnOffLoader());
    }
  }, [page, searchInput]);


  const createArrayOfImages = data => {
    const arrayOfImages = data.map(element => ({
      tags: element.tags,
      webformatURL: element.webformatURL,
      largeImageURL: element.largeImageURL,
    }));
    return arrayOfImages;
  };

  const turnOffLoader = () => setIsLoading(false);

  const formSubmitHandler = data => {
    setSearchInput(data);
    setPage(1);
  };

  const nextFetch = () => {
    setPage(prevPage => prevPage + 1 );
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const openModal = e => {
    const currentLargeImageUrl = e.target.dataset.large;
    const currentImageTags = e.target.alt;

    setCurrentLargeImageUrl(currentLargeImageUrl);
    setCurrentImageTags(currentImageTags);
    toggleModal();
  };

    return (
      <div className={css.app}>
        <Toaster
          position='top-left'
          toastOptions={{
            duration: 2000,
          }}/>
        <Searchbar onSubmit={formSubmitHandler} />
        {images && <ImageGallery images={images} openModal={openModal} />}

        {isLoading && <Loader />}
        
        {imagesOnPage >= 12 && imagesOnPage < totalHits && (
          <Button onClick={nextFetch} />
        )}
        
        {showModal && (
          <Modal
            imageUrl={currentLargeImageUrl}
            imageTags={currentImageTags}
            onClose={toggleModal}
          />
        )}
        

      </div>
  );
}
