import React, { useState } from 'react';
import Link from 'next/link';


const CreatePost = () => {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [mileage, setMileage] = useState('');
  const [color, setColor] = useState('');
  const [modifications, setModifications] = useState('');
  const [price, setPrice] = useState('');
  const [openToTrades, setOpenToTrades] = useState(false);
  const [contactInfo, setContactInfo] = useState('');
  const [photos, setPhotos] = useState([]);


  const handleSubmit = (e) => {
    e.preventDefault();


    // Form validation and submission logic here


    // Once the post is submitted, you can redirect to the marketplace page
    // or display a success message to the user
  };


  return (
    <div>
      <header>
        <h1>Create Post</h1>
      </header>
      <main>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="make">Make:</label>
            <input
              type="text"
              id="make"
              value={make}
              onChange={(e) => setMake(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="model">Model:</label>
            <input
              type="text"
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="year">Year:</label>
            <input
              type="text"
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="mileage">Mileage:</label>
            <input
              type="text"
              id="mileage"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="color">Color:</label>
            <input
              type="text"
              id="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="modifications">Modifications:</label>
            <textarea
              id="modifications"
              value={modifications}
              onChange={(e) => setModifications(e.target.value)}
            ></textarea>
            <p>
              This will be a paragraph where you can enter any modifications to
              the vehicle you or a dealer has made.
            </p>
          </div>
          <div>
            <label htmlFor="price">Price:</label>
            <input
              type="text"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="openToTrades">Open to Trades?</label>
            <select
              id="openToTrades"
              value={openToTrades ? 'yes' : 'no'}
              onChange={(e) => setOpenToTrades(e.target.value === 'yes')}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
          <div>
            <label htmlFor="contactInfo">Contact Information:</label>
            <textarea
              id="contactInfo"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
            ></textarea>
            <p>
              In this paragraph, you could add your pickup location, phone
              number, or email. Otherwise, a buyer can message your account
              directly.
            </p>
          </div>
          <div>
            <label htmlFor="photos">Upload photo(s):</label>
            <input
              type="file"
              id="photos"
              accept="image/*"
              multiple
              onChange={(e) => setPhotos(e.target.files)}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </main>
      <footer>
        <ul>
          <li>
            <Link href="/map">
              <span>Map</span>
            </Link>
          </li>
          <li>
            <Link href="/featured-rides">
              <span>Featured Rides</span>
            </Link>
          </li>
          <li>
            <Link href="/home">
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link href="/marketplace">
              <span>Marketplace</span>
            </Link>
          </li>
          <li>
            <Link href="/profile">
              <span>Profile</span>
            </Link>
          </li>
        </ul>
      </footer>
      <style jsx>{`
        div {
          margin: 20px;
        }


        header {
          background-color: #007bff;
          padding: 10px;
          color: white;
          text-align: center;
        }


        main {
          padding: 20px;
        }


        form {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }


        label {
          font-weight: bold;
        }


        textarea {
          height: 100px;
          resize: vertical;
        }


        button {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 10px 20px;
          cursor: pointer;
        }


        footer {
          background-color: #f8f9fa;
          padding: 10px;
          text-align: center;
        }


        ul {
          display: flex;
          justify-content: center;
          list-style: none;
          padding: 0;
        }


        ul li {
          margin-right: 10px;
        }


        span {
          color: #007bff;
          text-decoration: none;
          font-weight: bold;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};


export default CreatePost;
